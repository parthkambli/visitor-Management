import {
  User,
  Phone,
  ShieldCheck,
  ClipboardList,
  Plus,
  Eye,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";

import mockVisitors from "../data/mockVisitors";
import mockVisits from "../data/mockVisits";

function VisitorDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

const visitor = mockVisitors.find(
  (item) => item.id === Number(id)
);

if (!visitor) {
  return (
    <div className="text-center py-20">
      Visitor not found
    </div>
  );
}

const visitorVisits =
  mockVisits.filter(
    (visit) =>
      visit.visitorId === visitor.id
  );
  const columns = [
    {
      title: "Pass ID",
      key: "passId",
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
        <button
          onClick={() =>
            navigate(`/visits/${row.id}`)
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

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Visitor Details
          </h1>

          <p className="text-gray-500 mt-1">
            Visitor profile and pass history
          </p>

        </div>

        <Button
          className="flex items-center gap-2"
          onClick={() =>
            navigate("/visitor-pass")
          }
        >

          <Plus size={18} />

          Generate Pass

        </Button>

      </div>

      {/* TOP GRID */}

      <div className="grid grid-cols-12 gap-6">

        {/* PROFILE */}

        <div className="col-span-8">

          <Card>

            <div className="flex gap-6">

              {/* PHOTO */}

              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">

                {visitor.photo ? (

                  <img
                    src={visitor.photo}
                    alt={visitor.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <User size={50} />

                )}

              </div>

              {/* DETAILS */}

              <div className="flex-1">

                <h2 className="text-3xl font-bold">
                  {visitor.name}
                </h2>

                <p className="text-gray-500 mt-1">
                  {visitor.company}
                </p>

                <div className="flex items-center gap-3 mt-6">

                <Phone size={18} />

                <span>
                  {visitor.phone}
                </span>

              </div>

              </div>

            </div>

          </Card>

        </div>

        {/* STATS */}

        <div className="col-span-4">

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Statistics
            </h2>

            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Total Passes
                </span>

                <span className="text-2xl font-bold">
                  {
                    visitorVisits.length
                  }
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Last Visit
                </span>

                <span className="font-medium">
                  {
                    visitorVisits[
                      visitorVisits.length - 1
                    ]?.visitDate || "--"
                  }
                </span>

              </div>

            </div>

          </Card>

        </div>

      </div>

      {/* PASS HISTORY */}

      <Card className="mt-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-semibold">
              Pass History
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              All generated passes for this visitor
            </p>

          </div>

        </div>

        <Table
          columns={columns}
          data={visitorVisits}
        />

      </Card>

    </div>
  );
}

export default VisitorDetails;