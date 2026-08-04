import { useState, useEffect } from "react";
import { Search, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/UI/Button";
import FloatingInput from "../Components/UI/FloatingInput";
import FloatingSelect from "../Components/UI/FloatingSelect";
import Input from "../Components/UI/Input";
import Modal from "../Components/UI/Modal";
import Table from "../Components/UI/Table";

function mapVisitor(v) {
  return { ...v, createdAt: v.created_at };
}

function Visitors() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [lastVisitFrom, setLastVisitFrom] = useState("");
  const [lastVisitTo, setLastVisitTo] = useState("");
  const [editModal, setEditModal] = useState({ open: false, visitor: null });
  const [editForm, setEditForm] = useState({ name: "", phone: "", company: "" });

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitors().then((data) => setVisitors(data.map(mapVisitor)));
    window.electronAPI.getVisits().then(setVisits);
  }, []);

  function openEdit(visitor) {
    setEditForm({ name: visitor.name, phone: visitor.phone, company: visitor.company });
    setEditModal({ open: true, visitor });
  }

  async function handleSaveEdit() {
    if (!window.electronAPI) return;
    await window.electronAPI.updateVisitor(editModal.visitor.id, editForm);
    setEditModal({ open: false, visitor: null });
    const data = await window.electronAPI.getVisitors();
    setVisitors(data.map(mapVisitor));
  }

  const rows = visitors.map((visitor) => {
    const visitorVisits = visits.filter((v) => v.visitor_id === visitor.id);
    const lastVisit = visitorVisits[visitorVisits.length - 1];
    return {
      ...visitor,
      totalVisits: visitorVisits.length,
      lastVisit: lastVisit?.visit_date || "--",
    };
  });

  const uniqueCompanies = [...new Set(visitors.map((v) => v.company).filter(Boolean))].sort();

  const filteredRows = rows.filter((row) => {
    if (query) {
      const q = query.toLowerCase();
      const matchesName = row.name?.toLowerCase().includes(q);
      const matchesPhone = row.phone?.toLowerCase().includes(q);
      if (!matchesName && !matchesPhone) return false;
    }
    if (companyFilter && row.company !== companyFilter) return false;
    if (lastVisitFrom && row.lastVisit !== "--" && row.lastVisit < lastVisitFrom) return false;
    if (lastVisitTo && row.lastVisit !== "--" && row.lastVisit > lastVisitTo) return false;
    return true;
  });

  const handleClear = () => {
    setQuery("");
    setCompanyFilter("");
    setLastVisitFrom("");
    setLastVisitTo("");
  };

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
    { title: "Company", key: "company" },
    { title: "Total Visits", key: "totalVisits" },
    { title: "Last Visit", key: "lastVisit" },
    {
      title: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/visitors/${row.id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            aria-label="View visitor details"
          >
            <Eye size={18} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            aria-label="Edit visitor"
            onClick={() => openEdit(row)}
          >
            <Pencil size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <p className="text-gray-500 mb-6">Manage all visitor records</p>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-80">
            <FloatingInput
              label="Search"
              placeholder="Search by name or phone..."
              icon={Search}
              aria-label="Search visitors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="w-60">
            <FloatingSelect
              label="Company"
              id="company-filter"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </FloatingSelect>
          </div>

          <div className="w-60">
            <FloatingInput
              type="date"
              label="Last Visit From"
              id="last-visit-from"
              value={lastVisitFrom}
              onChange={(e) => setLastVisitFrom(e.target.value)}
            />
          </div>

          <div className="w-60">
            <FloatingInput
              type="date"
              label="Last Visit To"
              id="last-visit-to"
              value={lastVisitTo}
              onChange={(e) => setLastVisitTo(e.target.value)}
            />
          </div>

          <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      <Table columns={columns} data={filteredRows} variant="primary" />

      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, visitor: null })} title="Edit Visitor">
        <div className="space-y-4">
          <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Enter visitor name" />
          <Input label="Phone Number" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Enter phone number" />
          <Input label="Company" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} placeholder="Enter company" />
          <div className="flex justify-end gap-3 pt-4">
            <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={() => setEditModal({ open: false, visitor: null })}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Visitors;
