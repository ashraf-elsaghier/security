import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";

const VideoPlaybackPlayer = ({ urls }) => {
  useEffect(() => {
    const initPlayer = async () => {
      if (typeof Cmsv6Player !== "undefined") {
        urls.forEach((url, index) => {
          const options = {
            domId: `cmsv6flash-${index}`,
            isVodMode: true,
            width: 1.8 * 400,
            height: 400,
            lang: "en",
          };
          const player = new Cmsv6Player(options);
          player.setServerInfo("212.118.117.60", 6605);
          player
            .getObjectById(`cmsv6flash-${index}`)
            .startVod(0, url.PlaybackUrl);
        });
      }
    };
    const script = document.createElement("script");
    script.src = "/js/cmsv6player.min.js";
    script.onload = initPlayer;
    script.onerror = (error) => {
      console.error("Error loading script:", error);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [urls]);

  return (
    <>
      {urls?.map((url, index) => (
        <div
          key={`player-${index}`}
          className="d-flex align-items-start justify-content-between w-100 mb-3"
        >
          <div id={`cmsv6flash-${index}`}></div>
          <div className="flex-shrink-0">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <p className="w-fit d-block font-weight-bold">
                {url?.Date?.toString()}
              </p>
              <Button
                onClick={() => window.open(url.DownUrl)}
                variant={"outline"}
              >
                <IoMdDownload />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VideoPlaybackPlayer;
