const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_users_things_2208');
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT things.name, users.name as user_name, things.id
      FROM things
      LEFT JOIN users
      ON users.id = things."userId"
    `;
    const response = await client.query(SQL);
    const things = response.rows;
    res.send(`
      <html>
        <head>
          <title>Acme Users and Things</title>
        </head>
        <body>
          <h1>Acme Users and Things</h1>
          <ul>
            ${
              things.map( thing => {
                return `<li>
                  <a href='/things/${thing.id}'>${ thing.name }</a> owned by ${ thing.user_name || 'nobody' }
                </li>`
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/things/:id', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT things.name, users.name as user_name, things.id, things.description
      FROM things
      LEFT JOIN users
      ON users.id = things."userId"
      WHERE things.id = $1
    `;
    const response = await client.query(SQL, [ req.params.id ]);
    const things = response.rows;
    const thing = things[0];
    res.send(`
      <html>
        <head>
          <title>Acme Users and Things</title>
        </head>
        <body>
          <h1>Acme Users and Things</h1>
          <a href='/'>All Things</a>
          <h2>Details for ${ thing.name } owned by ${ thing.user_name ? thing.user_name: 'nobody' }</h2>
          <p>
            ${ thing.description }
          </p>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

const readFile = (file)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(file, (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve(data.toString());
      }
    });
  });
};

const init = async()=> {
  try {
    console.log('starting');
    await client.connect();
    const SQL = await readFile('seed.sql');
    await client.query(SQL);
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();
