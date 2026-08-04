function Button({
  children,
  className = "",
  loading,
  disabled,
  ...props
}) {
  const isDefaultColor = !className.includes("bg-") || className.includes("bg-blue-");

  return (
    <button
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-xl text-white transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ${className}`}
      style={isDefaultColor ? { backgroundColor: "var(--color-primary)" } : undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;