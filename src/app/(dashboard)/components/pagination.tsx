import React from "react";
import Image from "next/image";
import NavRightTable from "@/components/icons/navRightTable";
import NavLeftTable from "@/components/icons/navLeftTable";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  lastThreePages: number[];
  handleNext: () => void;
  handlePrev: () => void;
  handlePageClick: (page: number) => void;
  firstThreePages: number[];
  padding?: string; // optional with default value
}


const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  lastThreePages,
  handleNext,
  handlePageClick,
  handlePrev,
  firstThreePages,
  padding="px-14"
}) => {

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(...firstThreePages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(...lastThreePages);
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
      }
    }
    return pageNumbers.map((page, index) => (
      <button
        key={index}
        onClick={() => handlePageClick(page)}
        className={`text-[14px] font-[500] w-10 h-10 rounded-md text-center ${page === currentPage ? "bg-GrayHomz5 text-GrayHomz" : ""
          }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className={`flex md:w-full gap-2 justify-between mt-4 md:${padding}`}>
      <div>
      <button
          onClick={handlePrev}
          className={`text-[14px] font-[500] py-2 px-6 border rounded-md hover:bg-whiteblue border-GrayHomz  md:border-BlueHomz text-BlueHomz flex items-center justify-center ${currentPage === 1 ? "pointer-events-none opacity-20" : ""
            }`}
        >
          <div className='md:hidden'>
            <NavLeftTable />
          </div>
          <Image
            className='hidden md:block'
            src={"/arrow-left-blues.png"} alt="" height={16} width={16} />
          <span className='hidden md:block'>Previous</span>
        </button>
      </div>
      <div className="hidden md:flex items-center justify-around">
        {renderPageNumbers()}
      </div>

      <div className="block text-center md:hidden">
        <p className="">
          page {currentPage} of {totalPages}
        </p>
      </div>
      <div>
      <button
          onClick={handleNext}
          className={`py-2 px-6 rounded-md text-[14px] font-[500] border hover:bg-whiteblue border-GrayHomz  md:border-BlueHomz text-BlueHomz flex items-center justify-center ${totalPages <= 6 ? "ml-[0]" : "ml-0"
            } ${currentPage === totalPages ? "pointer-events-none opacity-20" : ""
            }`}
        >
          <span className='hidden md:block'>Next</span>
          <div className='md:hidden'>
            <NavRightTable />
          </div>
          <Image
            className='hidden md:block'
            src={"/arrow-right-blue.png"} alt="" height={16} width={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
