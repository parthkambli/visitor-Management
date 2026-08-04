import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import "./index.css";

import AppRoutes from "./routes/AppRoutes";
import LicenseGate from "./components/LicenseGate";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <LicenseGate>
        <AppRoutes />
      </LicenseGate>
    </HashRouter>
  </StrictMode>
);
