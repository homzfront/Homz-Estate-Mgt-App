import React from 'react'
import { Hourglass } from "react-loader-spinner";

const HourGlassLoader = () => {
  return (
    <div className="">
      <Hourglass
        visible={true}
        height="20"
        width="20"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["##006AFF", "##006AFF"]}
      />
    </div>
  );
};

export default HourGlassLoader