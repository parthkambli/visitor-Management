import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/UI/Card";
import Button from "../Components/UI/Button";
import GeneratePassForm from "../Components/Pass/GeneratePassForm";
import PassPreview from "../Components/Pass/PassPreview";

function GeneratePass() {
  const location = useLocation();
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ organization_name: "", logo_path: "" });
  const [passSequence, setPassSequence] = useState({ pass_prefix: "VIS", pass_start_number: 1, current_number: 1 });
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    visitorName: "",
    company: "",
    mobileNumber: "",
    employeeToMeet: "",
    visitDate: today,
    visitTime: "",
  });

  const loadData = useCallback(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitors().then(setVisitors);
    window.electronAPI.loadAllSettings().then(setSettings);
    window.electronAPI.getPassSequence().then(setPassSequence);
  }, []);

  useEffect(() => {
    loadData();
  }, [location.key, loadData]);

  function validate() {
    const errs = {};

    if (!formData.visitorName.trim()) {
      errs.visitorName = "Visitor name is required";
    }

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile number is required";
    }

    if (!formData.company.trim()) {
      errs.company = "Company is required";
    }

    if (!formData.employeeToMeet.trim()) {
      errs.employeeToMeet = "Employee to meet is required";
    }

    if (!formData.visitDate) {
      errs.visitDate = "Date is required";
    }

    if (!formData.visitTime) {
      errs.visitTime = "Time is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleGenerate = async () => {
    if (!validate()) return;
    if (!window.electronAPI) return;
    setLoading(true);
    try {
      let visitorId;

      if (selectedVisitor) {
        visitorId = selectedVisitor.id;
      } else {
        const match = visitors.find(
          (v) =>
            v.name?.toLowerCase() === formData.visitorName.trim().toLowerCase() &&
            v.phone === formData.mobileNumber.trim()
        );
        if (match) {
          visitorId = match.id;
        } else {
          const newVisitor = await window.electronAPI.createVisitor({
            name: formData.visitorName,
            company: formData.company,
            phone: formData.mobileNumber,
            photo: capturedPhoto,
          });
          visitorId = newVisitor.id;
        }
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
        visitDate: new Date().toISOString().split("T")[0],
        visitTime: "",
      });
      setSelectedVisitor(null);
      setCapturedPhoto("");
      setErrors({});
      const updated = await window.electronAPI.getVisitors();
      setVisitors(updated);
      const seq = await window.electronAPI.getPassSequence();
      setPassSequence(seq);
    } catch (err) {
      console.error("Failed to generate pass", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      visitorName: "",
      company: "",
      mobileNumber: "",
      employeeToMeet: "",
      visitDate: new Date().toISOString().split("T")[0],
      visitTime: "",
    });
    setSelectedVisitor(null);
    setCapturedPhoto("");
    setErrors({});
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
              errors={errors}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
              <Button onClick={handleGenerate} loading={loading}>Generate Pass</Button>
            </div>
          </Card>
        </div>

        <div className="col-span-5">
          <Card className="p-3">
            <h2 className="text-base font-semibold mb-2 pl-3 border-l-4" style={{ borderColor: "var(--color-primary)" }}>Pass Preview</h2>
            <PassPreview
              passId={`${passSequence.pass_prefix}-${String(passSequence.current_number).padStart(4, "0")}`}
              companyName={settings.organization_name || "My Company"}
              companyLogo={settings.logo_path || ""}
              primaryColor={settings.primary_color || "#6b7280"}
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
