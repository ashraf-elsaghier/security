import React, { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import VideoPlayer from "./VideoPlayer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "components/UI/Spinner";

const CameraScreens = ({ serial, setShow }) => {
  const [activeCameras, setActiveCameras] = useState([]);
  const [jsession, setJsession] = useState("");
  const [loading, setLoading] = useState(true);

  async function getVehInfo(jsession, serial) {
    const url = `http://212.118.117.60/StandardApiAction_queryUserVehicle.action?jsession=${jsession}&language=en`;
    const response = await fetch(url);
    const json = await response.json();

    let devIdno = "";
    let maxChannels = 0;
    let cameras = [];

    if (json.result === 0) {
      json.vehicles.forEach((vehicle) => {
        vehicle.dl.forEach((dlEntry) => {
          if (dlEntry.id === serial) {
            devIdno = vehicle.nm;
            maxChannels = vehicle.chnCount;
            for (let i = 0; i < maxChannels; i++) {
              cameras.push({
                id: `${i + 1}`,
                name: `Camera ${i + 1}`,
                DevIDNO: devIdno,
                ch: i,
              });
            }
          }
        });
      });
    }

    return { devIdno, maxChannels, cameras };
  }

  async function login() {
    try {
      const res = await fetch(
        `http://212.118.117.60/StandardApiAction_login.action?account=admin&password=Saferoad@2025`,
        {
          method: "POST",
        }
      );
      if (!res.ok) {
        throw new Error("Error occurred during login");
      }
      const data = await res.json();
      if (data.result === 1) {
        throw new Error("Invalid credentials");
      } else {
        setJsession(data.jsession);
        const { cameras } = await getVehInfo(data.jsession, serial);
        if (cameras.length === 0) {
          throw new Error("No cameras found for the selected device");
        }
        setActiveCameras(cameras);
      }
    } catch (error) {
      console.error("Error during login or fetching camera data:", error);
      toast.error(error.message || "An unexpected error occurred");
      setShow(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    login();
  }, []);

  return (
    <div className="px-4 py-3">
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Spinner />
        </div>
      ) : activeCameras.length > 0 ? (
        <div className="d-flex   flex-column flex-wrap justify-content-center align-items-start">
          {activeCameras.map((c) => (
            <div key={c.id} className="m-3">
              <VideoPlayer
                deviceId={c.DevIDNO}
                channel={c.ch}
                jsession={jsession}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <AiOutlineCamera
            className="text-secondary"
            style={{ fontSize: "4rem", marginBottom: "1rem" }}
          />
          <p className="text-muted">
            No camera selected. Please select a camera to load data.
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraScreens;
