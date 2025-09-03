import React from "react";
import "./BlueLoader.css";

const DotLoader = ({ color = "#FFFFFF", size = 12 }) => {
  return (
    <div className="three-dots-loader">
      <span style={{ backgroundColor: color, width: size, height: size }}></span>
      <span style={{ backgroundColor: color, width: size, height: size }}></span>
      <span style={{ backgroundColor: color, width: size, height: size }}></span>
    </div>
  );
};

export default DotLoader;
