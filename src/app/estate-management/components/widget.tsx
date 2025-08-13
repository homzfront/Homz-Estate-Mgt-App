"use client"
import React from "react";
import PlanPayBiAnnually from "./planPayBiAnnually";
import PlansYearly from "./plansYearly";
import Plans from "./plansMonthly";


const Widget = () => {
  const [active, setActive] = React.useState(0);

  const pages = [
    "Pay Monthly",
    "Pay bi-annually",
    "Pay Yearly",
  ];

  return (
    <div className="w-full max-w-[1440px]">
      <div className="w-auto h-auto py-4">
        <div className="flex mt-1 gap-3 justify-center sm:gap-2 flex-wrap sm:flex-nowrap sm:justify-between w-full sm:w-[500px] cursor-pointer m-auto">
          {pages.map((page, index) => (
            <div
              key={index}
              className={`mt-2 sm:mt-0 ${page === "Pay Yearly" ? "" : ""} flex flex-col items-center py-2 px-3 justify-center rounded-md ${active === index ? "bg-BlueHomz text-white" : "bg-whiteblue text-BlueHomz "
                }`}
              onClick={() => {
                setActive(index)
              }}
            >
              <p className={`text-[14px] font-500 ${page === "Pay Yearly" || page === "Pay bi-annually" ? "flex items-center gap-1" : ""}`}>{page} <span className={`${page === "Pay Yearly" || page === "Pay bi-annually" ? " bg-BlueHomz  py-1 px-2 rounded-md  font-normal text-[11px]" : "hidden"} ${active === index ? "bg-white text-BlueHomz" : "text-white"}`}>{page === "Pay Yearly" ? "Save 20%" : "Save 10%"}</span></p>
            </div>
          ))}
        </div>
        <div className="my-5 rounded-[12px] ">
          {active === 0 && (
            <Plans />
          )}
          {active === 1 && (
            <PlanPayBiAnnually />
          )}
          {active === 2 && (
            <PlansYearly />
          )}
        </div>
      </div>
    </div>
  );
};

export default Widget;
