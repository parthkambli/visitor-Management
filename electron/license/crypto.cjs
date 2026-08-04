const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { generateHWID } = require("./hwid.cjs");

const ALGORITHM = "sha256";

function getPublicKey() {
  const possiblePaths = [
    path.join(__dirname, "public.key"),
    path.join(process.resourcesPath || "", "public.key"),
    path.join(process.cwd(), "electron", "license", "public.key"),
    path.join(process.cwd(), "public.key"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf8");
    }
  }
  return null;
}

function parseLicenseKey(key) {
  const cleaned = key.replace(/\s/g, "").trim();
  const raw = cleaned.replace(/-/g, "");

  if (raw.length < 33) return null;

  const hwidHash = raw.substring(0, 32).toUpperCase();
  const signatureHex = raw.substring(32);

  return { hwidHash, signatureHex };
}

async function verifyLicenseKey(key) {
  const parsed = parseLicenseKey(key);
  if (!parsed) return { valid: false, error: "Invalid key format" };

  const publicKey = getPublicKey();
  if (!publicKey) return { valid: false, error: "Public key not found" };

  const hwid = await generateHWID();

  if (parsed.hwidHash !== hwid.short) {
    return { valid: false, error: "This license key is not valid for this machine" };
  }

  try {
    if (!/^[0-9a-fA-F]+$/.test(parsed.signatureHex)) {
      return { valid: false, error: "Invalid key format" };
    }

    const signature = Buffer.from(parsed.signatureHex, "hex");
    const verifier = crypto.createVerify(ALGORITHM);
    verifier.update(parsed.hwidHash);

    const isValid = verifier.verify(publicKey, signature);

    if (!isValid) {
      return { valid: false, error: "Invalid license key" };
    }

    return {
      valid: true,
      hwid: hwid.hash,
      keyId: key,
    };
  } catch {
    return { valid: false, error: "Failed to verify license key" };
  }
}

function formatLicenseKey(hwidHash, signatureHex) {
  const raw = hwidHash + signatureHex;
  const groups = [];
  for (let i = 0; i < raw.length; i += 5) {
    groups.push(raw.substring(i, i + 5));
  }
  return groups.join("-");
}

module.exports = { verifyLicenseKey, parseLicenseKey, formatLicenseKey, getPublicKey };
