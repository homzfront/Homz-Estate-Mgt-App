/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useState } from "react";
import Menu from "../icons/Menu";
import Close from "../icons/Close";
import Image from "next/image";
import BusinessAlert from "../icons/businessAlert";
import Down from "../icons/Down";
import EnterpriseDoc from "../icons/enterpriseDoc";
import ArrowUpII from "../icons/arrowUpII";
import PropertyManagement from "../icons/estateHomePage/propertyManagement";
import PropertyListing from "../icons/estateHomePage/propertyListing";
import { usePathname } from "next/navigation";
import { useAuthSlice } from "@/store/authStore";
import { getToken } from "@/utils/cookies";
interface HeaderState {
  subMenuOpen: boolean;
  active: boolean;
  activeTwo: boolean;
  activeThree: boolean;
  openModalForBusi: boolean;
  open: boolean;
};

// Function to extract username from email address
const extractUsername = (userOrEmail: string) => {
  if (userOrEmail) {
    const email = userOrEmail;
    // Split the email address by "@" to get an array
    const parts = email?.split("@");

    // The username is the first part of the array (index 0)
    const username = parts[0];

    return username;
  } else {
    return;
  }
};

const Header = () => {
  const pathname = usePathname();
  const [state, setState] = useState<HeaderState>({
    subMenuOpen: false,
    active: false,
    activeTwo: false,
    activeThree: false,
    openModalForBusi: false,
    open: false
  });
  const { logOutUser, userData, residentProfile } = useAuthSlice();
  const [open] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t as any);
    })();
  }, []);

  const toggleState = (key: keyof HeaderState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setSpecificState = <K extends keyof HeaderState>(key: K, value: HeaderState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="text-BlackHomz px-6 font-normal w-full md:flex justify-between text-[16px] max-w-[1160px] items-center md:m-auto pt-12 shadow-m relative">
      {state.openModalForBusi && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-30">
          <div className="bg-white w-[320px] md:w-[464px] h-[290px] rounded-[12px] flex flex-col p-8 items-center justify-around">
            <BusinessAlert />
            <p className="text-[16px] md:text-[20px] font-[700] text-BlackHomz">
              Update Business Information
            </p>
            <p className="text-[14px] md:text-[16px] font-[400] text-GrayHomz text-center">
              Kindly upload your business certification in order to list more
              properties
            </p>
            <Link
              href={"/dashboard/list_Property/Profile?tab=business"}
              className="w-full h-[48px] bg-BlueHomz rounded-[4px] flex items-center justify-center"
            >
              <span className="text-white text-[14px] md:text-[16px] font-[700]">
                Upload Certificate
              </span>
            </Link>
          </div>
        </div>
      )}
      
      {/* Header with Logo and Mobile Toggle */}
      <div className="flex justify-between items-center w-full md:w-auto relative">
        <Link href={"/"}>
          <Image
            src={"/Homz_Logo_Blue.png"}
            alt="HOMZ"
            height={28}
            className="cursor-pointer"
            width={131}
          />
        </Link>
        
        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden border cursor-pointer p-2 rounded-md hover:bg-gray-100"
          onClick={() => toggleState('open')}
        >
          {state.open ? <Close /> : <Menu />}
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {state.open && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => toggleState('open')} />
      )}
      
      {/* Navigation Menu */}
      <nav
        className={`${
          state.open 
            ? "fixed top-0 left-0 w-[280px] h-full bg-white z-50 shadow-xl transform translate-x-0 transition-transform duration-300 flex flex-col"
            : "hidden md:flex md:gap-14 md:items-center"
        }`}
      >
        {/* Mobile Menu Header */}
        {state.open && (
          <div className="flex justify-between items-center p-6 border-b">
            <Image
              src={"/Homz_Logo_Blue.png"}
              alt="HOMZ"
              height={24}
              width={112}
            />
            <div
              className="cursor-pointer p-1 rounded-md hover:bg-gray-100"
              onClick={() => toggleState('open')}
            >
              <Close />
            </div>
          </div>
        )}
        
        <div className={`${
          state.open 
            ? "flex flex-col gap-6 p-6 flex-1"
            : "mt-5 text-[12px] lg:text-[16px] md:mt-0 flex gap-4 md:gap-5 lg:gap-10 flex-col md:flex-row"
        }`}>
          <Link
            href={"/"}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${
              state.open && (pathname === "/" ||
              pathname === "/search-page/PropertyListing" ||
              pathname === "/search-page/PreviewProperty" ||
              pathname === "/search-page")
              ? "bg-blue-50 text-BlueHomz"
              : pathname === "/" ||
              pathname === "/search-page/PropertyListing" ||
              pathname === "/search-page/PreviewProperty" ||
              pathname === "/search-page"
              ? "text-BlueHomz"
              : ""
              }`}
            onClick={() => state.open && toggleState('open')}
          >
            Home
          </Link>
          <Link
            href={"/landlord"}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${
              state.open && pathname === "/landlord" ? "bg-blue-50 text-BlueHomz" : pathname === "/landlord" ? "text-BlueHomz" : ""
            }`}
            onClick={() => state.open && toggleState('open')}
          >
            Management
          </Link>
          <div className={`relative ${state.open ? "w-full" : "flex items-center gap-1"}`}>
            <div
              className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors cursor-pointer flex justify-between items-center w-full" : "flex items-center gap-1"} ${pathname === "/document-generation" ||
                pathname === "/enterprise" || pathname === "/estate-management"
                ? state.open ? "bg-blue-50 text-BlueHomz" : "text-BlueHomz"
                : ""
                } hover:text-blue-400`}
              onClick={() => toggleState('subMenuOpen')}
            >
              <span>
                {pathname === "/document-generation"
                  ? "Document Generation"
                  : pathname === "/enterprise"
                    ? "Property Management"
                    : pathname === "/estate-management" ?
                      "Estate Management"
                      : "Products"}
              </span>
              <div className={`${state.open ? "" : "mt-0.5"} cursor-pointer flex`}>
                {state.subMenuOpen ? <ArrowUpII /> : <Down />}
              </div>
            </div>
            {state.subMenuOpen && (
              <div
                className={`${
                  state.open 
                    ? "mt-2 ml-4 flex flex-col gap-1" 
                    : "absolute px-3 top-5 md:top-7 py-3 flex flex-col gap-2 items-start justify-center rounded-[10px] text-[12px] md:text-[14px] text-BlackHomz w-[210px] sm:w-[240px] border z-[99999] bg-white"
                }`}
              >
                <Link
                  href={"/enterprise"}
                  className={`${state.open ? "py-2 px-3 rounded-md text-[14px] font-medium transition-colors flex items-center gap-2 hover:bg-gray-100" : "w-full"}`}
                  onMouseEnter={() => !state.open && setSpecificState('active', true)}
                  onMouseLeave={() => !state.open && setSpecificState('active', false)}
                  onClick={() => state.open && toggleState('open')}
                >
                  {state.open ? (
                    <>
                      <PropertyListing height="20" width="20" />
                      <span>Property Management</span>
                    </>
                  ) : state.active ? (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <PropertyListing
                        className="text-BlueHomz fill-white"
                        height="24"
                        width="24"
                      />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 text-[#006AFF]">
                        Property Management
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <PropertyListing height="24" width="24" />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 ">
                        Property Management
                      </p>
                    </div>
                  )}
                </Link>
                <Link
                  href={"/estate-management"}
                  className={`${state.open ? "py-2 px-3 rounded-md text-[14px] font-medium transition-colors flex items-center gap-2 hover:bg-gray-100" : "w-full"}`}
                  onMouseEnter={() => !state.open && setSpecificState('activeTwo', true)}
                  onMouseLeave={() => !state.open && setSpecificState('activeTwo', false)}
                  onClick={() => state.open && toggleState('open')}
                >
                  {state.open ? (
                    <>
                      <PropertyManagement className="fill-BlackHomz" height="20" width="20" />
                      <span>Estate Management</span>
                    </>
                  ) : state.activeTwo ? (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <PropertyManagement
                        className="fill-BlueHomz text-white"
                        height="24"
                        width="24"
                      />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 text-[#006AFF]">
                        Estate Management
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <PropertyManagement className="fill-BlackHomz" height="24" width="24" />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 ">
                        Estate Management
                      </p>
                    </div>
                  )}
                </Link>
                <Link
                  href={"/document-generation"}
                  className={`${state.open ? "py-2 px-3 rounded-md text-[14px] font-medium transition-colors flex items-center gap-2 hover:bg-gray-100" : "w-full"}`}
                  onMouseEnter={() => !state.open && setSpecificState('activeThree', true)}
                  onMouseLeave={() => !state.open && setSpecificState('activeThree', false)}
                  onClick={() => state.open && toggleState('open')}
                >
                  {state.open ? (
                    <>
                      <EnterpriseDoc />
                      <span>Document Generation</span>
                    </>
                  ) : state.activeThree ? (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <EnterpriseDoc className="#006AFF" />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 text-[#006AFF]">
                        Document Generation
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md">
                      <EnterpriseDoc />
                      <p className="text-[11px] md:text-[13px] font-[500] py-1 px-2 ">
                        Document Generation
                      </p>
                    </div>
                  )}
                </Link>
              </div>
            )}
          </div>
          <Link
            href={"/tenant"}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${
              state.open && pathname === "/tenant" ? "bg-blue-50 text-BlueHomz" : pathname === "/tenant" ? "text-BlueHomz" : ""
            }`}
            onClick={() => state.open && toggleState('open')}
          >
            Tenant
          </Link>

          <Link
            href={""}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400`}
            onClick={() => state.open && toggleState('open')}
          >
            List A Property
          </Link>
        </div>
        
        {/* Mobile User Section */}
        {state.open && (
          <div className="mt-auto p-6 border-t">
            {userData && token ? (
              <div className="flex flex-col gap-4">
                <Link 
                  href={residentProfile?._id ? "/resident/dashboard" : (userData && token) ? "/dashboard" : "/"}
                  className="text-[16px] font-medium"
                  onClick={() => toggleState('open')}
                >
                  Hi, {extractUsername(userData?.email)}!
                </Link>
                <button
                  onClick={async () => {
                    await logOutUser();
                    toggleState('open');
                  }}
                  className="w-full rounded-[4px] px-4 py-3 text-white bg-BlueHomz hover:bg-blue-400 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-[16px] font-medium hover:text-blue-400"
                  onClick={() => toggleState('open')}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Desktop User Section */}
      <div
        className={`mt-[20px] md:mt-0 md:text-[12px] lg:text-[16px] ml-0 md:ml-[-20px] lg:ml-0 hidden md:flex md:justify-center space-y-4 md:space-y-0 items-center md:space-x-4 space-x-0`}
      >
        {userData && token ? (
          <div
            className={`flex items-center ${open ? "flex  flex-col gap-4 items-start" : "gap-2"
              }`}
          >
            <Link href={residentProfile?._id ? "/resident/dashboard" : (userData && token) ? "/dashboard" : "/"}>
              <p className={`w-full ${open ? "text-[12px] " : ""}`}>
                Hi, {extractUsername(userData?.email)}!
              </p>
            </Link>
            <button
              onClick={async () => {
                await logOutUser()
              }}
              className={`w-[110px] rounded-[4px] px-2 text-white bg-BlueHomz h-[48px] py-1 hover:bg-blue-400 ${open ? "text-[12px]" : ""
                }`}
            >
              Logout
            </button>
            {/* Add more user information or actions as needed */}
          </div>
        ) :
          (
            <>
              <Link
                href="/login"
                className={`hover:text-blue-400 ${state.open ? "text-[12px]" : ""}`}
              >
                Sign in
              </Link>
            </>
          )}
      </div>
    </div>
  );
};

export default Header;