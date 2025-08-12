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
}

// Function to extract username from email address
const extractUsername = (userOrEmail: string) => {
  if (userOrEmail) {
    let email = userOrEmail;
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
  const { logOutUser, userData } = useAuthSlice();
  const [open, setOpen] = useState(false);
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
    <div className="text-BlackHomz px-6 font-normal w-[147px] md:w-full md:flex justify-between text-[16px] max-w-[1160px] items-center md:m-auto pt-12 shadow-m">
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
      <Link href={"/"}>
        <Image
          src={"/Homz_Logo_Blue.png"}
          alt="HOMZ"
          height={28}
          className="cursor-pointer "
          width={131}
        />
      </Link>
      <nav
        className={`sm:my-0 my-4 flex gap-14 md:items-center items-start flex-col md:flex-row ${state.open ? "block" : "hidden md:flex"}`}
      >
        <div className="mt-5 text-[12px] lg:text-[16px] md:mt-0 flex gap-4 md:gap-5 lg:gap-10 flex-col md:flex-row">
          <Link
            href={"/"}
            className={`hover:text-blue-400 ${pathname === "/" ||
              pathname === "/search-page/PropertyListing" ||
              pathname === "/search-page/PreviewProperty" ||
              pathname === "/search-page"
              ? "text-BlueHomz"
              : ""
              }`}
          >
            Home
          </Link>
          <Link
            href={"/landlord"}
            className={`hover:text-blue-400 ${pathname === "/landlord" ? "text-BlueHomz" : ""}`}
          >
            Management
          </Link>
          <div className="relative flex items-center gap-1">
            <Link
              href={
                pathname === "/enterprise" ||
                  pathname === "/document-generation" ||
                  pathname === "/estate-management"
                  ? ""
                  : "/enterprise"
              }
              className={`${pathname === "/document-generation" ||
                pathname === "/enterprise" || pathname === "/estate-management"
                ? "text-BlueHomz"
                : ""
                } hover:text-blue-400`}
            >
              {pathname === "/document-generation"
                ? "Document Generation"
                : pathname === "/enterprise"
                  ? "Property Management"
                  : pathname === "/estate-management" ?
                    "Estate Management"
                    : "Products"}
            </Link>
            <div
              className={`mt-0.5 cursor-pointer flex`}
              onClick={() => toggleState('subMenuOpen')}
            >
              {state.subMenuOpen ? <ArrowUpII /> : <Down />}
            </div>
            {state.subMenuOpen && (
              <div
                className={`absolute px-3 top-5 md:top-7 py-3 flex flex-col gap-2 items-start justify-center rounded-[10px] text-[12px] md:text-[14px] text-BlackHomz w-[210px] sm:w-[240px] border z-[99999] bg-white`}
              >
                <Link
                  href={"/enterprise"}
                  className="w-full"
                  onMouseEnter={() => setSpecificState('active', true)}
                  onMouseLeave={() => setSpecificState('active', false)}
                >
                  {state.active ? (
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
                  className="w-full"
                  onMouseEnter={() => setSpecificState('activeTwo', true)}
                  onMouseLeave={() => setSpecificState('activeTwo', false)}
                >
                  {state.activeTwo ? (
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
                  className="w-full"
                  onMouseEnter={() => setSpecificState('activeThree', true)}
                  onMouseLeave={() => setSpecificState('activeThree', false)}
                >
                  {state.activeThree ? (
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
            className={`hover:text-blue-400 ${pathname === "/tenant" ? "text-BlueHomz" : ""}`}
          >
            Tenant
          </Link>

          <Link
            href={""}
            className="hover:text-blue-400 "
          >
            List A Property
          </Link>
        </div>
      </nav>
      <div
        className={`mt-[20px] md:mt-0 md:text-[12px] lg:text-[16px] ml-0 md:ml-[-20px] lg:ml-0 md:flex md:justify-center space-y-4 md:space-y-0 items-center md:space-x-4 space-x-0 ${state.open ? "block" : "hidden md:flex"}`}
      >
        {userData && token ? (
          <div
            className={`flex items-center ${open ? "flex  flex-col gap-4 items-start" : "gap-2"
              }`}
          >
            <Link href={(userData && token) ? "/dashboard" : "/"}>
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
              <Link
                href="/register"
                className={`w-[147px] rounded-[4px] text-white bg-BlueHomz items-center flex justify-center h-[48px] py-1 hover:bg-blue-400 ${state.open ? "text-[12px] " : ""}`}
              >
                Create Account
              </Link>
            </>
          )}
        <div
          className="md:hidden border absolute right-8 top-[48px] cursor-pointer"
          onClick={() => toggleState('open')}
        >
          {state.open ? <Close /> : <Menu />}
        </div>
      </div>
    </div>
  );
};

export default Header;