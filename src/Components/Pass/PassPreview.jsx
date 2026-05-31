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
    <div className="bg-white border-2 border-black rounded-2xl p-4 w-full max-w-sm mx-auto">

      {/* HEADER */}

      <div className="text-center border-b pb-4">

        {companyLogo ? (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3" />
        )}

        <h2 className="text-xl font-bold uppercase">
          {companyName}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Visitor Pass
        </p>

      </div>

      {/* PASS ID */}

      <div className="flex justify-between items-center mt-4">

        <span className="text-gray-500 text-sm">
          Pass ID
        </span>

        <span className="font-bold text-lg">
          #{passId}
        </span>

      </div>

      {/* PHOTO */}

      <div className="flex justify-center mt-4">

        {photo ? (
          <img
            src={photo}
            alt="Visitor"
            className="w-28 h-28 rounded-xl object-cover border"
          />
        ) : (
          <div className="w-28 h-28 rounded-xl bg-gray-200 border" />
        )}

      </div>

      {/* DETAILS */}

      <div className="mt-4 space-y-4 text-sm">

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Visitor
          </span>

          <span className="font-medium text-right">
            {visitorName}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Company
          </span>

          <span className="font-medium text-right">
            {company}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Mobile
          </span>

          <span className="font-medium text-right">
            {mobileNumber}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Employee
          </span>

          <span className="font-medium text-right">
            {employeeToMeet}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Date
          </span>

          <span className="font-medium text-right">
            {visitDate}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-gray-500">
            Time
          </span>

          <span className="font-medium text-right">
            {visitTime}
          </span>

        </div>

      </div>

      {/* SIGNATURES */}

      <div className="grid grid-cols-3 gap-4 mt-10 text-center text-xs">

        <div>

          <div className="border-t pt-2">
            Employee
          </div>

        </div>

        <div>

          <div className="border-t pt-2">
            Visitor
          </div>

        </div>

        <div>

          <div className="border-t pt-2">
            Security
          </div>

        </div>

      </div>

    </div>
  );
}

export default PassPreview;