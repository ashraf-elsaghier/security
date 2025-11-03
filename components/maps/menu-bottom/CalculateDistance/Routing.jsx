import { useEffect } from "react";
// import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useSelector } from "react-redux";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

export default function Routing({ routingControl }) {
  const { myMap } = useSelector((state) => state.mainMap);
  const L = require("leaflet");

  useEffect(() => {
    if (!myMap) return;

    routingControl = L.Routing.control({
      waypoints: [L.latLng(20, 46), L.latLng(24.629778, 46.799308)],
      routeWhileDragging: true,
    }).addTo(myMap);

    return () => myMap.removeControl(routingControl);
  }, [myMap]);

  return null;
}
