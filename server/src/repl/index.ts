import * as readline from "readline";
import { createREPLState, loadExistingDatabases } from "./db-state";
import { displayBanner, displayHelp } from "./display";
import { handleCommand } from "./handlers";
import { initStorage } from "../storage/persistence";

export function startREPL(basePath: string = "./data"): void {
  initStorage(basePath);

  const state = createREPLState(basePath);

  console.log("state", state);

  loadExistingDatabases(state);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "gerald@mydb> ",
  });

  displayBanner();

  rl.prompt();

  //   rl.on("history", (history) => {
  //     console.log(`Received: ${history}`);
  //   });

  rl.on("line", (line: string) => {
    const input = line.trim();
    if (
      input.toLowerCase() === "exit" ||
      input.toLowerCase() === "quit" ||
      input.toLowerCase() === "q"
    ) {
      rl.close();
      process.exit(0);
    }

    if (!input) {
      rl.setPrompt(state.currentDb ? `${state.currentDb.name}> ` : "mydb> ");
      rl.prompt();
      console.log("command not found");
      return;
    }

    if (input.toLowerCase() === "help") {
      displayHelp();
      rl.setPrompt(state.currentDb ? `${state.currentDb.name}> ` : "mydb> ");
      rl.prompt();
      return;
    }

    //excute the sql commands here
    handleCommand(state, input);

    console.log();
    rl.setPrompt(state.currentDb ? `${state.currentDb.name}> ` : "mydb> ");
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}

if (require.main === module) {
  startREPL();
}
