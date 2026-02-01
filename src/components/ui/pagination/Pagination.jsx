export default function Pagination({ totalPages, currentItems, currentPage, setCurrentPage }) {
  
    const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
  }
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      <button onClick={() => goToPage(currentPage - 1)}>{"<"}</button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => goToPage(i + 1)}
          className={`px-3 py-1 rounded border ${
            currentPage === i + 1
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[#141a25] text-gray-300 border-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => goToPage(currentPage + 1)}>{">"}</button>
    </div>
  );
}
