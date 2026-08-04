function PassPreview({
  passId = "0001",
  companyLogo = "",
  companyName = "My Company",
  primaryColor = "#6b7280",
  fillWidth = false,

  visitorName = "Visitor Name",
  company = "Company Name",
  mobileNumber = "9876543210",
  employeeToMeet = "Employee Name",

  visitDate = "23/05/2026",
  visitTime = "10:45 AM",

  photo = "",
}) {
  return (
    <div
      className={fillWidth ? "bg-white w-full flex flex-col" : "bg-white w-full max-w-[700px] mx-auto flex flex-col"}
      style={{ aspectRatio: "210 / 297", fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* HEADER */}
      <div
        className="px-10 pt-8 pb-6 text-center"
        style={{ borderBottom: `4px solid ${primaryColor}` }}
      >
        {companyLogo ? (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-20 h-20 object-contain mx-auto mb-3"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3" />
        )}
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-gray-900">
          {companyName}
        </h1>
        <p
          className="text-sm font-semibold uppercase tracking-[0.25em] mt-1"
          style={{ color: primaryColor }}
        >
          Visitor Pass
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 px-10 py-6 flex flex-col">
        {/* Photo + Pass ID */}
        <div className="flex items-center gap-8 mb-6">
          {photo ? (
            <img
              src={photo}
              alt="Visitor"
              className="w-36 h-40 rounded-lg object-cover border-2"
              style={{ borderColor: primaryColor }}
            />
          ) : (
            <div
              className="w-36 h-40 rounded-lg bg-gray-100 border-2 flex items-center justify-center text-gray-400 text-xs"
              style={{ borderColor: primaryColor }}
            >
              No Photo
            </div>
          )}

          <div className="flex-1">
            <p
              className="text-4xl font-black tracking-wide"
              style={{ color: primaryColor }}
            >
              #{passId}
            </p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Pass Number</p>
          </div>
        </div>

        {/* Visitor Details */}
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-6">
            <DetailRow label="Visitor Name" value={visitorName} color={primaryColor} />
            <DetailRow label="Company" value={company} color={primaryColor} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <DetailRow label="Mobile" value={mobileNumber} color={primaryColor} />
            <DetailRow label="Employee To Meet" value={employeeToMeet} color={primaryColor} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <DetailRow label="Date" value={visitDate} color={primaryColor} />
            <DetailRow label="Time" value={visitTime} color={primaryColor} />
          </div>
        </div>

        {/* SIGNATURES */}
        <div
          className="mt-auto pt-6 grid grid-cols-3 gap-8 text-center"
          style={{ borderTop: `2px dashed ${primaryColor}40` }}
        >
          <SignatureBox label="Employee" />
          <SignatureBox label="Visitor" />
          <SignatureBox label="Security" />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, color }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: color + "99" }}>
        {label}
      </p>
      <p className="text-base font-semibold text-gray-800">{value || "--"}</p>
    </div>
  );
}

function SignatureBox({ label }) {
  return (
    <div>
      <div className="h-14 border-b border-gray-400" />
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

export default PassPreview;
