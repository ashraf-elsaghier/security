import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";
import "leaflet.heat";

import { toast } from "react-toastify";
import axios from "axios";
import { Saferoad } from "./leafletchild";

const Map = ({ id }) => {
  const ZOOM = 12;
  const [heatMap, setHeatMap] = useState([]);
  const [center, setCenter] = useState();
  const [myMap, setMyMap] = useState();

  const L = require("leaflet");
  require("helpers/plugins/leaflet-heat-map");

  const DrawHeatMap = (data) => {
    L.heatLayer(data, {
      gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
      minOpacity: 0.5,
      maxZoom: 25,
      radius: 25,
      blur: 15,
      max: 1.0,
    }).addTo(myMap);
  };
  // load heat map data
  useEffect(() => {
    const controller = new AbortController();
    const handleViewVehiclesHeatMap = async () => {
      if (heatMap.length > 0) {
        DrawHeatMap(heatMap);
      } else {
        try {
          const { data } = await axios.get(
            `/dashboard/driverVehicles/driver/heatmap/${id}`,
            { signal: controller.signal }
          );
          const records = [];
          data?.heatMap.forEach((record) => {
            records.push([record.Latitude, record.Longitude]);
          });
          if (records?.length) {
            DrawHeatMap(records);
            setHeatMap(records);
            // get the center of heat map
            const latLngs = records.map((rec) => L.latLng(rec));
            const bounds = L.latLngBounds(latLngs);
            setCenter(bounds.getCenter());
            myMap.flyTo(bounds.getCenter(), records.length > 4000 ? 7 : ZOOM);
          }
          !records.length && toast.warning("There are no data for now.");
        } catch (err) {
          toast.error(err?.response?.data?.message);
        }
      }
    };
    if (id && myMap !== undefined) handleViewVehiclesHeatMap();

    return () => controller.abort();
  }, [L, myMap, id]);

  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }

    let map = L.map("heat-map")
      .setZoom(heatMap.length > 4000 ? 7 : ZOOM)
      .setView(L.latLng(center || 24.629778, 46.799308));

    L.gridLayer
      .googleMutant({
        type: "roadmap",
        styles: [{ featureType: "water", stylers: [{ color: "#42ABC0" }] }],
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      })
      .addTo(map);
    setMyMap(map);
  }, [L, Saferoad]);

  return (
    <>
      <div style={{ width: "100%", height: "445px" }} id="heat-map">
        <MapContainer></MapContainer>
      </div>
    </>
  );
};

export default Map;
