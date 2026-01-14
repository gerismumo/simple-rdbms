export function displayHelp(): void {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                     MyRDBMS Commands                           ║
╚════════════════════════════════════════════════════════════════╝

Database Management:
  CREATE DATABASE <name>            - Create a new database
  USE <name>                        - Switch to a database
  SHOW DATABASES                    - List all databases
  DROP DATABASE <name>              - Delete a database

Table Management:
  CREATE TABLE <n> (<columns>)      - Create a new table
  DROP TABLE <n>                    - Drop a table
  SHOW TABLES                       - List all tables
  DESCRIBE <table>                  - Show table structure

Data Operations:
  INSERT INTO <t> (...) VALUES (...) - Insert a row
  SELECT <columns> FROM <t> [WHERE ...] - Query data
  UPDATE <t> SET ... [WHERE ...]    - Update rows
  DELETE FROM <t> WHERE ...         - Delete rows

Indexing:
  CREATE INDEX <n> ON <t> (<col>)   - Create an index
  CREATE UNIQUE INDEX <n> ON <t> (<col>) - Create unique index

Joins:
  SELECT ... FROM <t1> INNER JOIN <t2> ON <t1>.<col> = <t2>.<col>

System Commands:
  help                              - Show this help
  exit / quit                       - Exit the shell

Example Workflow:
  CREATE DATABASE myapp;
  USE myapp;
  CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE);
  INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
  SELECT * FROM users WHERE id = 1;
  CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, product VARCHAR(100), price FLOAT);
  INSERT INTO orders (user_id, product, price) VALUES (1, 'Laptop', 1200.50);
  SELECT users.id, users.name, orders.product, orders.price FROM users INNER JOIN orders ON users.id = orders.user_id WHERE users.id = 1;
  UPDATE orders SET price = 1100.00 WHERE id = 1;
  `);
}

export function displayBanner(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              Gerald's RDBMS - Interactive Database Shell      ║
║              Functional Relational Database System            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Type 'help' for available commands or 'exit' to quit
  `);
}