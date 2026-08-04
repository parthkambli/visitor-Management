function FloatingSelect({ label, className = "", id, children, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <fieldset className="relative rounded-xl border border-gray-300 px-3 pb-2.5 pt-1 focus-within:ring-2 transition" style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
      <legend className="px-1 text-xs font-medium" style={{ color: "var(--color-primary)" }}>
        {label}
      </legend>
      <div className="relative">
        <select
          id={inputId}
          className={`peer w-full bg-transparent outline-none text-sm text-gray-800 appearance-none pr-7 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </fieldset>
  );
}

export default FloatingSelect;
