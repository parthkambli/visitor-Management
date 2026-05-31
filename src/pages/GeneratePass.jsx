import { useState } from "react";

import CreatableSelect from "react-select/creatable";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import GeneratePassForm from "../components/pass/GeneratePassForm";
import PassPreview from "../components/pass/PassPreview";

import mockVisitors from "../data/mockVisitors";

function GeneratePass() {
  const [selectedVisitor, setSelectedVisitor] =
    useState(null);

  const [capturedPhoto, setCapturedPhoto] =
    useState("");

  const [formData, setFormData] =
    useState({
      visitorName: "",
      company: "",
      mobileNumber: "",
      employeeToMeet: "",
      visitDate: "",
      visitTime: "",
    });

  const visitorOptions =
    mockVisitors.map((visitor) => ({
      value: visitor.id,
      label: `${visitor.name} (${visitor.phone})`,
      visitor,
    }));

  const handleVisitorSelect = (
    selected
  ) => {
    const visitor = selected?.visitor;

    setSelectedVisitor(visitor);

    if (visitor) {
      setFormData((prev) => ({
        ...prev,

        visitorName: visitor.name,
        company: visitor.company,
        mobileNumber: visitor.phone,
      }));
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="mb-4">

        <h1 className="text-3xl font-bold">
          Generate Visitor Pass
        </h1>

        <p className="text-gray-500 mt-1">
          Create and print visitor entry passes
        </p>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-12 gap-4">

        {/* LEFT SECTION */}

        <div className="col-span-7">


          {/* FORM */}

          <Card>

          <GeneratePassForm
            formData={formData}
            setFormData={setFormData}
            setSelectedVisitor={setSelectedVisitor}
            capturedPhoto={capturedPhoto}
            setCapturedPhoto={setCapturedPhoto}
          />

            <div className="flex justify-end gap-4 mt-8">

              <Button className="bg-gray-300 hover:bg-gray-400 text-black">
                Reset
              </Button>

              <Button>
                Generate Pass
              </Button>

            </div>

          </Card>

        </div>

        {/* RIGHT SECTION */}

        <div className="col-span-5">

          {/* PASS PREVIEW */}

          <Card>

            <h2 className="text-xl font-semibold mb-3">
              Pass Preview
            </h2>

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