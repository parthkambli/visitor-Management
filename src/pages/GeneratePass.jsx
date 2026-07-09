import { useState, useEffect } from "react";
import Card from "../Components/UI/Card";
import Button from "../Components/UI/Button";
import GeneratePassForm from "../Components/Pass/GeneratePassForm";
import PassPreview from "../Components/Pass/PassPreview";

function GeneratePass() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [formData, setFormData] = useState({
    visitorName: "",
    company: "",
    mobileNumber: "",
    employeeToMeet: "",
    visitDate: "",
    visitTime: "",
  });

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitors().then(setVisitors);
  }, []);

  const handleGenerate = async () => {
    if (!window.electronAPI) return;
    try {
      let visitorId;

      if (selectedVisitor) {
        visitorId = selectedVisitor.id;
      } else {
        const newVisitor = await window.electronAPI.createVisitor({
          name: formData.visitorName,
          company: formData.company,
          phone: formData.mobileNumber,
          photo: capturedPhoto,
        });
        visitorId = newVisitor.id;
      }

      await window.electronAPI.createVisit({
        visitor_id: visitorId,
        employee_to_meet: formData.employeeToMeet,
        visit_date: formData.visitDate,
        visit_time: formData.visitTime,
      });

      setFormData({
        visitorName: "",
        company: "",
        mobileNumber: "",
        employeeToMeet: "",
        visitDate: "",
        visitTime: "",
      });
      setSelectedVisitor(null);
      setCapturedPhoto("");
    } catch (err) {
      console.error("Failed to generate pass", err);
    }
  };

  const handleReset = () => {
    setFormData({
      visitorName: "",
      company: "",
      mobileNumber: "",
      employeeToMeet: "",
      visitDate: "",
      visitTime: "",
    });
    setSelectedVisitor(null);
    setCapturedPhoto("");
  };

  return (
    <div>
      <p className="text-gray-500 text-sm mb-2">Create and print visitor entry passes</p>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-7">
          <Card className="p-4">
            <GeneratePassForm
              formData={formData}
              setFormData={setFormData}
              setSelectedVisitor={setSelectedVisitor}
              capturedPhoto={capturedPhoto}
              setCapturedPhoto={setCapturedPhoto}
              visitors={visitors}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleGenerate}>Generate Pass</Button>
            </div>
          </Card>
        </div>

        <div className="col-span-5">
          <Card className="p-3">
            <h2 className="text-base font-semibold mb-2">Pass Preview</h2>
            <PassPreview
              passId="0001"
              visitorName={formData.visitorName}
              company={formData.company}
              mobileNumber={formData.mobileNumber}
              employeeToMeet={formData.employeeToMeet}
              visitDate={formData.visitDate}
              visitTime={formData.visitTime}
              photo={capturedPhoto}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GeneratePass;
