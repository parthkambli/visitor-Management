function Badge({
  children,
  variant = "default",
}) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "badge-primary",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;