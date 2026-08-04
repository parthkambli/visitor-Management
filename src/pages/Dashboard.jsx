import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../Components/UI/Card";
import Table from "../Components/UI/Table";

function mapVisit(v) {
  return {
    ...v,
    passId: v.pass_id,
    visitorId: v.visitor_id,
    employeeToMeet: v.employee_to_meet,
    visitDate: v.visit_date,
    visitTime: v.visit_time,
    createdAt: v.created_at,
    visitorName: v.visitor_name,
  };
}

function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitors().then(setVisitors);
    window.electronAPI.getVisits().then((data) => setVisits(data.map(mapVisit)));
  }, []);

  const totalVisitors = visitors.length;
  const totalVisits = visits.length;

  const todayDate = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter((visit) => visit.visitDate === todayDate).length;
  const totalPasses = visits.length;
  const uniqueCompanies = new Set(visitors.map((visitor) => visitor.company)).size;

  const monthlyData = (() => {
    const counts = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts[key] = 0;
    }
    visits.forEach((v) => {
      const m = v.visitDate?.slice(0, 7);
      if (counts[m] !== undefined) counts[m]++;
    });
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Object.entries(counts).map(([key, count]) => {
      const [y, m] = key.split("-");
      return { name: `${monthNames[parseInt(m, 10) - 1]} ${y}`, visits: count };
    });
  })();

  const cards = [
    { title: "Total Visitors", value: totalVisitors },
    { title: "Total Visits", value: totalVisits },
    { title: "Today's Visits", value: todayVisits },
    { title: "Companies", value: uniqueCompanies },
  ];

  const todayVisitsList = visits
    .filter((visit) => visit.visitDate === todayDate)
    .map((visit) => ({
      ...visit,
      visitorName: visit.visitorName || "--",
    }));

  const recentVisitColumns = [
    { title: "Pass ID", key: "passId" },
    { title: "Visitor", key: "visitorName" },
    { title: "Employee To Meet", key: "employeeToMeet" },
    { title: "Visit Date", key: "visitDate" },
    { title: "Visit Time", key: "visitTime" },
  ];

  const topVisitors = visitors
    .map((visitor) => ({
      ...visitor,
      totalVisits: visits.filter((visit) => visit.visitorId === visitor.id).length,
    }))
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .slice(0, 5);

  return (
    <div>
      <p className="text-gray-500 mb-6">Overview of visitors and visit activity</p>

      <div className="grid grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card key={card.title}>
            <div className="flex items-center gap-3">
              <div
                className="w-1.5 h-10 rounded-full"
                style={{ backgroundColor: index === 2 ? "var(--color-primary)" : "var(--color-secondary)" }}
              />
              <div>
                <h2 className="text-gray-500 text-sm">{card.title}</h2>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold pl-3 border-l-4" style={{ borderColor: "var(--color-primary)" }}>Today's Visits</h2>
              <p className="text-sm text-gray-500 mt-1">Visitors today</p>
            </div>
            <Table columns={recentVisitColumns} data={todayVisitsList} variant="primary" />
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold pl-3 border-l-4" style={{ borderColor: "var(--color-primary)" }}>Top Visitors</h2>
              <p className="text-sm text-gray-500 mt-1">Most frequent visitors</p>
            </div>
            <div className="space-y-4">
              {topVisitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium">{visitor.name}</p>
                    <p className="text-sm text-gray-500">{visitor.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{visitor.totalVisits}</p>
                    <p className="text-xs text-gray-500">Visits</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold pl-3 border-l-4" style={{ borderColor: "var(--color-primary)" }}>Monthly Visit Trend</h2>
          <p className="text-sm text-gray-500 mt-1">Visitor analytics overview</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
