import React from "react";
import UseDarkmode from "hooks/UseDarkmode";

const EmptyMess = ({ msg }) => {
  return (
    <>
      <div
        style={{
          height: "245px",
          color: UseDarkmode("rgb(235 235 235)" , "#585858"),
        }}
        className="d-flex  align-items-center justify-content-center fs-4"
      >
        {msg}
      </div>
    </>
  );
};
export default EmptyMess;
