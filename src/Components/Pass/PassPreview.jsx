function PassPreview({
  passId = "0001",
  companyLogo = "",
  companyName = "My Company",

  visitorName = "Visitor Name",
  company = "Company Name",
  mobileNumber = "9876543210",
  employeeToMeet = "Employee Name",

  visitDate = "23/05/2026",
  visitTime = "10:45 AM",

  photo = "",
}) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl p-2 w-full max-w-sm mx-auto">

      {/* HEADER */}

      <div className="text-center pb-1">

        {companyLogo ? (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-8 h-8 object-contain mx-auto"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto" />
        )}

        <h2 className="text-sm font-bold uppercase leading-tight">
          {companyName}
        </h2>

        <p className="text-[10px] text-gray-500 leading-tight">
          Visitor Pass
        </p>

      </div>

      {/* PASS ID + PHOTO + DETAILS */}

      <div className="flex items-center gap-2 mt-1">

        <div className="shrink-0">

          {photo ? (
            <img
              src={photo}
              alt="Visitor"
              className="w-12 h-12 rounded-xl object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gray-200 border" />
          )}

        </div>

        <div className="flex-1 space-y-0 text-[10px] min-w-0">

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Pass</span>
            <span className="font-semibold">#{passId}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Visitor</span>
            <span className="font-medium truncate">{visitorName}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Company</span>
            <span className="font-medium truncate">{company}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Mobile</span>
            <span className="font-medium truncate">{mobileNumber}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Emp</span>
            <span className="font-medium truncate">{employeeToMeet}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Date</span>
            <span className="font-medium">{visitDate}</span>
          </div>

          <div className="flex justify-between gap-1">
            <span className="text-gray-500 shrink-0">Time</span>
            <span className="font-medium">{visitTime}</span>
          </div>

        </div>

      </div>

      {/* SIGNATURES */}

      <div className="grid grid-cols-3 gap-1 mt-1 text-center text-[8px]">

        <div>
          <div className="border-t pt-0.5">Employee</div>
        </div>

        <div>
          <div className="border-t pt-0.5">Visitor</div>
        </div>

        <div>
          <div className="border-t pt-0.5">Security</div>
        </div>

      </div>

    </div>
  );
}

export default PassPreview;