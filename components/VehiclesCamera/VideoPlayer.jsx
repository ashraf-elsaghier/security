import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ deviceId, channel, jsession }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let lastTap = 0;

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const hlsUrl = `http://212.118.117.60:6604/hls/1_${deviceId}_${
        channel - 1
      }_${1}.m3u8?jsession=${jsession}`;
      setIsLoading(true);
      setError(null);

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play();
        });
        video.addEventListener("error", () => {
          setError("Error loading the video.");
          setIsLoading(false);
        });
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error(`HLS error: ${data.type}`, data);
            setError("Error loading the video.");
            setIsLoading(false);
          }
        });

        return () => {
          hls.destroy();
        };
      } else {
        setError("Please use a modern browser to play the video.");
        setIsLoading(false);
      }
    }
  }, [channel, deviceId, jsession]);

  const handleDoubleTap = () => {
    const now = new Date().getTime();
    const timeSince = now - lastTap;

    if (timeSince < 300 && timeSince > 0) {
      enterFullscreen(videoRef.current);
    }
    lastTap = now;
  };

  const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen({ navigationUI: "hide" });
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen({ navigationUI: "hide" });
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen({ navigationUI: "hide" });
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen({ navigationUI: "hide" });
    }
  };

  return (
    <div className="video-player">
      <div
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "8px",
        }}
      >
        <p>
          <span style={{ color: "red", marginRight: "5px" }}>●</span>
          Ch{channel}
        </p>
        <small className="text-muted">{deviceId}</small>
      </div>

      {isLoading && (
        <div
          className="spinner-container"
          style={{
            width: "100%",
            height: "100%",
            minHeight: "200px",
            maxHeight: "45vh",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={spinnerStyle}></div>
        </div>
      )}

      {error && (
        <div
          style={{
            width: "100%",
            minHeight: "200px",
            maxHeight: "45vh",
            backgroundColor: "black",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <video
        ref={videoRef}
        onClick={handleDoubleTap}
        poster="https://wallpaperaccess.com/full/3458155.jpg"
        style={{
          width: "100%",
          maxHeight: "45vh",
          objectFit: "contain",
          display: isLoading || error ? "none" : "block",
        }}
      ></video>
    </div>
  );
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "4px solid #ccc",
  borderTop: "4px solid #333",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export default VideoPlayer;
