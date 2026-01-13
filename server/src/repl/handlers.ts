import { executeSQL } from "../parser";
import {
  createNewDatabase,
  REPLState,
  saveCurrentDatabase,
  switchDatabase,
} from "./db-state";

export function handleCommand(state: REPLState, input: string): boolean {
  const upperInput = input.toUpperCase().trim();
  //create database state here
  if (upperInput.startsWith("CREATE DATABASE")) {
    try {
      const match = input.match(/CREATE DATABASE\s+(\w+)/i);
      if (!match) {
        console.log("Error: Invalid CREATE DATABASE syntax");
        return true;
      }
      createNewDatabase(state, match[1]);
    } catch (error) {
      console.log(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
    return true;
  }

  //switch dbs
  if (upperInput.startsWith("USE")) {
    try {
      const match = input.match(/USE\s+(\w+)/i);
      if (!match) {
        console.log("✗ Error: Invalid USE syntax");
        return true;
      }
      switchDatabase(state, match[1]);
    } catch (error) {
      console.log(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
    return true;
  }

  const result = executeSQL(state.currentDb, state.databases, input);

  if (result.success) {
    if (result.rows) {
      console.log("rows", result.rows);
    }
    if (result.message) {
      console.log(`${result.message}`);
    }
    if (result.rowCount !== undefined) {
      console.log(
        `(${result.rowCount} row${result.rowCount !== 1 ? "s" : ""})`
      );
    }

    // Save chnages in the memory
    if (
      upperInput.includes("INSERT") ||
      upperInput.includes("UPDATE") ||
      upperInput.includes("DELETE") ||
      upperInput.includes("CREATE TABLE") ||
      upperInput.includes("DROP TABLE")
    ) {
      saveCurrentDatabase(state);

      
    }
  } else {
    console.log(`Error: ${result.message}`);
  }

  return true;
}
