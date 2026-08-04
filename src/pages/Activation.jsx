import { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, AlertCircle, Copy, Check } from "lucide-react";

function Activation({ onActivated }) {
  const [key, setKey] = useState("");
  const [hwid, setHwid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.getHWID) {
      window.electronAPI.getHWID().then(setHwid);
    }
  }, []);

  const handleActivate = async () => {
    if (!key.trim()) {
      setError("Please enter a license key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await window.electronAPI.activateLicense(key.trim());
      if (result.success) {
        onActivated();
      } else {
        setError(result.error || "Invalid license key");
      }
    } catch {
      setError("Activation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyHWID = () => {
    navigator.clipboard.writeText(hwid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatKey = (value) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const groups = [];
    for (let i = 0; i < cleaned.length; i += 5) {
      groups.push(cleaned.substring(i, i + 5));
    }
    return groups.join("-");
  };

  const handleKeyChange = (e) => {
    const raw = e.target.value;
    if (raw.includes("-")) {
      setKey(raw.toUpperCase());
    } else {
      setKey(formatKey(raw));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            <ShieldCheck size={32} style={{ color: "var(--color-primary)" }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
          <p className="text-gray-500 mt-1">Activate your license to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                License Key
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono tracking-wider uppercase"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={loading || !key.trim()}
              className="w-full py-3 rounded-xl text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Activating..." : "Activate"}
            </button>
          </div>

          {hwid && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Your Machine ID (share this with us to get a license key):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-gray-600 break-all">
                  {hwid}
                </code>
                <button
                  onClick={copyHWID}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition shrink-0"
                  title="Copy Machine ID"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Contact us to purchase a license key for this machine.
        </p>
      </div>
    </div>
  );
}

export default Activation;
