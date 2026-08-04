import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  Settings,
} from "lucide-react";

function MainLayout() {
  const location = useLocation();
  const [settings, setSettings] = useState({ organization_name: "", logo_path: "", primary_color: "#2563eb", secondary_color: "#6b7280", theme: "Light" });

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.loadAllSettings().then((data) => {
      setSettings(data);
      applyTheme(data);
    });
  }, [location.key]);

  function applyTheme(data) {
    const root = document.documentElement;
    const primary = data.primary_color || "#2563eb";
    const secondary = data.secondary_color || "#6b7280";

    root.style.setProperty("--color-primary", primary);
    root.style.setProperty("--color-primary-hover", adjustBrightness(primary, -15));
    root.style.setProperty("--color-secondary", secondary);

    const r = parseInt(primary.slice(1, 3), 16);
    const g = parseInt(primary.slice(3, 5), 16);
    const b = parseInt(primary.slice(5, 7), 16);
    root.style.setProperty("--color-primary-ring", `rgba(${r}, ${g}, ${b}, 0.5)`);
    root.style.setProperty("--color-primary-light", `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty("--color-primary-medium", `rgba(${r}, ${g}, ${b}, 0.15)`);

    const sr = parseInt(secondary.slice(1, 3), 16);
    const sg = parseInt(secondary.slice(3, 5), 16);
    const sb = parseInt(secondary.slice(5, 7), 16);
    root.style.setProperty("--color-secondary-light", `rgba(${sr}, ${sg}, ${sb}, 0.08)`);

    if (data.theme === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  function adjustBrightness(hex, amount) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  const orgName = settings.organization_name || "Visitor Tracker";
  const logo = settings.logo_path;

  const pageTitles = {
    "/": "Dashboard",
    "/visitors": "Visitors",
    "/visits": "Visits",
    "/visitor-pass": "Generate Visitor Pass",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname]
    || (location.pathname.startsWith("/visitors/") && "Visitor Details")
    || (location.pathname.startsWith("/visits/") && "Pass Details")
    || "Visitor Management System";

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Visitors",
      path: "/visitors",
      icon: Users,
    },
    {
      name: "Visits",
      path: "/visits",
      icon: ClipboardList,
    },
    {
      name: "Visitor Pass",
      path: "/visitor-pass",
      icon: UserPlus,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      <aside className="w-64 bg-gray-900 text-white p-5 relative">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: "var(--color-primary)" }} />

        <div className="flex items-center gap-3 mb-10 mt-1">
          {logo ? (
            <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-contain" />
          ) : (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {orgName.charAt(0)}
            </div>
          )}
          <h1 className="text-xl font-bold truncate">{orgName}</h1>
        </div>

        <nav className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "text-white"
                      : "hover:bg-gray-800"
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: "var(--color-primary)" } : undefined}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

      </aside>

      <div className="flex-1 flex flex-col">

        <header className="h-16 bg-white border-b-2 px-6 flex items-center justify-between" style={{ borderBottomColor: "var(--color-primary)" }}>

          <h2 className="text-xl font-semibold">
            {pageTitle}
          </h2>

          <div className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>
            Admin
          </div>

        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;