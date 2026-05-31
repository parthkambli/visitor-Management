import { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Webcam from "react-webcam";

import Input from "../ui/Input";
import Button from "../ui/Button";

import mockVisitors from "../../data/mockVisitors";

function GeneratePassForm({
  formData,
  setFormData,
  setSelectedVisitor,
  capturedPhoto,
  setCapturedPhoto,
}) {
  const webcamRef = useRef(null);

  const [showCamera, setShowCamera] =
    useState(false);

  const visitorOptions =
    mockVisitors.map((visitor) => ({
      value: visitor.id,
      label: visitor.name,
      visitor,
    }));

  const handleVisitorSelect = (
    selected
  ) => {
    if (!selected) return;

    const visitor = selected.visitor;

    if (visitor) {
      setSelectedVisitor(visitor);

      setFormData({
        ...formData,
        visitorName: visitor.name,
        company: visitor.company,
        mobileNumber: visitor.phone,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const capturePhoto = () => {
    const imageSrc =
      webcamRef.current.getScreenshot();

    setCapturedPhoto(imageSrc);

    setShowCamera(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* LEFT SIDE */}

      <div className="col-span-2 space-y-5">
        {/* VISITOR */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Visitor Name
          </label>

          <CreatableSelect
            options={visitorOptions}
            onChange={handleVisitorSelect}
            placeholder="Search or create visitor..."
          />
        </div>

        {/* MOBILE */}

        <Input
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter mobile number"
        />

        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company"
        />

        {/* EMPLOYEE */}

        <Input
          label="Employee To Meet"
          name="employeeToMeet"
          value={formData.employeeToMeet}
          onChange={handleChange}
          placeholder="Enter employee name"
        />

        {/* DATE + TIME */}

        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Date"
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
          />

          <Input
            label="Time"
            type="time"
            name="visitTime"
            value={formData.visitTime}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[320px] flex flex-col items-center justify-center p-4">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Visitor"
              className="w-40 h-40 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-2xl bg-gray-200" />
          )}

          <Button
            className=" my-4"
            onClick={() =>
              setShowCamera(true)
            }
          >
            Capture Photo
          </Button>

          <p className="text-sm text-gray-400 mt-3 text-center">
            Photo preview after capture
          </p>
        </div>

        {showCamera && (
          <div className="mt-4 space-y-3">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-2xl w-full"
            />

            <Button onClick={capturePhoto}>
              Take Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratePassForm;