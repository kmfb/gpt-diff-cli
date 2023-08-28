import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config";
import { execa } from "execa";
import { handleByGPT } from "./GPTDiff.mjs";
import fs from "fs";

const isInDocker = fs.existsSync("/toBeDiffed");

if (isInDocker) {
  process.chdir("/toBeDiffed");
}

if (!fs.existsSync(".git")) {
  console.log(
    "No .git directory found, please run this command in a git repository"
  );
  process.exit(1);
}

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

const argv = yargs(hideBin(process.argv)).argv;

// Filter out the "diff" command if it's mistakenly passed along
const argsWithoutDiff = argv._.filter((arg) => arg !== "diff");

if (argsWithoutDiff.length === 0) {
  console.error("Please provide arguments for git diff.");
  process.exit(1);
}

runGitDiff(argsWithoutDiff);
