import React from "react";
import EstateHomePage from "./estate-management/page";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="m-auto max-w-[1440px]">
        <EstateHomePage />
      </div>
      <Footer />
    </div>
  );
}
