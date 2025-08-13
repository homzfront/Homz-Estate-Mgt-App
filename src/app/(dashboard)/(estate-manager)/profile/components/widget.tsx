/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import BusinessInfo from "./businessInfo";
import PersonalInfo from "./personalInfo";
import ChangePassword from "../(changePassword)/changePassword";

const allPages = [
  {
    id: 1,
    name: "Personal Information",
    key: "personalInfo",
    component: <PersonalInfo />,
  },
  {
    id: 2,
    name: "Business Information",
    key: "businessInfo",
    component: <BusinessInfo />,
  },
  {
    id: 3,
    name: "Change Password",
    key: "changePassword",
    component: <ChangePassword />,
  },
];


const Widget = () => {
  const urlParams = useSearchParams();
  const pages = allPages;
  const initialTab = urlParams.get("tab");
  const initialActiveTab = initialTab ? pages.find(page => page.key === initialTab)?.id : 1;
  const [active, setActive] = useState<any>(initialActiveTab);
  useEffect(() => {
    if (initialTab) {
      const page = pages.find(page => page.key === initialTab);
      if (page) {
        setActive(page.id);
      }
    }
  }, [initialTab]);

  const handlePageChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string | number): void => {
    e.preventDefault();
    setActive(id);
  };

  return (
    <div>
      <div className="w-full h-auto py-4">
        <div className="flex mt-5 gap-2 justify-between w-[500px] cursor-pointer">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`flex flex-col items-center py-2 px-3 justify-center rounded-md ${active === page.id ? "bg-BlueHomz text-white" : "text-BlackHomz"}`}
              onClick={(e) => handlePageChange(e, page.id)}
            >
              <p className="text-[14px] font-500">{page.name}</p>
            </div>
          ))}
        </div>
        <div className="my-5 rounded-[12px]">
          {pages.map((page) => (
            <div key={page.id} className={active === page.id ? "inline" : "hidden"}>
              {typeof page.component === "function" ? page.component : page.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Widget;
