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
import ArrowRightSize16 from "../icons/arrowRightSize16";
import useClickOutside from "@/app/utils/useClickOutside";
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

  const productRef = React.useRef<HTMLDivElement | null>(null);
  useClickOutside(productRef as React.RefObject<HTMLDivElement>, () => {
    if (state.subMenuOpen) setSubMenuOpen(false);
  });

  // convenience helpers matching the new snippet API
  const toggleSubMenu = () => toggleState('subMenuOpen');
  const setSubMenuOpen = (val: boolean) => setSpecificState('subMenuOpen', val);

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
        className={`${state.open
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

        <div className={`${state.open
          ? "flex flex-col gap-6 p-6 flex-1"
          : "mt-5 text-[12px] lg:text-[16px] md:mt-0 flex gap-4 md:gap-5 lg:gap-10 flex-col md:flex-row"
          }`}>
          <Link
            href={"/"}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${state.open && pathname === "/" ? "text-BlueHomz"
              : ""
              }`}
            onClick={() => state.open && toggleState('open')}
          >
            Home
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}landlord`}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${state.open && pathname === "/landlord" ? "bg-blue-50 text-BlueHomz" : pathname === "/landlord" ? "text-BlueHomz" : ""
              }`}
            onClick={() => state.open && toggleState('open')}
          >
            Landlord
          </Link>
          <div className={`relative ${state.open ? "w-full" : "flex items-center gap-1"}`}>
            <div className={`${state.open ? "flex items-center gap-1 w-full py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : "flex items-center gap-1"}`}>
              <button
                onClick={() => {
                  toggleSubMenu();
                }}
                className={`${pathname === "/document-generation" || pathname === "/enterprise" || pathname === "/estate-management"
                  ? "text-BlueHomz"
                  : ""
                  } hover:text-blue-400`}
              >
                Products
              </button>
              <button
                onClick={toggleSubMenu}
                className={`${state.open ? "" : "mt-0.5"} cursor-pointer flex`}
              >
                {state.subMenuOpen ? <ArrowUpII /> : <Down />}
              </button>
            </div>
            {state.subMenuOpen && (
              <div
                ref={productRef}
                className={`${state.open
                  ? "mt-2 flex flex-col gap-1 w-full"
                  : "px-0 py-3 flex flex-col md:flex-row gap-2 items-start justify-center rounded-[10px] text-[12px] md:text-[14px] text-BlackHomz bg-white md:absolute md:top-7 md:left-1/2 md:-translate-x-1/2 md:transform md:px-3 md:border md:z-[99999] md:shadow-lg"
                  }`}
              >
                {/* Mobile: simplified list (icons + titles only) */}
                <div className="md:hidden w-full mt--5">
                  <Link href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}enterprise`} className="block w-full">
                    <div
                      className={`flex items-center gap-3 py-3 pl-4 hover:bg-whiteblue rounded-[6px] ${pathname === `${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}enterprise` ? "text-BlueHomz" : ""
                        }`}
                      onClick={() => setSubMenuOpen(false)}
                    >
                      <PropertyListing width="14" height="14" className="text-BlueHomz fill-BlueHomz" />
                      <span className="flex-1 text-[12px] min-w-[180px]">Property Management</span>
                    </div>
                  </Link>
                  <Link href="/" className="block w-full">
                    <div className={`flex items-center gap-3 py-3 pl-4 pr-2 hover:bg-whiteblue rounded-[6px]`}>
                      <PropertyManagement width="14" height="14" className="text-[#039855] fill-[#039855]" />
                      <span className="flex-1 text-[12px] min-w-[180px]">Estate Management</span>
                    </div>
                  </Link>
                  <Link href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}document-generation`} className="block w-full">
                    <div
                      className={`flex items-center gap-3 py-3 pl-4 pr-2 hover:bg-whiteblue rounded-[6px] ${pathname === "/document-generation" ? "text-[#DC6803]" : ""
                        }`}
                      onClick={() => setSubMenuOpen(false)}
                    >
                      <EnterpriseDoc className="#DC6803" />
                      <span className="flex-1 text-[12px] min-w-[180px]">Document Generation</span>
                    </div>
                  </Link>
                </div>

                {/* Desktop/Tablet: detailed cards */}
                <div className="hidden md:flex md:flex-row gap-2">
                  <Link href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}enterprise`} className="w-full md:min-w-[350px]">
                    <div className="p-4 hover:bg-whiteblue flex gap-2 items-start md:bg-[#F8FBFF] bg-transparent rounded-[4px] h-auto md:h-[190px]">
                      <button className="flex justify-center items-center rounded-full bg-BlueHomz h-[44px] min-w-[44px]">
                        <PropertyListing className="text-BlueHomz fill-white" />
                      </button>
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold text-GrayHomz">
                            Property Management
                          </p>
                          <h3 className="hidden md:block text-GrayHomz text-xs md:text-sm lg:text-base font-normal mt-1">
                            Easily manage properties, tenants, and rent payments from one intuitive dashboard.
                          </h3>
                        </div>
                        <button className="hidden md:flex mt-2 text-BlueHomz text-xs md:text-sm lg:text-base font-normal items-center gap-1 self-start">
                          Explore <ArrowRightSize16 color="#006AFF" w="14" h="14" />
                        </button>
                      </div>
                    </div>
                  </Link>
                  <Link href={"/"} className="w-full md:min-w-[350px]">
                    <div className="p-4 hover:bg-whiteblue flex gap-2 items-start md:bg-[#EFFFF8] bg-transparent rounded-[4px] h-auto md:h-[190px]">
                      <button className="flex justify-center items-center rounded-full bg-Success h-[44px] min-w-[44px]">
                        <PropertyManagement className="text-[#039855] fill-white" />
                      </button>
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold text-GrayHomz">
                            Community & Estate Management
                          </p>
                          <h3 className="hidden md:block text-GrayHomz text-xs md:text-sm lg:text-base font-normal mt-1">
                            Create and manage estates, bill tenants, and control visitor access with ease.
                          </h3>
                        </div>
                        <button className="hidden md:flex mt-2 text-Success text-xs md:text-sm lg:text-base font-normal items-center gap-1 self-start">
                          Explore <ArrowRightSize16 color="#039855" w="14" h="14" />
                        </button>
                      </div>
                    </div>
                  </Link>
                  <Link href={"/document-generation"} className="w-full md:min-w-[350px]">
                    <div className="p-4 hover:bg-whiteblue flex gap-2 items-start md:bg-[#FFFBF8] bg-transparent rounded-[4px] h-auto md:h-[190px]">
                      <button className="flex justify-center items-center rounded-full bg-[#DC6803] h-[44px] min-w-[44px]">
                        <EnterpriseDoc className="#EEF5FF" />
                      </button>
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold text-GrayHomz">
                            Document Generation
                          </p>
                          <h3 className="hidden md:block text-GrayHomz text-xs md:text-sm lg:text-base font-normal mt-1">
                            Generate professional property documents, agreements, and legal forms instantly.
                          </h3>
                        </div>
                        <button className="hidden md:flex mt-2 text-[#DC6803] text-xs md:text-sm lg:text-base font-normal items-center gap-1 self-start">
                          Explore <ArrowRightSize16 color="#DC6803" w="14" h="14" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}tenant`}
            className={`${state.open ? "py-3 px-4 rounded-lg text-[16px] font-medium transition-colors" : ""} hover:text-blue-400 ${state.open && pathname === "/tenant" ? "bg-blue-50 text-BlueHomz" : pathname === "/tenant" ? "text-BlueHomz" : ""
              }`}
            onClick={() => state.open && toggleState('open')}
          >
            Tenant
          </Link>

          <Link
            href={`${process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://homz.ng/'}list-a-property`}
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
                  href={userData?.accounts?.length === 0 ? "/select-profile" : residentProfile?._id ? "/resident/dashboard" : (userData && token) ? "/dashboard" : "/"}
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
            <Link href={userData?.accounts?.length === 0 ? "/select-profile" : residentProfile?._id ? "/resident/dashboard" : (userData && token) ? "/dashboard" : "/"}>
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
                className={`hover:text-blue-400 md:bg-BlueHomz text-GrayHomz p-0 md:p-2 md:rounded-md md:text-white ${state.open ? "text-[12px]" : ""}`}
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