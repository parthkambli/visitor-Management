import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, X } from "lucide-react";
import Button from "../Components/UI/Button";
import Card from "../Components/UI/Card";
import PassPreview from "../Components/Pass/PassPreview";

function VisitPassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [settings, setSettings] = useState({ organization_name: "", logo_path: "" });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getVisitById(Number(id)).then(setVisit);
    window.electronAPI.loadAllSettings().then(setSettings);
  }, [id]);

  function handlePrintPreview() {
    setShowPreview(true);
  }

  async function handlePrint() {
    if (window.electronAPI?.printPass) {
      try {
        const result = await window.electronAPI.printPass(Number(id));
        if (result?.success) setShowPreview(false);
      } catch (err) {
        console.error("Print failed", err);
      }
      return;
    }

    const printStyle = document.createElement("style");
    printStyle.id = "print-style";
    printStyle.textContent = `
      @page { margin: 0; size: A4 portrait; }
      @media print {
        html, body { margin: 0; padding: 0; width: 210mm; height: 297mm; background: #fff; }
        body * { visibility: hidden !important; }
        .print-modal-overlay, .print-modal-overlay * { visibility: visible !important; }
        .print-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: #fff !important;
        }
        .print-modal-overlay .print-toolbar { display: none !important; }
        .print-modal-overlay .print-content {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: #fff !important;
        }
        .print-modal-overlay .print-content > div {
          box-shadow: none !important;
          max-width: 100% !important;
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    window.print();
    setTimeout(() => printStyle.remove(), 200);
  }

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
          <Button className="flex items-center gap-2" onClick={handlePrintPreview}>
            <Printer size={18} />
            Print Pass
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5" id="print-area">
          <PassPreview
            passId={visit.pass_id}
            companyName={settings.organization_name || "My Company"}
            companyLogo={settings.logo_path || ""}
            primaryColor={settings.primary_color || "#6b7280"}
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
            <h2 className="text-2xl font-bold mb-6 pl-3 border-l-4" style={{ borderColor: "var(--color-primary)" }}>Pass Information</h2>
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

      {showPreview && (
        <div className="print-modal-overlay">
          <div className="print-toolbar">
            <span className="print-toolbar-title">
              <Printer size={16} style={{ color: "var(--color-primary)" }} />
              Print Preview
            </span>
            <div className="print-toolbar-actions">
              <button className="print-toolbar-btn print-btn" onClick={handlePrint}>
                <Printer size={16} />
                Print
              </button>
              <button className="print-toolbar-btn cancel-btn" onClick={() => setShowPreview(false)}>
                <X size={16} />
                Close
              </button>
            </div>
          </div>
          <div className="print-content">
            <PassPreview
              passId={visit.pass_id}
              companyName={settings.organization_name || "My Company"}
              companyLogo={settings.logo_path || ""}
              primaryColor={settings.primary_color || "#6b7280"}
              visitorName={visit.visitor_name}
              company={visit.visitor_company}
              mobileNumber={visit.visitor_phone}
              employeeToMeet={visit.employee_to_meet}
              visitDate={visit.visit_date}
              visitTime={visit.visit_time}
              photo={visit.visitor_photo}
            />
          </div>
        </div>
      )}

      <style>{`
        .print-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #eef0f3;
          z-index: 99999;
          display: flex;
          flex-direction: column;
        }
        .print-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 52px;
          background: #ffffff;
          border-bottom: 1px solid #e2e5ea;
          flex-shrink: 0;
          font-family: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
        }
        .print-toolbar-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #111827;
          font-size: 14px;
          font-weight: 600;
        }
        .print-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .print-toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, border-color 0.15s;
        }
        .print-btn {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #fff;
        }
        .print-btn:hover {
          background: var(--color-primary-hover);
          border-color: var(--color-primary-hover);
        }
        .cancel-btn {
          background: #ffffff;
          color: #374151;
        }
        .cancel-btn:hover {
          background: #f3f4f6;
        }
        .print-content {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 32px 24px;
          overflow: auto;
        }
        .print-content > div {
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          background: white;
          max-width: 700px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default VisitPassDetails;
