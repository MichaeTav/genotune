import React from "react";

const Header = ({ score, iteration, generating }) => {
  return (
    <div className="header">
      <h1>GenoTune</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3>Current Score: {score}</h3>
        {generating && <h3>Iteration: {iteration}</h3>}
        <h3>Hi</h3>
      </div>
    </div>
  );
};

export default Header;
