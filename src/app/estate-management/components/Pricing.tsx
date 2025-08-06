"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Widget from "./widget";

const Pricing = ({ hidden = false }) => {
  return (
    <div className="mt-[120px]  w-full m-auto px-6 flex flex-col items-center gap-[60px]">
      <div className="max-w-[897px] flex flex-col items-center gap-3">
        <h2 className="  text-BlueHomz text-[18px]  text-center font-[500]">
          Pricing
        </h2>
        <h1 className="text-[23px] sm:text-[36px] text-center font-[700]">
          Simple, transparent pricing
        </h1>
        <p className="text-[18px] sm:text-[20px] text-center text-GrayHomz font-[500]">
          We believe our enterprise plans should be accessible to all property
          managers.
        </p>
      </div>
      <Widget />
      {!hidden
        &&
        <div className="mt-4 max-w-[1160px]">
          <div className="flex flex-col justify-around items-center py-[60px] px-8 bg-[url('/Background_image.png')] text-white rounded-[20px] shadow-2xl bg-cover bg-center bg-black max-w-full sm:w-[670px]  md:w-[786px] lg:w-[824px] xl:w-[1159px] h-[253px]">
            <h1 className="font-[700] text-center text-[20px] md:text-[36px]">
              Start your 14-day free trial
            </h1>
            <div className="mt-4 sm:mt-0 flex w-full flex-col sm:flex-row sm:w-auto gap-4">
              <Link href={"/register"}>
                <button className="w-full sm:w-[116px] h-[48px] text-[16px]  hover:bg-transparent  hover:text-white hover:border rounded-md font-normal  text-BlueHomz  bg-white  px-2 py-1">
                  Get started
                </button>
              </Link>
              <Link href={"https://cal.com/homzng/"}>
                <button className="w-full sm:w-[116px] h-[48px] text-[16px] hover:bg-white  hover:text-BlueHomz rounded-md font-normal  text-white border bg-transparent px-2 py-1">
                  Book Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Pricing;

