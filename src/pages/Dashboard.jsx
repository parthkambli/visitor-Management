import { useState, useEffect } from "react";
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

  const cards = [
    { title: "Total Visitors", value: totalVisitors },
    { title: "Total Visits", value: totalVisits },
    { title: "Today's Visits", value: todayVisits },
    { title: "Companies", value: uniqueCompanies },
  ];

  const recentVisits = visits
    .map((visit) => ({
      ...visit,
      visitorName: visit.visitorName || "--",
    }))
    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

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
        {cards.map((card) => (
          <Card key={card.title}>
            <h2 className="text-gray-500 text-sm">{card.title}</h2>
            <p className="text-3xl font-bold mt-3">{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Recent Visits</h2>
              <p className="text-sm text-gray-500 mt-1">Latest visitor activity</p>
            </div>
            <Table columns={recentVisitColumns} data={recentVisits} />
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Top Visitors</h2>
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
          <h2 className="text-xl font-semibold">Monthly Visit Trend</h2>
          <p className="text-sm text-gray-500 mt-1">Visitor analytics overview</p>
        </div>
        <div className="h-72 rounded-2xl bg-gray-50 border flex items-center justify-center text-gray-400">
          Chart coming soon
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
