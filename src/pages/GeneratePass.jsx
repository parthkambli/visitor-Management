import { useState } from "react";

import Card from "../Components/UI/Card";
import Button from "../Components/UI/Button";

import GeneratePassForm from "../Components/Pass/GeneratePassForm";
import PassPreview from "../Components/Pass/PassPreview";

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

  return (
    <div>

      {/* HEADER */}

      <p className="text-gray-500 text-sm mb-2">
        Create and print visitor entry passes
      </p>

      {/* MAIN GRID */}

      <div className="grid grid-cols-12 gap-3">

        {/* LEFT SECTION */}

        <div className="col-span-7">


          {/* FORM */}

          <Card className="p-4">

          <GeneratePassForm
            formData={formData}
            setFormData={setFormData}
            setSelectedVisitor={setSelectedVisitor}
            capturedPhoto={capturedPhoto}
            setCapturedPhoto={setCapturedPhoto}
          />

            <div className="flex justify-end gap-3 mt-4">

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

          <Card className="p-3">

            <h2 className="text-base font-semibold mb-2">
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