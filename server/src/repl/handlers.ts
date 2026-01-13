import { createNewDatabase, REPLState } from "./db-state";

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
  return true;
}
