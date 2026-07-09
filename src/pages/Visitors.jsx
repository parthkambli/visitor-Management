import { useState, useEffect } from "react";
import { Search, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/UI/Button";
import Input from "../Components/UI/Input";
import Table from "../Components/UI/Table";

function mapVisitor(v) {
  return { ...v, createdAt: v.created_at };
}

function Visitors() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisits().then(setVisits);
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;
    const fetch = query
      ? window.electronAPI.searchVisitors(query)
      : window.electronAPI.getVisitors();
    fetch.then((data) => setVisitors(data.map(mapVisitor)));
  }, [query]);

  const rows = visitors.map((visitor) => {
    const visitorVisits = visits.filter((v) => v.visitor_id === visitor.id);
    const lastVisit = visitorVisits[visitorVisits.length - 1];
    return {
      ...visitor,
      totalVisits: visitorVisits.length,
      lastVisit: lastVisit?.visit_date || "--",
    };
  });

  const columns = [
    {
      title: "Photo",
      key: "photo",
      render: (row) =>
        row.photo ? (
          <img src={row.photo} alt={row.name} className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
        ),
    },
    { title: "Visitor Name", key: "name" },
    { title: "Mobile Number", key: "phone" },
    { title: "Total Visits", key: "totalVisits" },
    { title: "Last Visit", key: "lastVisit" },
    {
      title: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/visitors/${row.id}`)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="View visitor details"
          >
            <Eye size={18} />
          </Button>
          <Button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Edit visitor">
            <Pencil size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <p className="text-gray-500 mb-6">Manage all visitor records</p>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-4">
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
          <Input
            placeholder="Search visitors..."
            className="pl-10"
            aria-label="Search visitors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} data={rows} />
    </div>
  );
}

export default Visitors;
