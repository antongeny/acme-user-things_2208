DROP TABLE IF EXISTS things;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(20)
);
CREATE TABLE things(
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  description TEXT,
  "userId" INTEGER REFERENCES users(id)
);

INSERT INTO users(name) VALUES('moe');
INSERT INTO users(name) VALUES('lucy');
INSERT INTO users(name) VALUES('larry');
INSERT INTO users(name) VALUES('ethyl');

INSERT INTO things(name, "userId", description) VALUES('foo', 1, 'foo description');
INSERT INTO things(name, "userId", description) VALUES('bar', 1, 'bar description');
INSERT INTO things(name, "userId", description) VALUES('bazz', 2, 'bazz description');
