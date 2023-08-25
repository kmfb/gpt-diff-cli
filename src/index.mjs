import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config";
import { execa } from "execa";
import { handleByGPT } from "./GPTDiff.mjs";
import fs from "fs";

// Check if there is a .git directory, if not error out
if (!fs.existsSync(".git")) {
  console.log(
    "No .git directory found, please run this command in a git repository"
  );
  process.exit(1);
}
// Set the OpenAI API key to use
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error(
    "Please set the API_KEY environment variable to your OpenAI API key found here: https://beta.openai.com/account/api-keys."
  );
  process.exit(1);
}

async function runGitDiff(args) {
  try {
    const { stdout } = await execa("git", ["diff", ...args]);
    handleByGPT(stdout);
  } catch (error) {
    console.error("Error running git diff:", error.message);
  }
}

yargs(hideBin(process.argv))
  .command(
    "diff [args...]",
    "run git diff with provided arguments",
    (yargs) => {
      yargs.positional("args", {
        describe: "arguments for git diff",
        type: "array",
      });
    },
    (argv) => {
      runGitDiff(argv.args);
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;
