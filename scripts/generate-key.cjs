const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const PRIVATE_KEY_PATH = path.join(__dirname, "..", "electron", "license", "private.key");

if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.log("No private key found. Run 'npm run generate-keypair' first.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function formatKey(hwidHash, signatureHex) {
  const raw = hwidHash + signatureHex;
  const groups = [];
  for (let i = 0; i < raw.length; i += 5) {
    groups.push(raw.substring(i, i + 5));
  }
  return groups.join("-");
}

async function main() {
  console.log("=== Visitor Management - License Key Generator ===\n");

  const hwid = (await ask("Enter customer HWID (32 hex characters): ")).trim().toUpperCase();

  if (hwid.length !== 32 || !/^[A-F0-9]+$/.test(hwid)) {
    console.log("Invalid HWID. Must be 32 hex characters.");
    rl.close();
    process.exit(1);
  }

  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");

  const signer = crypto.createSign("sha256");
  signer.update(hwid);
  const signature = signer.sign(privateKey);
  const signatureHex = signature.toString("hex");

  const key = formatKey(hwid, signatureHex);

  console.log("\n--- License Key ---\n");
  console.log(key);
  console.log("\n-------------------\n");
  console.log("Key generated successfully. Share this with the customer.");

  rl.close();
}

main();
