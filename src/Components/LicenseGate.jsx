import { useState, useEffect } from "react";
import Activation from "../pages/Activation";

function LicenseGate({ children }) {
  const [status, setStatus] = useState("checking");
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!window.electronAPI?.checkLicense) {
      setStatus("no-electron");
      setActivated(true);
      return;
    }

    window.electronAPI.checkLicense().then((result) => {
      setActivated(result.activated);
      setStatus("done");
    });
  }, []);

  const handleActivated = () => {
    setActivated(true);
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!activated) {
    return <Activation onActivated={handleActivated} />;
  }

  return children;
}

export default LicenseGate;
