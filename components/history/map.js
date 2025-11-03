import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Saferoad } from "../../components/maps/leafletchild";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { setMap } from "../../lib/slices/mainMap";

const Map = () => {
  const L = require("leaflet");
  const dispatch = useDispatch();
  const { myMap } = useSelector((state) => state.mainMap);
  useEffect(() => {
 
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }

    dispatch(
      setMap(
        Saferoad?.map("MyMap", {
          popupSettings: { newvar: true, dontShowPopUp: true },
        })
          .setZoom(7)
          .setView(L.latLng(24.629778, 46.799308))
      )
    );
  }, []);

  return (
    <>
      <div style={{ width: "100%", minHeight: "91vh" }} id="MyMap"></div>
    </>
  );
};

export default Map;
