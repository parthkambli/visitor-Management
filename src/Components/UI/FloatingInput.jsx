function FloatingInput({ label, className = "", id, icon: Icon, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <fieldset className="relative rounded-xl border border-gray-300 px-3 pb-2.5 pt-1 focus-within:ring-2 transition" style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
      <legend className="px-1 text-xs font-medium" style={{ color: "var(--color-primary)" }}>
        {label}
      </legend>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon size={18} className="text-gray-400 shrink-0" />
        )}
        <input
          id={inputId}
          className={`peer w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 ${className}`}
          {...props}
        />
      </div>
    </fieldset>
  );
}

export default FloatingInput;
