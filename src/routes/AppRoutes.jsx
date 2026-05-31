import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Visitors from "../pages/Visitors";
import VisitorDetails from "../pages/VisitorDetails";
import Visits from "../pages/Visits";
import GeneratePass from "../pages/GeneratePass";
import VisitPassDetails from "../pages/VisitPassDetails";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        <Route index element={<Dashboard />} />

        <Route
          path="visitors"
          element={<Visitors />}
        />

        <Route
          path="visitors/:id"
          element={<VisitorDetails />}
        />

        <Route
          path="visits"
          element={<Visits />}
        />

        <Route
          path="visits/:id"
          element={<VisitPassDetails />}
        />

        <Route
          path="visitor-pass"
          element={<GeneratePass />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>
    </Routes>
  );
}

export default AppRoutes;