export function Input({ type = "text", placeholder = "", className = "", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
}
