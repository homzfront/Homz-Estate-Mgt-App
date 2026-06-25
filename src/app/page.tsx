import React from "react";
import EstateHomePage from "./estate-management/page";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GetAppBanner from "@/components/layout/GetAppBanner";
import FloatingGetAppButton from "@/components/layout/FloatingGetAppButton";
export default function Home() {
  return (
    <div className="m-auto max-w-[1728px]">
      <Header />
      <div>
        <EstateHomePage />
      </div>
      <GetAppBanner />
      <Footer />
      <FloatingGetAppButton />
    </div>
  );
}