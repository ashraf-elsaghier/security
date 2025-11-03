import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaCogs,
  FaInfoCircle,
  FaRoute,
  FaBell,
  FaChartBar,
  FaHistory,
  FaUsers,
  FaTruck,
} from "react-icons/fa";
import CommandModal from "./CommandModal";

export default function MapView({ devices, jsession }) {
  const [locations, setLocations] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const redDotIcon = new L.Icon({
    iconUrl:
      "https://th.bing.com/th/id/R.e7f1336bc8acb0994878e811aad6cf91?rik=yp1ewg64euvIaA&riu=http%3a%2f%2fclipart-library.com%2fimg1%2f1036648.png&ehk=FBwKLIiOscPaQsiNDjAfqBQ7c1IPxDkoE6KflJiPu%2bg%3d&risl=&pid=ImgRaw&r=0",
    iconSize: [25, 25],
    iconAnchor: [10, 10],
  });

  const fetchDeviceLocations = async () => {
    try {
      const response = await fetch(
        `http://212.118.117.60/StandardApiAction_vehicleStatus.action?jsession=${jsession}&vehiIdno=${devices.join(
          ","
        )}&toMap=2&geoaddress=0`
      );
      const data = await response.json();

      if (data.result === 0 && data.infos) {
        setLocations(
          data.infos.map((device) => ({
            id: device.vi,
            lat: parseFloat(device.mlat),
            lng: parseFloat(device.mlng),
          }))
        );
      } else {
        console.error(
          "Error fetching device locations or no data available:",
          data
        );
      }
    } catch (error) {
      console.error("Failed to fetch device locations:", error);
    }
  };

  useEffect(() => {
    if (jsession) {
      fetchDeviceLocations();
      const intervalId = setInterval(fetchDeviceLocations, 120000);
      return () => clearInterval(intervalId);
    }
  }, [jsession]);

  const handleIconClick = (label) => {
    toast.info(`${label} is under development.`);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "green",
        width: "100%",
        height: "60vh",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[24.629778, 46.799308]}
        zoom={6}
        style={{
          width: "100%",
          height: "100%",
        }}
        id="MyHomeMap"
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={redDotIcon}
          >
            <Popup className="rounded " closeButton={false}>
              <div className="bg-white p-1 rounded">
                <h6 className="bg-primary text-white p-2 rounded">{`Device: ${location.id}`}</h6>
                <p className="fs-5">{`Latitude: ${location.lat}`}</p>
                <p className="fs-5">{`Longitude: ${location.lng}`}</p>
                <button
                  className="btn btn-primary fs-5 py-2 w-100 mt-2"
                  onClick={() => {
                    setSelectedDevice(location);
                    setModalShow(true);
                  }}
                >
                  Send Command
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "15px",
            zIndex: 1000,
          }}
        >
          {[
            { icon: <FaMapMarkerAlt size={20} />, label: "GeoFence" },
            { icon: <FaSearch size={20} />, label: "Search" },
            { icon: <FaRoute size={20} />, label: "Control" },
            { icon: <FaCogs size={20} />, label: "Settings" },
            { icon: <FaInfoCircle size={20} />, label: "Info" },
            { icon: <FaBell size={20} />, label: "Alerts" },
            { icon: <FaChartBar size={20} />, label: "Reports" },
            { icon: <FaHistory size={20} />, label: "History" },
            { icon: <FaUsers size={20} />, label: "Users" },
            { icon: <FaTruck size={20} />, label: "Fleet" },
          ].map((btn, index) => (
            <button
              key={index}
              className="btn btn-primary d-flex justify-content-center align-items-center fs-5 p-2 rounded"
              onClick={() => handleIconClick(btn.label)}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </MapContainer>
      <CommandModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        device={selectedDevice}
      />
    </div>
  );
}
