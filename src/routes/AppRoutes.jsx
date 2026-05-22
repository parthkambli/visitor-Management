import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Visitors from "../pages/Visitors";
import VisitorDetails from "../pages/VisitorDetails";
import Visits from "../pages/Visits";
import CheckIn from "../pages/CheckIn";
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
          path="checkin"
          element={<CheckIn />}
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