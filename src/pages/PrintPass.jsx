import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PassPreview from "../Components/Pass/PassPreview";

function PrintPass() {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (!window.electronAPI) return;
    Promise.all([
      window.electronAPI.getVisitById(Number(id)),
      window.electronAPI.loadAllSettings(),
    ])
      .then(([visitData, settingsData]) => {
        setVisit(visitData);
        setSettings(settingsData);
      })
      .catch((err) => {
        console.error("Failed to load print data:", err);
      });
  }, [id]);

  useEffect(() => {
    if (!visit || !settings) return;

    const signalReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.electronAPI?.printReady?.();
        });
      });
    };

    signalReady();
  }, [visit, settings]);

  if (!visit || !settings) return null;

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: 0,
        padding: 0,
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      <PassPreview
        fillWidth
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
  );
}

export default PrintPass;
