export function showHelp(): void {
    console.log(`
Available Commands:
  CREATE TABLE <name> (<columns>)          - Create a new table
  DROP TABLE <name>                        - Drop a table
  INSERT INTO <table> (...) VALUES (...)   - Insert a row
  SELECT <columns> FROM <table> [WHERE ...]- Query data
  UPDATE <table> SET ... [WHERE ...]       - Update rows
  DELETE FROM <table> WHERE ...            - Delete rows
  CREATE INDEX <name> ON <table> (<column>)- Create an index
  SHOW TABLES                              - List all tables
  DESCRIBE <table>                         - Show table structure
  help                                     - Show this help
  exit                                     - Exit the shell

Example:
  CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE)
  INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com')
  SELECT * FROM users WHERE id = 1
    `);
  }