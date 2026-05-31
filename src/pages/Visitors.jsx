import { useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../Components/UI/Button";
import Input from "../components/ui/Input";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";

// import CreateVisitorModal from "../components/visitors/CreateVisitorModal";

import mockVisitors from "../data/mockVisitors";
import mockVisits from "../data/mockVisits";

function Visitors() {
  // const [isModalOpen, setIsModalOpen] =
  //   useState(false);

const visitors = mockVisitors.map((visitor) => {

  const visitorVisits = mockVisits.filter(
    (visit) => visit.visitorId === visitor.id
  );

  const totalVisits =
    visitorVisits.length;

  const lastVisit =
    visitorVisits[
      visitorVisits.length - 1
    ];

  return {
    ...visitor,

    totalVisits,

    lastVisit:
      lastVisit?.visitDate || "--",
  };
});
  
  const navigate = useNavigate();

  const columns = [
    {
    title: "Photo",
    key: "photo",

    render: (row) => (

      row.photo ? (

        <img
          src={row.photo}
          alt={row.name}
          className="w-12 h-12 rounded-xl object-cover"
        />

      ) : (

        <div className="w-12 h-12 rounded-xl bg-gray-200" />

      )

    ),
  },
  {
    title: "Visitor Name",
    key: "name",
  },

  {
    title: "Mobile Number",
    key: "phone",
  },

  {
    title: "Total Visits",
    key: "totalVisits",
  },

  {
    title: "Last Visit",
    key: "lastVisit",
  },

  {
    title: "Actions",
    key: "actions",

    render: (row) => (
      <div className="flex gap-2">

        <button
          onClick={() =>
            navigate(`/visitors/${row.id}`)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Eye size={18} />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Pencil size={18} />
        </button>

      </div>
    ),
  },
];

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Visitors
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all visitor records
          </p>
        </div>

        {/* <Button
          className="flex items-center gap-2"
          onClick={() =>
            setIsModalOpen(true)
          }
        >
          <Plus size={18} />
          Add Visitor
        </Button> */}

      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-4">

        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <Input
            placeholder="Search visitors..."
            className="pl-10"
          />

        </div>

      </div>

      {/* TABLE */}

      <Table
        columns={columns}
        data={visitors}
      />

      {/* MODAL */}
          {/* <CreateVisitorModal
            isOpen={isModalOpen}
            onClose={() =>
              setIsModalOpen(false)
            }
          /> */}

    </div>
  );
}

export default Visitors;