import React from "react";
import { useSelector } from "react-redux";
import style from "../../styles/vehiclesCamera.module.scss";

const Button = ({
  title,
  isPlayback = false,
  id,
  params,
  handleShowCamera,
  // setPlayBackSerialNumber,
}) => {
  const { darkMode } = useSelector((state) => state.config);

  return (
    <button
      className={`${style["camera-btn"]}`}
      id={id}
      onClick={() => {
        handleShowCamera(params);
      }}
    >
      <div className={`d-flex gap-2 ${style["button__elements"]}`}>
        <img
          style={{
            width: "12px",
          }}
          src={
            isPlayback
              ? "/assets/images/camera/cameraPlayback.svg"
              : "/assets/images/camera/camera1.svg"
          }
          alt="camera"
        />
        <span style={{ color: "#fff" }}>{title}</span>
      </div>
    </button>
  );
};

export default Button;