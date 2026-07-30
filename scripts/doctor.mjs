import { spawnSync } from "node:child_process";

const minimumNodeMajor = 20;
const minimumNodeMinor = 9;
let failed = false;

function pass(message) {
  console.log(`✓ ${message}`);
}

function fail(message, recovery) {
  failed = true;
  console.error(`✗ ${message}`);
  if (recovery) console.error(`  ${recovery}`);
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    env: process.env,
  });
}

const [nodeMajor, nodeMinor] = process.versions.node
  .split(".")
  .map((part) => Number(part));
if (
  nodeMajor > minimumNodeMajor ||
  (nodeMajor === minimumNodeMajor && nodeMinor >= minimumNodeMinor)
) {
  pass(`Node ${process.versions.node}`);
} else {
  fail(
    `Node ${process.versions.node} is too old.`,
    `Install Node ${minimumNodeMajor}.${minimumNodeMinor} or newer, then run npm install again.`,
  );
}

const codexVersion = run("codex", ["--version"]);
if (codexVersion.error?.code === "ENOENT") {
  fail(
    "Codex CLI is not available.",
    "Run npm install. This project includes the Codex CLI as a development dependency.",
  );
} else if (codexVersion.status !== 0) {
  fail(
    "Codex CLI could not start.",
    (codexVersion.stderr || codexVersion.stdout).trim(),
  );
} else {
  pass(codexVersion.stdout.trim());

  const execHelp = run("codex", ["exec", "--help"]);
  const helpText = `${execHelp.stdout}\n${execHelp.stderr}`;
  const requiredFlags = [
    "--ephemeral",
    "--ignore-user-config",
    "--skip-git-repo-check",
  ];
  const missingFlags = requiredFlags.filter((flag) => !helpText.includes(flag));

  if (execHelp.status !== 0 || missingFlags.length > 0) {
    fail(
      "This Codex CLI version does not support the local adapter.",
      `Run npm install to update it. Missing: ${missingFlags.join(", ") || "exec help"}.`,
    );
  } else {
    pass("Codex non-interactive mode supports the required safety flags");
  }

  const loginStatus = run("codex", ["login", "status"]);
  const loginText = `${loginStatus.stdout}\n${loginStatus.stderr}`.trim();

  if (loginStatus.status !== 0) {
    fail(
      "Codex is not authenticated.",
      "Run npm run codex:login and complete the ChatGPT browser sign-in.",
    );
  } else if (!loginText.toLowerCase().includes("chatgpt")) {
    fail(
      `Codex is authenticated, but not with ChatGPT (${loginText}).`,
      "Run codex logout, then npm run codex:login to use your Codex subscription instead of API billing.",
    );
  } else {
    pass(loginText);
  }
}

if (failed) {
  console.error("\nMotive is not ready to start yet.");
  process.exitCode = 1;
} else {
  console.log("\nMotive is ready. No OpenAI API key is required.");
}
