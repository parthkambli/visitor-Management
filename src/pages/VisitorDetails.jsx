import {
  User,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CalendarDays,
  ClipboardList,
  Plus,
} from "lucide-react";

import { useParams } from "react-router-dom";

import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";

import mockVisitors from "../data/mockVisitors";
import mockVisits from "../data/mockVisits";

function VisitorDetails() {
  const { id } = useParams();

  const visitor = mockVisitors.find(
    (item) => item.id === Number(id)
  );

  const visitorVisits = mockVisits.filter(
    (visit) => visit.visitorId === visitor.id
  );

  const activeVisit = visitorVisits.find(
    (visit) => visit.status === "Checked In"
  );

  const columns = [
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
      title: "Check Out",
      key: "checkOut",
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
  ];

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Visitor Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Complete visitor information and visit history
          </p>

        </div>

        <Button className="flex items-center gap-2">

          <Plus size={18} />

          New Visit

        </Button>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT SECTION */}

        <div className="col-span-2 space-y-6">

          {/* PROFILE CARD */}

          <Card>

            <div className="flex items-start gap-6">

              <div className="w-28 h-28 rounded-2xl bg-gray-300 flex items-center justify-center">

                <User size={50} />

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {visitor.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {visitor.company}
                    </p>

                  </div>

                  {activeVisit ? (
                    <Badge variant="success">
                      Active Visit
                    </Badge>
                  ) : (
                    <Badge variant="info">
                      No Active Visit
                    </Badge>
                  )}

                </div>

                <div className="grid grid-cols-2 gap-5 mt-6">

                  <div className="flex items-center gap-3">

                    <Phone size={18} />

                    <span>{visitor.phone}</span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Mail size={18} />

                    <span>{visitor.email}</span>

                  </div>

                  <div className="flex items-center gap-3">

                    <ShieldCheck size={18} />

                    <span>{visitor.idProof}</span>

                  </div>

                  <div className="flex items-center gap-3">

                    <ClipboardList size={18} />

                    <span>{visitor.idNumber}</span>

                  </div>

                </div>

              </div>

            </div>

          </Card>

          {/* VISIT HISTORY */}

          <Card>

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-semibold">
                  Visit History
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  All visits associated with this visitor
                </p>

              </div>

            </div>

            <Table
              columns={columns}
              data={visitorVisits}
            />

          </Card>

        </div>

        {/* RIGHT SECTION */}

        <div className="space-y-6">

          {/* STATS */}

          <Card>

            <h2 className="text-xl font-semibold mb-5">
              Visitor Statistics
            </h2>

            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Total Visits
                </span>

                <span className="font-bold text-xl">
                  {visitorVisits.length}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Last Visit
                </span>

                <span className="font-medium">
                  {visitorVisits[0]?.checkIn || "--"}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Active Visits
                </span>

                <span className="font-medium">
                  {
                    visitorVisits.filter(
                      (visit) =>
                        visit.status === "Checked In"
                    ).length
                  }
                </span>

              </div>

            </div>

          </Card>

          {/* ACTIVE VISIT */}

          {activeVisit && (
            <Card>

              <h2 className="text-xl font-semibold mb-5">
                Current Visit
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Purpose
                  </span>

                  <span>
                    {activeVisit.purpose}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Host
                  </span>

                  <span>
                    {activeVisit.host}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Check In
                  </span>

                  <span>
                    {activeVisit.checkIn}
                  </span>

                </div>

              </div>

            </Card>
          )}

          {/* QUICK ACTIONS */}

          <Card>

            <h2 className="text-xl font-semibold mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">

              <Button className="w-full">
                Create New Visit
              </Button>

              <Button className="w-full bg-gray-300 hover:bg-gray-400 text-black">
                Edit Visitor
              </Button>

              <Button className="w-full bg-red-500 hover:bg-red-600">
                Blacklist Visitor
              </Button>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default VisitorDetails;