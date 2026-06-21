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

      <aside className="w-64 bg-gray-900 text-white p-5">

        <h1 className="text-2xl font-bold mb-10">
          Visitor Tracker
        </h1>

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
                      ? "bg-blue-600"
                      : "hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

      </aside>

      <div className="flex-1 flex flex-col">

        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">

          <h2 className="text-xl font-semibold">
            {pageTitle}
          </h2>

          <div className="text-sm text-gray-500">
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