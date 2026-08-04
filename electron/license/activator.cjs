const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { generateHWID } = require("./hwid.cjs");

const ACTIVATION_FILE = "activation.dat";
const ENCRYPTION_KEY = "vm-activation-secret-key-2024-secure";

function getActivationPath() {
  const appData = process.env.APPDATA || path.join(require("os").homedir(), "AppData", "Roaming");
  const dir = path.join(appData, "VisitorManagement");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, ACTIVATION_FILE);
}

function encrypt(text) {
  const key = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const key = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function saveActivation(licenseKey, hwid) {
  const data = JSON.stringify({
    key: licenseKey,
    hwid: hwid,
    activatedAt: new Date().toISOString(),
    version: "1.0.0",
  });

  const encrypted = encrypt(data);
  fs.writeFileSync(getActivationPath(), encrypted, "utf8");
}

function loadActivation() {
  const filePath = getActivationPath();
  if (!fs.existsSync(filePath)) return null;

  try {
    const encrypted = fs.readFileSync(filePath, "utf8");
    const decrypted = decrypt(encrypted);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

async function isActivated() {
  const activation = loadActivation();
  if (!activation) return false;

  const hwid = await generateHWID();
  if (activation.hwid !== hwid.hash) {
    return false;
  }

  return true;
}

function deactivate() {
  const filePath = getActivationPath();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = { saveActivation, loadActivation, isActivated, deactivate };
