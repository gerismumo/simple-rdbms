import * as readline from "readline";
import { showHelp } from "./show-help";

export function startREPL(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "gerald@mydb> ",
  });

  console.log("=================================");
  console.log("Gerald's REPL - Interactive Shell");
  console.log("Welcome user!");
  console.log("=================================");
  console.log('Type anything or "exit" to quit\n');

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
      rl.prompt();
      console.log("command not found")
      return;
    }

    if (input.toLowerCase() === "help") {
      showHelp()
      rl.prompt();
      return;
    }

    //excute the sql commands here 

    // console.log(`You typed: "${input}"`);

    console.log();
    rl.prompt();
  });


  rl.on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}
