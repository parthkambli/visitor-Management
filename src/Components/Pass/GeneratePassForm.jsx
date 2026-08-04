import { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Webcam from "react-webcam";

import Input from "../UI/Input";
import Button from "../UI/Button";

function GeneratePassForm({
  formData,
  setFormData,
  setSelectedVisitor,
  capturedPhoto,
  setCapturedPhoto,
  visitors = [],
  errors = {},
}) {
  const webcamRef = useRef(null);

  const [showCamera, setShowCamera] =
    useState(false);

  const visitorOptions =
    visitors.map((visitor) => ({
      value: visitor.id,
      label: visitor.name,
      visitor,
    }));

  const isDark = document.body.classList.contains("dark");

  const darkStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#374151",
      borderColor: "#4b5563",
      color: "#f9fafb",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#374151",
      borderColor: "#4b5563",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#2563eb" : isFocused ? "#4b5563" : "#374151",
      color: "#f9fafb",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f9fafb",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: "#f9fafb",
    }),
    indicatorSeparator: () => ({
      backgroundColor: "#4b5563",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
  };

  const selectStyles = isDark
    ? {
        ...(errors.visitorName
          ? { control: (base) => ({ ...darkStyles.control(base), borderColor: "#f87171" }) }
          : {}),
        ...darkStyles,
      }
    : errors.visitorName
      ? { control: (base) => ({ ...base, borderColor: "#f87171" }) }
      : undefined;

  const currentValue = formData.visitorName
    ? visitorOptions.find(o => o.label === formData.visitorName) || { value: formData.visitorName, label: formData.visitorName }
    : null;

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

  const handleCreateVisitor = (inputValue) => {
    setSelectedVisitor(null);
    setFormData({
      ...formData,
      visitorName: inputValue,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, mobileNumber: digitsOnly });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const capturePhoto = () => {
    const imageSrc =
      webcamRef.current.getScreenshot();

    setCapturedPhoto(imageSrc);

    setShowCamera(false);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* LEFT SIDE */}

      <div className="col-span-2 space-y-2">
        {/* VISITOR */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Visitor Name
          </label>

          <CreatableSelect
            options={visitorOptions}
            value={currentValue}
            onChange={handleVisitorSelect}
            onCreateOption={handleCreateVisitor}
            placeholder="Search or create visitor..."
            styles={selectStyles}
          />

          {errors.visitorName && (
            <p className="text-xs text-red-500 mt-1">{errors.visitorName}</p>
          )}
        </div>

        {/* MOBILE */}

        <Input
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter mobile number"
          error={errors.mobileNumber}
        />

        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company"
          error={errors.company}
        />

        {/* EMPLOYEE */}

        <Input
          label="Employee To Meet"
          name="employeeToMeet"
          value={formData.employeeToMeet}
          onChange={handleChange}
          placeholder="Enter employee name"
          error={errors.employeeToMeet}
        />

        {/* DATE + TIME */}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            error={errors.visitDate}
          />

          <Input
            label="Time"
            type="time"
            name="visitTime"
            value={formData.visitTime}
            onChange={handleChange}
            error={errors.visitTime}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div>
        <p className="text-xs text-gray-400 mb-1 text-center">Photo (Optional)</p>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[120px] flex flex-col items-center justify-center p-2">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Visitor"
              className="w-20 h-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gray-200" />
          )}

          <Button
            className="my-2"
            onClick={() =>
              setShowCamera(true)
            }
          >
            Capture Photo
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Photo preview after capture
          </p>
        </div>

        {showCamera && (
          <div className="mt-2 space-y-2">
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