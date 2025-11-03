import React from "react";
import { AiOutlineCamera } from "react-icons/ai";
import VideoPlaybackPlayer from "./VideoPlaybackPlayer";

const CameraPlaybackScreens = ({ urls }) => {
  return (
    <div className="px-5 h-100">
      {urls.length > 0 ? (
        <>
          <VideoPlaybackPlayer urls={urls} />
        </>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center col-span-2 h-100">
          <AiOutlineCamera className="display-1 text-secondary mb-4" />
          <p className="text-secondary">
            No camera selected. Please select a camera to load data.
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraPlaybackScreens;
