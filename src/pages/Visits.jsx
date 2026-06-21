import {
  Search,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "../Components/UI/Button";
import Table from "../Components/UI/Table";
import Input from "../Components/UI/Input";

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

      mobileNumber:
        visitor?.phone,

      photo:
        visitor?.photo,
    };
  });

  const columns = [
    {
      title: "Pass ID",
      key: "passId",
    },

    {
      title: "Visitor Name",
      key: "visitorName",
    },

    {
      title: "Mobile Number",
      key: "mobileNumber",
    },

    {
      title: "Employee To Meet",
      key: "employeeToMeet",
    },

    {
      title: "Visit Date",
      key: "visitDate",
    },

    {
      title: "Visit Time",
      key: "visitTime",
    },

    {
      title: "Generated At",
      key: "createdAt",
    },

    {
      title: "Actions",
      key: "actions",

      render: (row) => (
        <Button
          onClick={() =>
            navigate(`/visits/${row.id}`)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="View pass details"
        >
          <Eye size={18} />
        </Button>
      ),
    },
  ];

  return (
    <div>

      {/* HEADER */}

      <p className="text-gray-500 mb-6">
        View all generated visitor passes
      </p>

      {/* FILTERS */}

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-4 items-end">

        {/* SEARCH */}

        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <Input
            placeholder="Search visitors..."
            className="pl-10"
            aria-label="Search visitors"
          />

        </div>

        {/* FROM DATE */}

        <div>

          <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="from-date">
            From Date
          </label>

          <Input type="date" id="from-date" />

        </div>

        {/* TO DATE */}

        <div>

          <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor="to-date">
            To Date
          </label>

          <Input type="date" id="to-date" />

        </div>

      </div>

      {/* TABLE */}

      <Table
        columns={columns}
        data={visits}
      />

    </div>
  );
}

export default Visits;