import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CalculateDistance = ({ routingControl }) => {
  const { myMap } = useSelector((state) => state.mainMap);
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!myMap) return;

    routingControl = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      showAlternatives: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(myMap);
    return () => {
      myMap.removeControl(routingControl);
      routingControl = null;
    };
  }, [myMap]);

  function createButton(label, container) {
    var btn = L.DomUtil.create("button", "", container);
    btn.setAttribute("type", "button");
    btn.className = "btn-primary py-2 px-4 rounded";
    btn.style.height = "fit-content";
    btn.innerHTML = label;
    return btn;
  }

  myMap.on("click", function (e) {
    if (routingControl) {
      var container = L.DomUtil.create("div"),
        startBtn = createButton(t("Start_from_this_location"), container),
        destBtn = createButton(t("Go_to_this_location"), container);
      container.className = "d-flex align-items-end gap-2 p-1";
      container.style.backgroundColor = "rgb(169 163 163)";

      L.popup().setContent(container).setLatLng(e.latlng).openOn(myMap);

      L.DomEvent.on(startBtn, "click", function () {
        myMap.closePopup();
        routingControl.spliceWaypoints(0, 1, e.latlng);
      });

      L.DomEvent.on(destBtn, "click", function () {
        myMap.closePopup();
        routingControl.spliceWaypoints(
          routingControl.getWaypoints().length - 1,
          1,
          e.latlng
        );
      });
    }
  });

  return null;
};

export default CalculateDistance;
