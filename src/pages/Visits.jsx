import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/UI/Button";
import FloatingInput from "../Components/UI/FloatingInput";
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
    mobileNumber: v.visitor_phone,
    photo: v.visitor_photo,
  };
}

function Visits() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisits().then((data) => setVisits(data.map(mapVisit)));
  }, []);

  const handleSearch = () => {
    if (!window.electronAPI) return;
    if (!query && !dateFrom && !dateTo) {
      window.electronAPI.getVisits().then((data) => setVisits(data.map(mapVisit)));
    } else {
      window.electronAPI.searchVisits(query || null, dateFrom || null, dateTo || null)
        .then((data) => setVisits(data.map(mapVisit)));
    }
  };

  const columns = [
    { title: "Pass ID", key: "passId" },
    { title: "Visitor Name", key: "visitorName" },
    { title: "Mobile Number", key: "mobileNumber" },
    { title: "Employee To Meet", key: "employeeToMeet" },
    { title: "Visit Date", key: "visitDate" },
    { title: "Visit Time", key: "visitTime" },
    { title: "Generated At", key: "createdAt" },
    {
      title: "Actions",
      key: "actions",
      render: (row) => (
          <button
            onClick={() => navigate(`/visits/${row.id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            aria-label="View pass details"
          >
            <Eye size={18} />
          </button>
      ),
    },
  ];

  return (
    <div>
      <p className="text-gray-500 mb-6">View all generated visitor passes</p>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-4 items-end">
        <div className="w-80">
          <FloatingInput
            label="Search"
            placeholder="Search by name or phone..."
            icon={Search}
            aria-label="Search visitors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="w-60">
          <FloatingInput
            type="date"
            label="From Date"
            id="from-date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="w-60">
          <FloatingInput
            type="date"
            label="To Date"
            id="to-date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <Button onClick={handleSearch}>Search</Button>
        <Button
          className="bg-gray-300 hover:bg-gray-400 text-black"
          onClick={() => {
            setQuery("");
            setDateFrom("");
            setDateTo("");
            if (window.electronAPI) {
              window.electronAPI.getVisits().then((data) => setVisits(data.map(mapVisit)));
            }
          }}
        >
          Clear
        </Button>
      </div>

      <Table columns={columns} data={visits} variant="primary" />
    </div>
  );
}

export default Visits;
