import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "node_modules/leaflet-geosearch/dist/geosearch.css";
import { Saferoad } from "./leafletchild";
import { useDispatch, useSelector } from "react-redux";
import { setMap } from "../../lib/slices/mainMap";
import { removeMarkers, toggle } from "../../lib/slices/geoSearch";
import { MapContainer } from "react-leaflet";
import {
  GeoSearchControl,
  OpenStreetMapProvider,
  GoogleProvider,
} from "leaflet-geosearch";

function LeafletgeoSearch(myMap) {
  const dispatch = useDispatch();
  const map = myMap;

  useEffect(() => {
    const osm_provider = new OpenStreetMapProvider();
    const google_provider = new GoogleProvider({
      apiKey: "AIzaSyA6MAm8eIW4N0WKJ6yco_pUuO0qiWvqj-Y",
    });

    const searchControl = new GeoSearchControl({
      provider: google_provider,
      autoComplete: true,
      autoClose: true,
      // keepResult: true,
      style: "bar",
    });

    map.myMap.addControl(searchControl);
    dispatch(removeMarkers(searchControl));
    document.querySelector(".reset").addEventListener("click", () => {
      dispatch(toggle());
    });
    return () => map.myMap.removeControl(searchControl);
  }, []);

  return null;
}

const Map = ({ myMap, height = "93.8vh" }) => {
  const geoSearch = useSelector((state) => state.geoSearch.show);
  const L = require("leaflet");
  const dispatch = useDispatch();

  // set the initial map in first render
  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {}

    dispatch(
      setMap(
        Saferoad?.map("MyTrakMap", {
          popupSettings: { dontShowPopUp: true },
        })
          .setZoom(7)
          .setView(L.latLng(24.629778, 46.799308))
      )
    );
  }, []);

  return (
    <>
      {/* <div style={{ width: "100%", minHeight: "91vh" }} ref={map}></div> */}
      <div style={{ width: "100%", minHeight: height }} id="MyTrakMap">
        <MapContainer>
          {geoSearch ? <LeafletgeoSearch myMap={myMap} /> : null}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
