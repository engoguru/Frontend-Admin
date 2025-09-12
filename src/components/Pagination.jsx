import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > halfPagesToShow + 2) {
        pageNumbers.push('...');
      }

      let start = Math.max(2, currentPage - halfPagesToShow);
      let end = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage <= halfPagesToShow + 1) {
        end = maxPagesToShow;
      }
      if (currentPage >= totalPages - halfPagesToShow) {
        start = totalPages - maxPagesToShow + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - halfPagesToShow - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4 py-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[10, 20, 50, 100].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden sm:block">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center space-x-1">
            <button onClick={handlePrevious} disabled={currentPage === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button>
            {pages.map((page, index) =>
              typeof page === 'number' ? (
                <button key={index} onClick={() => onPageChange(page)} className={`px-3 py-1 text-sm border rounded ${currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100'}`}>{page}</button>
              ) : (
                <span key={index} className="px-3 py-1 text-sm">...</span>
              )
            )}
            <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;