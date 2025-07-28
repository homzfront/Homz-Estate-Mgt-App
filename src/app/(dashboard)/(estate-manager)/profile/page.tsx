"use client";
import React from "react";
import Widget from "./components/widget";
import WidgetMobile from "./components/widgetMobile";

const Profile = () => {

  return (
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
  );
};

export default Profile;
