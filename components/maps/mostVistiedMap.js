import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";

import { toast } from "react-toastify";
import axios from "axios";
import { Saferoad } from "./leafletchild";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

function getBounds(latLngs) {
  if (latLngs.length === 0) {
    return null; // Return null if the array is empty
  }

  // Initialize with the first latLng point
  let minLat = latLngs[0][0];
  let maxLat = latLngs[0][0];
  let minLng = latLngs[0][1];
  let maxLng = latLngs[0][1];

  // Find the minimum and maximum latitudes and longitudes
  for (let i = 1; i < latLngs.length; i++) {
    const lat = latLngs[i][0];
    const lng = latLngs[i][1];
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  // Create a bounds object
  const bounds = {
    southWest: [minLat, minLng],
    northEast: [maxLat, maxLng],
  };

  return bounds;
}

function getCenter(bounds) {
  if (bounds === null) {
    return null; // Return null if the bounds are not defined
  }

  const lat = (bounds.southWest[0] + bounds.northEast[0]) / 2;
  const lng = (bounds.southWest[1] + bounds.northEast[1]) / 2;

  return [lat, lng];
}
const MostVisited = ({ idd }) => {
  const ZOOM = 12;
  const [MostVisited, setMostVisited] = useState([]);
  const [center, setCenter] = useState();
  const [myMap, setmyMap] = useState();

  const L = require("leaflet");

  useEffect(() => {
    const handleViewVehiclesMostVisited = async () => {
      if (MostVisited.length > 0) {
        MostVisited.forEach((record) => {
          L.marker(record).addTo(myMap);
        });
      } else {
        try {
          const { data } = await axios.get(
            `/dashboard/driverVehicles/driver/mostVisit/${idd}`
          );
          const records = [];
          data?.mostVisited.forEach((record) => {
            records.push([record._id.lat, record._id.long]);
          });
          if (records?.length) {
            setMostVisited(records);
            // get the center of heat map
          }
          !records.length && toast.warning("There are no data for now.");
        } catch (err) {
          toast.error(err?.response?.data?.message);
        }
      }
    };
    if (idd) handleViewVehiclesMostVisited();
  }, [L, idd]);
  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }

    var mapa = L.map("map-mostVisited-id")
      .setZoom(MostVisited.length > 4000 ? 7 : ZOOM)
      .setView(L.latLng(center || 24.629778, 46.799308));

    MostVisited.forEach((record) => {
      L.marker(record).addTo(mapa);
    });
    if (MostVisited.length > 1) {
      const bounds = getBounds(MostVisited);
      setCenter(getCenter(bounds));
      //its equal null for the first time
      const BestZoom =
        bounds?.northEast[0] &&
        mapa.getBoundsZoom(
          L.latLngBounds(bounds?.northEast, bounds?.southWest)
        );
      const tempCenter = getCenter(bounds);
      if (tempCenter && tempCenter[0])
        mapa.flyTo(
          L.latLng(getCenter(bounds)),
          MostVisited.length > 4000 ? 7 : BestZoom
        );
    } else if (MostVisited.length == 1) {
      mapa.flyTo(L.latLng(MostVisited[0]), 12);
    }
    L.gridLayer
      .googleMutant({
        type: "roadmap", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        styles: [{ featureType: "water", stylers: [{ color: "#42ABC0" }] }],
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      })
      .addTo(mapa);
    setmyMap(mapa);
  }, [L, Saferoad, MostVisited]);

  return (
    <>
      <div style={{ width: "100%", height: "445px" }} id="map-mostVisited-id">
        <MapContainer></MapContainer>
      </div>
    </>
  );
};

export default MostVisited;
