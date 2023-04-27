import React from "react";
import { Oval } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: "1" }}>
      <Oval
        ariaLabel="loading-indicator"
        height={60}
        width={60}
        strokeWidth={5}
        strokeWidthSecondary={3}
        color="white"
        secondaryColor="black"
      />
      
    </div>
  );
};

export default Spinner;
