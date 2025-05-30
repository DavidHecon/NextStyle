export function Button({ children, variant = "default", size = "md", ...props }) {
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    cancel: "bg-gray-300 text-gray-700 hover:bg-red-400 hover:text-red-900", // Nueva variante
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={`rounded-lg ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}