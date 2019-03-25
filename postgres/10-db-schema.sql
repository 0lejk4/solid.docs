\c storage;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_date TIMESTAMP,
  UNIQUE(email),
  UNIQUE(username)
);

CREATE INDEX idx_user_username ON users(username);

CREATE TABLE IF NOT EXISTS file_types (
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  extension varchar(255) NOT NULL,
  description TEXT,
  actions varchar(255) [],
  creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  file_type_id INT NOT NULL,
  name varchar(255) NOT NULL,
  location varchar(255) NOT NULL,
  creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_date TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (file_type_id) REFERENCES file_types(id)
);

CREATE INDEX idx_user_files ON files(user_id);

insert into users (username, email, password) values ('test', 'oleg@krutoi.da', '$2b$10$x7XJ9RzDufnt5U4kgUJqVOrnpKbyM0EUUFh3iSX/4BKr9QMrYlwE6');
