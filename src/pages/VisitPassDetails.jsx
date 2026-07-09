import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import Button from "../Components/UI/Button";
import Card from "../Components/UI/Card";
import PassPreview from "../Components/Pass/PassPreview";

function VisitPassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitById(Number(id)).then(setVisit);
  }, [id]);

  if (!visit) {
    return <div className="text-center py-20 text-gray-500">Pass not found</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500">View generated visitor pass</p>
        <div className="flex gap-3">
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-black flex items-center gap-2"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/visits");
              }
            }}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <Button className="flex items-center gap-2">
            <Printer size={18} />
            Print Pass
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <PassPreview
            passId={visit.pass_id}
            visitorName={visit.visitor_name}
            company={visit.visitor_company}
            mobileNumber={visit.visitor_phone}
            employeeToMeet={visit.employee_to_meet}
            visitDate={visit.visit_date}
            visitTime={visit.visit_time}
            photo={visit.visitor_photo}
          />
        </div>

        <div className="col-span-7">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Pass Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Pass ID</p>
                <p className="font-semibold mt-1">#{visit.pass_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Generated At</p>
                <p className="font-semibold mt-1">{visit.created_at}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Visitor Name</p>
                <p className="font-semibold mt-1">{visit.visitor_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="font-semibold mt-1">{visit.visitor_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee To Meet</p>
                <p className="font-semibold mt-1">{visit.employee_to_meet}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Visit Date</p>
                <p className="font-semibold mt-1">{visit.visit_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Visit Time</p>
                <p className="font-semibold mt-1">{visit.visit_time}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VisitPassDetails;
