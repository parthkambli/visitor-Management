const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KEYS_DIR = path.join(__dirname, "..", "electron", "license");
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, "private.key");
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, "public.key");

if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
  console.log("Key pair already exists. Delete the files to regenerate.");
  console.log("  Private:", PRIVATE_KEY_PATH);
  console.log("  Public:", PUBLIC_KEY_PATH);
  process.exit(0);
}

console.log("Generating RSA-2048 key pair...");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);

console.log("Key pair generated successfully!");
console.log("  Private key:", PRIVATE_KEY_PATH);
console.log("  Public key:", PUBLIC_KEY_PATH);
console.log("");
console.log("IMPORTANT: Keep the private key SECRET. Never share it.");
console.log("The public key is embedded in the app for verification.");
