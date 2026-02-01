export default function TagButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow"
          : "bg-[#141a25] text-gray-300 border-gray-600 hover:bg-[#1e2636]"
      }`}
    >
      {children}
    </button>
  );
}