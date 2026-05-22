import {
  Search,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";

import mockVisitors from "../data/mockVisitors";
import mockVisits from "../data/mockVisits";

function Visits() {
  const navigate = useNavigate();

  const visits = mockVisits.map((visit) => {
    const visitor = mockVisitors.find(
      (v) => v.id === visit.visitorId
    );

    return {
      ...visit,
      visitorName: visitor?.name,
      company: visitor?.company,
    };
  });

  const columns = [
    {
      title: "Visitor",
      key: "visitorName",
    },

    {
      title: "Company",
      key: "company",
    },

    {
      title: "Purpose",
      key: "purpose",
    },

    {
      title: "Host",
      key: "host",
    },

    {
      title: "Check In",
      key: "checkIn",
    },

    {
      title: "Status",
      key: "status",

      render: (row) => {
        const variantMap = {
          "Checked In": "success",
          "Checked Out": "info",
          Pending: "warning",
        };

        return (
          <Badge
            variant={variantMap[row.status]}
          >
            {row.status}
          </Badge>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",

      render: (row) => (
        <button
          onClick={() =>
            navigate(`/visitors/${row.visitorId}`)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div>

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Visits
        </h1>

        <p className="text-gray-500 mt-1">
          Track all visitor entries and exits
        </p>

      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">

        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <Input
            placeholder="Search visits..."
            className="pl-10"
          />

        </div>

      </div>

      <Table
        columns={columns}
        data={visits}
      />

    </div>
  );
}

export default Visits;