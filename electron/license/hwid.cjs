const { exec } = require("child_process");
const crypto = require("crypto");

let cachedHWID = null;

function runPowerShell(command) {
  return new Promise((resolve) => {
    exec(
      `powershell -NoProfile -Command "${command}"`,
      { encoding: "utf8", timeout: 10000, windowsHide: true },
      (error, stdout) => {
        if (error) resolve("");
        else resolve(stdout.trim());
      }
    );
  });
}

async function generateHWID() {
  if (cachedHWID) return cachedHWID;

  const [cpu, mb, disk] = await Promise.all([
    runPowerShell("Get-CimInstance Win32_Processor | Select-Object -ExpandProperty ProcessorId"),
    runPowerShell("Get-CimInstance Win32_BaseBoard | Select-Object -ExpandProperty SerialNumber"),
    runPowerShell("Get-CimInstance Win32_DiskDrive | Select-Object -First 1 -ExpandProperty SerialNumber"),
  ]);

  const cpuId = cpu || "UNKNOWN_CPU";
  const mbId = mb || "UNKNOWN_MB";
  const diskId = disk ? disk.replace(/\s/g, "") : "UNKNOWN_DISK";

  const raw = `${cpuId}|${mbId}|${diskId}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  cachedHWID = {
    hash,
    short: hash.substring(0, 32).toUpperCase(),
    raw: { cpu: cpuId, motherboard: mbId, disk: diskId },
  };

  return cachedHWID;
}

module.exports = { generateHWID };
