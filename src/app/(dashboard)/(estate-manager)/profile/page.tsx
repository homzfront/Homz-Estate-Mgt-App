"use client";
import React, { Suspense } from "react";
import Widget from "./components/widget";
import WidgetMobile from "./components/widgetMobile";

const Profile = () => {

  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <div className="p-8 w-full">
        <p className="font-[500] text-[20px] text-GrayHomz">Profile</p>
        <div>
          <div className="hidden md:block">
            <Widget />
          </div>
          <div className="md:hidden">
            <WidgetMobile />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Profile;
