function Input({
  label,
  className = "",
  id,
  error,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5">

      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`border ${error ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-xl px-4 py-3 outline-none focus:ring-2 ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

    </div>
  );
}

export default Input;