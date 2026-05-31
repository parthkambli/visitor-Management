import { useParams } from "react-router-dom";

import {
  Printer,
  ArrowLeft,
} from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import PassPreview from "../components/pass/PassPreview";

import mockVisitors from "../data/mockVisitors";
import mockVisits from "../data/mockVisits";

function VisitPassDetails() {
  const { id } = useParams();

  const visit = mockVisits.find(
    (v) => v.id === Number(id)
  );

  const visitor = mockVisitors.find(
    (v) => v.id === visit?.visitorId
  );

  if (!visit || !visitor) {
    return (
      <div className="text-center py-20 text-gray-500">
        Pass not found
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Pass Details
          </h1>

          <p className="text-gray-500 mt-1">
            View generated visitor pass
          </p>

        </div>

        <div className="flex gap-3">

          <Button className="bg-gray-300 hover:bg-gray-400 text-black flex items-center gap-2">

            <ArrowLeft size={18} />

            Back

          </Button>

          <Button className="flex items-center gap-2">

            <Printer size={18} />

            Print Pass

          </Button>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-12 gap-6">

        {/* PASS */}

        <div className="col-span-5">

          <PassPreview
            passId={visit.passId}
            visitorName={visitor.name}
            company={visitor.company}
            mobileNumber={visitor.phone}
            employeeToMeet={
              visit.employeeToMeet
            }
            visitDate={visit.visitDate}
            visitTime={visit.visitTime}
            photo={visitor.photo}
          />

        </div>

        {/* DETAILS */}

        <div className="col-span-7">

          <Card>

            <h2 className="text-2xl font-bold mb-6">
              Pass Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <div>

                <p className="text-sm text-gray-500">
                  Pass ID
                </p>

                <p className="font-semibold mt-1">
                  #{visit.passId}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Generated At
                </p>

                <p className="font-semibold mt-1">
                  {visit.createdAt}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Visitor Name
                </p>

                <p className="font-semibold mt-1">
                  {visitor.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Mobile Number
                </p>

                <p className="font-semibold mt-1">
                  {visitor.phone}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Employee To Meet
                </p>

                <p className="font-semibold mt-1">
                  {
                    visit.employeeToMeet
                  }
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Visit Date
                </p>

                <p className="font-semibold mt-1">
                  {visit.visitDate}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Visit Time
                </p>

                <p className="font-semibold mt-1">
                  {visit.visitTime}
                </p>

              </div>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default VisitPassDetails;