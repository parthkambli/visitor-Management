# Visitor Management — Windows Installer + License System Plan

## Overview

Package the Electron app as a Windows installer with an offline license activation system to prevent unauthorized distribution.

---

## Part 1: Windows Installer (electron-builder)

### What
Package the Electron app as a `.exe` NSIS installer for Windows using `electron-builder`.

### Steps
1. Install `electron-builder` as a dev dependency
2. Add `build` config to `package.json` (Windows NSIS target, app metadata, icons)
3. Add scripts: `package:win` (build installer), `package:dir` (test without installer)
4. The installer produces `Visitor-Management-Setup-1.0.0.exe`

### Config Addition (package.json)
```json
"build": {
  "appId": "com.visitormanagement.app",
  "productName": "Visitor Management",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "electron/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "installerIcon": "build/icon.ico",
    "uninstallerIcon": "build/icon.ico"
  }
}
```

### New Scripts
```json
"package:win": "npm run build && electron-builder --win",
"package:dir": "npm run build && electron-builder --win --dir"
```

---

## Part 2: Offline License System

### How It Works
- On first launch, the app shows an **Activation Screen** instead of the main UI
- User enters a license key provided after purchase
- The app validates the key **locally** using RSA signature verification
- License is **bound to the machine** via HWID (hardware fingerprint)
- Once activated, the app stores an encrypted activation file locally
- Subsequent launches verify the stored activation matches the current machine

### Security Model (RSA Signing)
- You hold a **private key** (never shared) — used to generate license keys
- The app contains only the **public key** — used to verify keys
- Even if someone reverse-engineers the app, they can't generate valid keys without your private key

### HWID Generation (Machine Fingerprint)
Combines hardware identifiers to create a unique hash per machine:
- CPU ID
- Motherboard Serial Number
- Disk Serial Number

Output: SHA-256 hash → unique machine fingerprint

### License Key Format
```
XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
```
Encoded data: HWID hash + expiry + metadata, signed with your private key using RSA-SHA256.

### Activation Flow
```
App Launch
  → Check for stored activation file
  → If not found → Show Activation screen
  → User enters key → App validates signature + HWID match
  → If valid → Save encrypted activation, show main app
  → If invalid → Show error, stay on Activation screen
```

### Key Generation Tool
A separate CLI script (`scripts/generate-key.cjs`) you run locally:
- Input: customer HWID + metadata (name, expiry, etc.)
- Output: license key string
- You share this key with the customer after purchase
- **Never ship this script in the installer**

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `package.json` | Add electron-builder config + scripts |
| `electron/license/crypto.cjs` | RSA key management, HWID generation, key validation |
| `electron/license/activator.cjs` | Activation logic — validate key, save/load activation file |
| `electron/ipc/licenseIpc.cjs` | IPC handlers: `license:activate`, `license:check`, `license:deactivate` |
| `electron/preload.cjs` | Expose license API methods to renderer |
| `electron/main.cjs` | Check license on startup, show activation or main window |
| `src/pages/Activation.jsx` | Activation screen UI (key input form) |
| `src/App.jsx` | Route gating — redirect to Activation if not licensed |
| `scripts/generate-key.cjs` | CLI tool to generate license keys (dev only) |
| `scripts/keys/` | Directory to store your RSA key pair (gitignored) |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Renderer                     │
│                                               │
│  ┌─────────────┐    ┌──────────────────────┐ │
│  │ Activation   │───▶│  Main App (Dashboard)│ │
│  │ Screen       │    │                      │ │
│  └──────┬──────┘    └──────────────────────┘ │
│         │                                     │
└─────────┼─────────────────────────────────────┘
          │ window.electronAPI.*
          ▼
┌─────────────────────────────────────────────┐
│              Preload Bridge                   │
│  license:activate(key)                       │
│  license:check()                             │
│  license:deactivate()                        │
└─────────┬───────────────────────────────────┘
          │ ipcRenderer.invoke()
          ▼
┌─────────────────────────────────────────────┐
│              Main Process                     │
│                                               │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ licenseIpc   │  │ license/               │ │
│  │              │──│  crypto.cjs            │ │
│  │              │  │  activator.cjs         │ │
│  └──────────────┘  └───────────────────────┘ │
│                                               │
│  main.cjs: on launch → license:check()       │
│    → valid? show window                      │
│    → invalid? show activation                 │
└─────────────────────────────────────────────┘
```

---

## Security Considerations

1. **Private key never shipped** — only the public key is embedded in the app
2. **HWID binding** — license only works on the machine it was generated for
3. **Encrypted activation file** — prevents manual tampering
4. **No server required** — everything works offline
5. **RSA signature** — mathematically impossible to forge without private key

### Limitations to Acknowledge
- A skilled attacker could theoretically patch the license check in the binary
- This is true for all client-side protection — no offline system is 100% uncrackable
- The HWID + RSA approach stops 99% of casual piracy (sharing installers)
- For maximum security, consider adding online verification later

---

## Implementation Order

1. Set up electron-builder and create Windows installer
2. Implement HWID generation
3. Implement RSA key pair generation (you run once)
4. Implement license key validation logic
5. Implement activation file storage
6. Build IPC bridge for license operations
7. Build Activation screen UI
8. Add route gating in App.jsx
9. Add startup license check in main.cjs
10. Create key generation CLI tool
11. Test full flow: generate key → activate → verify on relaunch
