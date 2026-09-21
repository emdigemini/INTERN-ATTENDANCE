import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { PaginationType } from '../../..';


const Pagination = ({
  page,
  limit,
  totalItems,
  totalPages
}: PaginationType) => {

  const startItem =
    totalItems === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalItems
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
      <span>
        {startItem} - {endItem} of {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          className="rounded p-1.5 transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="px-2">
          Page {page}
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          className="rounded p-1.5 transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;