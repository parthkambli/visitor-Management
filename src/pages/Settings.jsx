import { useEffect, useState } from "react";
import Card from "../Components/UI/Card";
import Input from "../Components/UI/Input";
import Button from "../Components/UI/Button";

function Settings() {
  const [organizationName, setOrganizationName] = useState("");
  const [passPrefix, setPassPrefix] = useState("VIS");
  const [startingNumber, setStartingNumber] = useState("0001");
  const [autoIncrement, setAutoIncrement] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#6b7280");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      if (!window.electronAPI) return;
      try {
        const data = await window.electronAPI.loadAllSettings();
        setOrganizationName(data.organization_name || "");
        setPassPrefix(data.pass_prefix || "VIS");
        setStartingNumber(String(data.pass_start_number || 1).padStart(4, "0"));
        setAutoIncrement(data.auto_increment !== 0);
        setTheme(data.theme || "Light");
        setPrimaryColor(data.primary_color || "#3b82f6");
        setSecondaryColor(data.secondary_color || "#6b7280");
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    if (!window.electronAPI) {
      setMessage("Settings saved (simulated)");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      await window.electronAPI.saveAllSettings({
        organization_name: organizationName,
        pass_prefix: passPrefix,
        pass_start_number: Number(startingNumber),
        auto_increment: autoIncrement,
        theme,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
      });
      setMessage("Settings saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
      setMessage("Failed to save settings");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      <p className="text-gray-500 mb-6">Configure organization, pass settings and appearance</p>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Organization Settings</h2>
            <div className="space-y-5">
              <Input
                label="Organization Name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Enter organization name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Organization Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-28 h-28 rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-400">
                    Logo
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button>Choose Logo</Button>
                    <Button className="bg-red-500 hover:bg-red-600">Remove Logo</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-6">Pass Settings</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Pass Prefix"
                value={passPrefix}
                onChange={(e) => setPassPrefix(e.target.value)}
                placeholder="VIS"
              />
              <Input
                label="Starting Number"
                value={startingNumber}
                onChange={(e) => setStartingNumber(e.target.value)}
                placeholder="0001"
              />
            </div>
            <div className="mt-5">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoIncrement}
                  onChange={(e) => setAutoIncrement(e.target.checked)}
                />
                <span>Auto Increment Pass Number</span>
              </label>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border">
              <p className="text-sm text-gray-500 mb-2">Pass Preview</p>
              <p className="text-2xl font-bold">{passPrefix}-{startingNumber}</p>
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  id="theme-select"
                  className="w-full border rounded-xl px-4 py-3"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <Input
                label="Primary Color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
              <Input
                label="Secondary Color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-6">System Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Database Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database Size</span>
                <span>2.3 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span>1.0.0</span>
              </div>
            </div>
          </Card>

          <Card>
            <Button className="w-full" onClick={saveSettings}>
              Save Settings
            </Button>
            {message && <p className="text-sm text-green-600 font-medium mt-3 text-center">{message}</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Settings;
