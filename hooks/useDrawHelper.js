import { Resources } from "components/maps/Resources";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const useDrawHelper = (fullPathGroup) => {
  const { t } = useTranslation("history");

  const L = require("leaflet");
  const { myMap } = useSelector((state) => state.mainMap);

  const drawInitialVehicle = useCallback(
    (firstStep, locInfo, drawOptions, firstPointDraw = false) => {
      const step = Object.assign({ ...locInfo }, { ...firstStep });
      const { Latitude, Longitude } = step;

      const latlng = Latitude && Longitude && L.latLng(Latitude, Longitude);
      const icon = L.divIcon({
        iconAnchor: [5, 15],
        iconSize: [50, 50],

        html: icons("StartPoint"),
      });

      const marker = L.marker(latlng, {
        icon,
      });

      drawOptions.getAllLocations &&
        firstPointDraw &&
        marker.addTo(fullPathGroup);

      return myMap && myMap?.pin(step);
    },
    [myMap]
  );

  const drawEndPointVehicle = useCallback(
    (lastStep, locInfo, drawOptions, EndPointDraw = false) => {
      const step = Object.assign({ ...locInfo }, { ...lastStep });
      const { Latitude, Longitude } = step;

      const latlng = Latitude && Longitude && L.latLng(Latitude, Longitude);
      const icon = L.divIcon({
        iconAnchor: [5, 15],
        iconSize: [50, 50],

        html: icons("EndPoint"),
      });

      const marker = L.marker(latlng, {
        icon,
      });

      drawOptions.getAllLocations &&
        EndPointDraw &&
        marker.addTo(fullPathGroup);
    },
    [myMap]
  );

  const drawselectedsteps = useCallback(
    (
      workstep,
      apidata,
      locInfo,
      isFromState,
      drawOptions,
      isStepsPath = false
    ) => {
      let steps = apidata?.map((step) =>
        Object.assign({ ...locInfo }, { ...step })
      );

      if (isFromState) drawStepsPath(apidata);
      if (isStepsPath) drawStepsPath(apidata);

      if (drawOptions.allMarkers && apidata?.length) {
        drawStepsMarkers(workstep, apidata, steps, drawOptions);
        drawStepsGuides(steps, drawOptions);
        drawIdleMarkers(workstep, apidata, steps, drawOptions);
        drawStopMarkers(workstep, apidata, steps, drawOptions);
      }
    },
    [
      drawStepsGuides,
      drawStepsMarkers,
      drawStepsPath,
      drawStopMarkers,
      drawIdleMarkers,
    ]
  );

  const drawStepsPath = useCallback(
    (apidata) => {
      const handleSteps = (apidata) =>
        JSON.parse(JSON.stringify(apidata))?.map((ele) => [
          ele.Latitude,
          ele.Longitude,
        ]);
      const latlngs = apidata?.length && handleSteps(apidata);

      latlngs &&
        fullPathGroup &&
        L.polyline(latlngs, { color: "#808080", smoothFactor: 3 }).addTo(
          fullPathGroup
        );
      latlngs && fullPathGroup && myMap.fitBounds(fullPathGroup?.getBounds());
    },
    [L, fullPathGroup, myMap]
  );

  const drawStepsMarkers = useCallback(
    (workstep, apidata, steps, drawOptions) => {
      const MaxMarkers = drawOptions.MaxMarkers || 500;
      let stepMrks = [...steps]
        .sort((a, b) => new Date(b.StepDistance) - new Date(a.StepDistance))
        .filter((x) => x.StepDistance > (drawOptions.MinDistance || 20))
        .slice(0, MaxMarkers);

      stepMrks.concat(
        [...steps].filter((s) => s.VehicleStatus > 1).slice(0, MaxMarkers)
      );

      stepMrks.forEach((step) => {
        let { ID, Latitude, Longitude, VehicleStatus } = step;
        const noIssue = step.VehicleStatus <= 1;
        const facolor =
          step.VehicleStatus == 1
            ? drawOptions?.colorOfMarkers
            : step.VehicleStatus == 2
              ? "black"
              : "maroon";
        const latlng = Latitude && Longitude && L.latLng(Latitude, Longitude);
        const icon = L.divIcon({
          iconAnchor: [5, 15],
          iconSize: noIssue ? null : [20, 20],
          html: icons(drawOptions?.markerIcon, facolor),
        });

        const VStatusToStr = function (VehicleStatus) {
          switch (VehicleStatus) {
            case 600:
            case 5:
              return t("VehicleOffline");
            case 101:
              return t("VehicleOverSpeed");
            case 204:
              return t("VehicleSleeping");
            case 100:
              return t("VehicleOverStreetSpeed");
            case 0:
              return t("VehicleStopped");
            case 1:
              return t("VehicleRunning");
            case 2:
              return t("VehicleIdle");
            default:
              return t("VehicleInvalid");
          }
        };

        function getContent(apidata, LocID) {
          const si = apidata.find((x) => x.ID == LocID);
          const vs = VStatusToStr(si?.VehicleStatus);
          const content = `
                <p style="margin-left: 1rem !important" ><i></i> Display Name : ${si?.DisplayName
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.VehicleStatus
            } pe-1"></i> VehicleStatus : ${vs}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.RecordDateTime
            } pe-1"></i> ${moment(si?.RecordDateTime)
              .utc()
              .local()
              .format("LL hh:mm:ss a")}</p>
                <p style="margin-left: 1rem !important" >${si?.Latitude} , ${si?.Longitude
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Direction
            } pe-1"></i> Direction : ${si?.Direction}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Speed
            } pe-1"></i> ${si?.Speed
            } <span style="font-size: 0.6rem;">KM/h</span></p>
                <p style="margin-right: 1rem !important; margin-left: 1rem !important; margin-bottom: 1rem !important" ><i class="${Resources.Icons?.Address
            } pe-1"></i> ${si?.Address}</p>`;
          return content;
        }

        function onMouseEnter() {
          if (this.getPopup()) return;
          const { LocID, VehicleStatus } = this.options;

          const content = getContent(apidata, LocID);
          if (VehicleStatus > 2) {
            this.bindPopup(content, { className: "popupDanger" }).openPopup();
          } else if (VehicleStatus < 2) {
            this.bindPopup(content, { className: "popupNormal" }).openPopup();
          } else {
            this.bindPopup(content, { className: "popupIdle" }).openPopup();
          }
        }

        const marker =
          workstep &&
          L.marker(latlng, {
            icon,
            LocID: ID,
            VehicleStatus,
          });
        workstep && marker.on("click", onMouseEnter);
        workstep && fullPathGroup && marker.addTo(fullPathGroup);

        // workstep &&
        //   document.getElementById("pause")?.setAttribute("disabled", "true");
      });
    },
    [L, fullPathGroup, icons, t]
  );

  const drawStopMarkers = useCallback(
    (workstep, apidata, steps, drawOptions) => {
      let PrevVech;

      const stepMrks = [...steps]
        .reduce((acc, cur) => {
          if (PrevVech) {
            if (
              cur.Speed !== PrevVech.Speed ||
              cur.VehicleStatus !== PrevVech.VehicleStatus
            ) {
              acc.push(cur);
            }
          } else {
            acc.push(cur);
          }
          PrevVech = cur;
          return acc;
        }, [])
        .filter((x) => x.VehicleStatus === 0);

      stepMrks.forEach((step, i) => {
        if (i === 0) return;
        let { ID, Latitude, Longitude } = step;
        const latlng = Latitude && Longitude && L.latLng(Latitude, Longitude);

        const icon = L.divIcon({
          iconAnchor: [5, 15],
          iconSize: [50, 50],

          html: icons("Stop"),
        });

        const VStatusToStr = function (VehicleStatus) {
          switch (VehicleStatus) {
            case 600:
            case 5:
              return t("VehicleOffline");
            case 101:
              return t("VehicleOverSpeed");
            case 204:
              return t("VehicleSleeping");
            case 100:
              return t("VehicleOverStreetSpeed");
            case 0:
              return t("VehicleStopped");
            case 1:
              return t("VehicleRunning");
            case 2:
              return t("VehicleIdle");
            default:
              return t("VehicleInvalid");
          }
        };

        function getContent(apidata, LocID) {
          const si = apidata.find((x) => x.ID == LocID);
          const vs = VStatusToStr(si?.VehicleStatus);
          const content = `
                <p style="margin-left: 1rem !important" ><i></i> Display Name : ${si?.DisplayName
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.VehicleStatus
            } pe-1"></i> VehicleStatus : ${vs}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.RecordDateTime
            } pe-1"></i> ${moment(si?.RecordDateTime)
              .utc()
              .local()
              .format("LL hh:mm:ss a")}</p>
                <p style="margin-left: 1rem !important" >${si?.Latitude} , ${si?.Longitude
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Direction
            } pe-1"></i> Direction : ${si?.Direction}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Speed
            } pe-1"></i> ${si?.Speed
            } <span style="font-size: 0.6rem;">KM/h</span></p>
                <p style="margin-right: 1rem !important; margin-left: 1rem !important; margin-bottom: 1rem !important" ><i class="${Resources.Icons?.Address
            } pe-1"></i> ${si?.Address}</p>`;
          return content;
        }

        function onMouseEnter() {
          if (this.getPopup()) return;
          const { LocID } = this.options;

          const content = getContent(apidata, LocID);

          this.bindPopup(content, { className: "popupDanger" }).openPopup();
        }

        const marker = L.marker(latlng, {
          icon,
          LocID: ID,
        });

        marker.on("click", onMouseEnter);
        marker.addTo(fullPathGroup);

        // workstep &&
        //   document.getElementById("pause")?.setAttribute("disabled", "true");
      });
    },
    [L, fullPathGroup, icons, t]
  );

  const drawIdleMarkers = useCallback(
    (workstep, apidata, steps, drawOptions) => {
      let PrevVech;

      const stepMrks = [...steps]
        .reduce((acc, cur) => {
          if (PrevVech) {
            if (
              cur.Speed !== PrevVech.Speed &&
              cur.VehicleStatus !== PrevVech.VehicleStatus
            ) {
              acc.push(cur);
            }
          } else {
            acc.push(cur);
          }
          PrevVech = cur;
          return acc;
        }, [])
        .filter((x) => x.VehicleStatus === 2);

      stepMrks.forEach((step, i) => {
        if (i === 0) return;

        let { ID, Latitude, Longitude } = step;

        const latlng = Latitude && Longitude && L.latLng(Latitude, Longitude);
        const icon = L.divIcon({
          iconAnchor: [5, 15],
          iconSize: [50, 50],

          html: icons("Idle"),
        });

        const VStatusToStr = function (VehicleStatus) {
          switch (VehicleStatus) {
            case 600:
            case 5:
              return t("VehicleOffline");
            case 101:
              return t("VehicleOverSpeed");
            case 204:
              return t("VehicleSleeping");
            case 100:
              return t("VehicleOverStreetSpeed");
            case 0:
              return t("VehicleStopped");
            case 1:
              return t("VehicleRunning");
            case 2:
              return t("VehicleIdle");
            default:
              return t("VehicleInvalid");
          }
        };

        function getContent(apidata, LocID) {
          const si = apidata.find((x) => x.ID == LocID);
          const vs = VStatusToStr(si?.VehicleStatus);
          const content = `
                <p style="margin-left: 1rem !important" ><i></i> Display Name : ${si?.DisplayName
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.VehicleStatus
            } pe-1"></i> VehicleStatus : ${vs}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.RecordDateTime
            } pe-1"></i> ${moment(si?.RecordDateTime)
              .utc()
              .local()
              .format("LL hh:mm:ss a")}</p>
                <p style="margin-left: 1rem !important" >${si?.Latitude} , ${si?.Longitude
            }</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Direction
            } pe-1"></i> Direction : ${si?.Direction}</p>
                <p style="margin-left: 1rem !important" ><i class="${Resources.Icons?.Speed
            } pe-1"></i> ${si?.Speed
            } <span style="font-size: 0.6rem;">KM/h</span></p>
                <p style="margin-right: 1rem !important; margin-left: 1rem !important; margin-bottom: 1rem !important" ><i class="${Resources.Icons?.Address
            } pe-1"></i> ${si?.Address}</p>`;
          return content;
        }

        function onMouseEnter() {
          if (this.getPopup()) return;
          const { LocID } = this.options;

          const content = getContent(apidata, LocID);

          this.bindPopup(content, { className: "popupIdle" }).openPopup();
        }

        const marker = L.marker(latlng, {
          icon,
          LocID: ID,
        });

        marker.on("click", onMouseEnter);
        marker.addTo(fullPathGroup);
        // workstep &&
        //   document.getElementById("pause")?.setAttribute("disabled", "true");
      });
    },
    [L, fullPathGroup, icons, t]
  );

  let icons = useCallback((target, currentColor) => {
    const iconsData = {
      RiMapPinAddFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z"></path></g></svg>`,
      RiMapPinFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path></g></svg>`,
      RiMapPinRangeFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M11 17.938A8.001 8.001 0 0 1 12 2a8 8 0 0 1 1 15.938v2.074c3.946.092 7 .723 7 1.488 0 .828-3.582 1.5-8 1.5s-8-.672-8-1.5c0-.765 3.054-1.396 7-1.488v-2.074zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></g></svg>`,
      RiRoadMapFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M16.95 11.95a6.996 6.996 0 0 0 1.858-6.582l2.495-1.07a.5.5 0 0 1 .697.46V19l-7 3-6-3-6.303 2.701a.5.5 0 0 1-.697-.46V7l3.129-1.341a6.993 6.993 0 0 0 1.921 6.29L12 16.9l4.95-4.95zm-1.414-1.414L12 14.07l-3.536-3.535a5 5 0 1 1 7.072 0z"></path></g></svg>`,
      RiMapPin4Fill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M11 17.938A8.001 8.001 0 0 1 12 2a8 8 0 0 1 1 15.938V21h-2v-3.062zM5 22h14v2H5v-2z"></path></g></svg>`,
      RiMapPin5Fill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M17.657 15.657L12 21.314l-5.657-5.657a8 8 0 1 1 11.314 0zM5 22h14v2H5v-2z"></path></g></svg>`,
      FaMapMarker: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>`,
      FaMapMarkerAlt: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>`,
      FaMapSigns: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M507.31 84.69L464 41.37c-6-6-14.14-9.37-22.63-9.37H288V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v16H56c-13.25 0-24 10.75-24 24v80c0 13.25 10.75 24 24 24h385.37c8.49 0 16.62-3.37 22.63-9.37l43.31-43.31c6.25-6.26 6.25-16.38 0-22.63zM224 496c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V384h-64v112zm232-272H288v-32h-64v32H70.63c-8.49 0-16.62 3.37-22.63 9.37L4.69 276.69c-6.25 6.25-6.25 16.38 0 22.63L48 342.63c6 6 14.14 9.37 22.63 9.37H456c13.25 0 24-10.75 24-24v-80c0-13.25-10.75-24-24-24z"></path></svg>`,
      FaMapMarkedAlt: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"></path></svg>`,
      FaLocationArrow: `<svg style="transform: rotate(-45deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path></svg>`,
      BsFillArrowUpCircleFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"></path></svg>`,
      BsArrowUpSquareFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"></path></svg>`,
      FaArrowAltCircleUp: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z"></path></svg>`,
      GoArrowUp: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 10 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 3L0 9h3v4h4V9h3L5 3z"></path></svg>`,
      MdDoubleArrow: `<svg style="transform: rotate(90deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15.5 5H11l5 7-5 7h4.5l5-7z"></path><path d="M8.5 5H4l5 7-5 7h4.5l5-7z"></path></svg>`,
      RiArrowUpFill: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M13 12v8h-2v-8H4l8-8 8 8z"></path></g></svg>`,
      TbArrowBigUpLines: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><desc></desc><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v3h-6v-3z"></path><path d="M9 21h6"></path><path d="M9 18h6"></path></svg>`,
      TiArrowUpThick: `<svg style="transform: rotate(0deg)"; stroke=${currentColor} fill=${currentColor} strokeWidth="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.172l-6.414 6.414c-.781.781-.781 2.047 0 2.828s2.047.781 2.828 0l1.586-1.586v7.242c0 1.104.895 2 2 2 1.104 0 2-.896 2-2v-7.242l1.586 1.586c.391.391.902.586 1.414.586s1.023-.195 1.414-.586c.781-.781.781-2.047 0-2.828l-6.414-6.414z"></path></svg>`,
      Stop: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 72 72" fill="none" xmlns:v="https://vecta.io/nano"><g stroke="#000" stroke-width="2" stroke-miterlimit="10" stroke-linejoin="round"><use xlink:href="#B"/><use xlink:href="#C" stroke-linecap="round"/></g><use xlink:href="#D" fill="#d22f27"/><g stroke-width="2" stroke-miterlimit="10" stroke-linejoin="round"><g stroke="#fff"><use xlink:href="#B"/><use xlink:href="#C" stroke-linecap="round"/></g><use xlink:href="#D" stroke="#000"/></g><defs ><path id="B" d="M44.388 14.73H27.612a1 1 0 0 0-.707.292L15.043 26.884a1 1 0 0 0-.293.707v16.776a1 1 0 0 0 .293.707l11.862 11.862a1 1 0 0 0 .707.293h16.776a1 1 0 0 0 .707-.293l11.862-11.862a1 1 0 0 0 .293-.707V27.591a1 1 0 0 0-.293-.707L45.095 15.022a1 1 0 0 0-.707-.292z"/><path id="C" d="M26.145 33.893c-.205-.797-1.091-1.397-2.153-1.397-1.214 0-2.198.783-2.198 1.75s.984 1.75 2.198 1.75l-.045.006c1.214 0 2.198.784 2.198 1.75s-.984 1.75-2.198 1.75c-1.062 0-1.948-.6-2.153-1.397m7.852-5.606h4m-2 0v7m14.148 0v-7h2.669c.963 0 1.743.78 1.743 1.744s-.78 1.743-1.743 1.743h-2.67m-6.47 3.513a2.5 2.5 0 0 1-2.5-2.5v-2a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 1.768.732 2.5 2.5 0 0 1 .732 1.768v2a2.5 2.5 0 0 1-.732 1.768 2.5 2.5 0 0 1-1.768.732z"/><path id="D" d="M45.941 10.98H26.06a1 1 0 0 0-.707.292l-14.06 14.059a1 1 0 0 0-.292.707V45.92a1 1 0 0 0 .293.707l14.059 14.06a1 1 0 0 0 .707.292h19.88a1 1 0 0 0 .707-.293l14.06-14.059A1 1 0 0 0 61 45.92V26.038a1 1 0 0 0-.293-.707L46.648 11.272a1 1 0 0 0-.707-.292z"/></defs></svg>`,
      Idle: `
      <svg width="50" height="50" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26.1449 33.8931C25.9399 33.0961 25.0539 32.4961 23.9919 32.4961C22.7779 32.4961 21.7939 33.2791 21.7939 34.2461C21.7939 35.2121 22.7779 35.9961 23.9919 35.9961L23.9469 36.0021C25.1609 36.0021 26.1449 36.7861 26.1449 37.7521C26.1449 38.7181 25.1609 39.5021 23.9469 39.5021C22.8849 39.5021 21.9989 38.9021 21.7939 38.1051M29.6459 32.4991H33.6459M31.6459 32.4991V39.4991M45.7939 39.4991V32.4991H48.4629C49.4259 32.4991 50.2059 33.2791 50.2059 34.2431C50.2059 35.2051 49.4259 35.9861 48.4629 35.9861H45.7929M39.3229 39.4991C38.6599 39.4991 38.024 39.2357 37.5552 38.7669C37.0863 38.298 36.8229 37.6621 36.8229 36.9991V34.9991C36.8229 34.3361 37.0863 33.7002 37.5552 33.2313C38.024 32.7625 38.6599 32.4991 39.3229 32.4991C39.6513 32.4991 39.9763 32.5638 40.2797 32.6894C40.583 32.815 40.8586 32.9992 41.0907 33.2313C41.3229 33.4635 41.507 33.7391 41.6326 34.0424C41.7583 34.3457 41.8229 34.6708 41.8229 34.9991V36.9991C41.8229 37.3274 41.7583 37.6525 41.6326 37.9558C41.507 38.2591 41.3229 38.5347 41.0907 38.7669C40.8586 38.999 40.583 39.1832 40.2797 39.3088C39.9763 39.4344 39.6513 39.4991 39.3229 39.4991Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" fill="#C7B300"/>
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.9989 32.368H26.2329V42H22.9989V32.368ZM30.8451 42.112C30.2104 42.112 29.6318 41.944 29.1091 41.608C28.5958 41.272 28.1898 40.8287 27.8911 40.278C27.5924 39.718 27.4431 39.1253 27.4431 38.5C27.4431 37.8373 27.5971 37.2307 27.9051 36.68C28.2224 36.12 28.6424 35.6813 29.1651 35.364C29.6971 35.0467 30.2618 34.888 30.8591 34.888C31.4004 34.888 31.8578 35 32.2311 35.224C32.6138 35.448 32.9218 35.8073 33.1551 36.302V32.774L36.1091 32.34V42H33.1551V40.698C32.7164 41.6407 31.9464 42.112 30.8451 42.112ZM31.7691 39.9C32.1611 39.9 32.4878 39.76 32.7491 39.48C33.0198 39.2 33.1551 38.8733 33.1551 38.5V38.444C33.1551 38.08 33.0151 37.7673 32.7351 37.506C32.4551 37.2353 32.1331 37.1 31.7691 37.1C31.3771 37.1 31.0458 37.24 30.7751 37.52C30.5138 37.7907 30.3831 38.1173 30.3831 38.5C30.3831 38.892 30.5184 39.2233 30.7891 39.494C31.0691 39.7647 31.3958 39.9 31.7691 39.9ZM40.0048 42.112C39.2115 42.112 38.5955 41.8647 38.1568 41.37C37.7275 40.866 37.5128 40.18 37.5128 39.312V32.774L40.4668 32.34V39.102C40.4668 39.3633 40.5275 39.5547 40.6488 39.676C40.7795 39.788 41.0035 39.844 41.3208 39.844C41.5542 39.844 41.7828 39.788 42.0068 39.676L42.1048 41.636C41.4795 41.9533 40.7795 42.112 40.0048 42.112ZM46.4578 42.112C45.6832 42.112 44.9925 41.958 44.3858 41.65C43.7885 41.3327 43.3218 40.9033 42.9858 40.362C42.6498 39.8113 42.4818 39.1907 42.4818 38.5C42.4818 37.7907 42.6545 37.1607 42.9998 36.61C43.3452 36.0593 43.8118 35.6347 44.3998 35.336C44.9878 35.0373 45.6412 34.888 46.3598 34.888C47.0505 34.888 47.6385 35.042 48.1238 35.35C48.6185 35.6487 48.9872 36.0593 49.2298 36.582C49.4725 37.0953 49.5938 37.674 49.5938 38.318C49.5938 38.486 49.5845 38.6073 49.5658 38.682L45.3658 39.228C45.4778 39.5547 45.6598 39.7927 45.9118 39.942C46.1638 40.082 46.4952 40.152 46.9058 40.152C47.5405 40.152 48.2265 39.9887 48.9638 39.662L49.3138 41.538C48.4458 41.9207 47.4938 42.112 46.4578 42.112ZM47.4238 37.464C47.2745 36.876 46.9198 36.582 46.3598 36.582C46.0238 36.582 45.7578 36.708 45.5618 36.96C45.3658 37.212 45.2632 37.5387 45.2538 37.94L47.4238 37.464Z" fill="#000"/>
      </svg>
      `,
      StartPoint: `<svg width="90" height="90" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26.1449 33.8931C25.9399 33.0961 25.0539 32.4961 23.9919 32.4961C22.7779 32.4961 21.7939 33.2791 21.7939 34.2461C21.7939 35.2121 22.7779 35.9961 23.9919 35.9961L23.9469 36.0021C25.1609 36.0021 26.1449 36.7861 26.1449 37.7521C26.1449 38.7181 25.1609 39.5021 23.9469 39.5021C22.8849 39.5021 21.9989 38.9021 21.7939 38.1051M29.6459 32.4991H33.6459M31.6459 32.4991V39.4991M45.7939 39.4991V32.4991H48.4629C49.4259 32.4991 50.2059 33.2791 50.2059 34.2431C50.2059 35.2051 49.4259 35.9861 48.4629 35.9861H45.7929M39.3229 39.4991C38.6599 39.4991 38.024 39.2357 37.5552 38.7669C37.0863 38.298 36.8229 37.6621 36.8229 36.9991V34.9991C36.8229 34.3361 37.0863 33.7002 37.5552 33.2313C38.024 32.7625 38.6599 32.4991 39.3229 32.4991C39.6513 32.4991 39.9763 32.5638 40.2797 32.6894C40.583 32.815 40.8586 32.9992 41.0907 33.2313C41.3229 33.4635 41.507 33.7391 41.6326 34.0424C41.7583 34.3457 41.8229 34.6708 41.8229 34.9991V36.9991C41.8229 37.3274 41.7583 37.6525 41.6326 37.9558C41.507 38.2591 41.3229 38.5347 41.0907 38.7669C40.8586 38.999 40.583 39.1832 40.2797 39.3088C39.9763 39.4344 39.6513 39.4991 39.3229 39.4991Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" fill="#066821"/>
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24.4084 33.7464C24.3686 33.3454 24.1979 33.0339 23.8963 32.8118C23.5947 32.5897 23.1854 32.4787 22.6683 32.4787C22.317 32.4787 22.0204 32.5284 21.7784 32.6278C21.5365 32.724 21.3509 32.8582 21.2216 33.0305C21.0956 33.2029 21.0327 33.3984 21.0327 33.6172C21.026 33.7995 21.0642 33.9586 21.147 34.0945C21.2332 34.2304 21.3509 34.348 21.5 34.4474C21.6491 34.5436 21.8215 34.6281 22.017 34.701C22.2126 34.7706 22.4214 34.8303 22.6435 34.88L23.5582 35.0987C24.0024 35.1982 24.41 35.3307 24.7812 35.4964C25.1525 35.6622 25.474 35.866 25.7457 36.108C26.0175 36.3499 26.228 36.6349 26.3771 36.9631C26.5296 37.2912 26.6075 37.6674 26.6108 38.0916C26.6075 38.7147 26.4484 39.255 26.1335 39.7124C25.822 40.1664 25.3712 40.5194 24.7812 40.7713C24.1946 41.0199 23.487 41.1442 22.6584 41.1442C21.8364 41.1442 21.1205 41.0182 20.5107 40.7663C19.9041 40.5144 19.4302 40.1416 19.0888 39.6477C18.7507 39.1506 18.5734 38.5357 18.5568 37.8033H20.6399C20.6631 38.1446 20.7609 38.4297 20.9332 38.6584C21.1089 38.8838 21.3426 39.0545 21.6342 39.1705C21.9292 39.2831 22.2623 39.3395 22.6335 39.3395C22.9981 39.3395 23.3146 39.2865 23.5831 39.1804C23.8549 39.0743 24.0653 38.9268 24.2145 38.7379C24.3636 38.549 24.4382 38.3319 24.4382 38.0866C24.4382 37.858 24.3703 37.6657 24.2344 37.5099C24.1018 37.3542 23.9063 37.2216 23.6477 37.1122C23.3925 37.0028 23.0793 36.9034 22.7081 36.8139L21.5994 36.5355C20.741 36.3267 20.0632 36.0002 19.5661 35.5561C19.0689 35.112 18.822 34.5137 18.8253 33.7614C18.822 33.1449 18.986 32.6063 19.3175 32.1456C19.6522 31.6849 20.1113 31.3253 20.6946 31.0668C21.2779 30.8082 21.9408 30.679 22.6832 30.679C23.4389 30.679 24.0985 30.8082 24.6619 31.0668C25.2287 31.3253 25.6695 31.6849 25.9844 32.1456C26.2992 32.6063 26.4616 33.1399 26.4716 33.7464H24.4084ZM32.0808 33.3636V34.9545H27.4821V33.3636H32.0808ZM28.5261 31.5341H30.644V38.6534C30.644 38.849 30.6738 39.0014 30.7335 39.1108C30.7931 39.2169 30.876 39.2914 30.9821 39.3345C31.0914 39.3776 31.2174 39.3991 31.3599 39.3991C31.4593 39.3991 31.5588 39.3909 31.6582 39.3743C31.7576 39.3544 31.8339 39.3395 31.8869 39.3295L32.22 40.9055C32.1139 40.9387 31.9648 40.9768 31.7725 41.0199C31.5803 41.0663 31.3467 41.0945 31.0716 41.1044C30.5611 41.1243 30.1137 41.0563 29.7292 40.9006C29.3481 40.7448 29.0514 40.5028 28.8393 40.1747C28.6272 39.8466 28.5228 39.4323 28.5261 38.9318V31.5341ZM35.638 41.1442C35.1507 41.1442 34.7166 41.0597 34.3354 40.8906C33.9542 40.7183 33.6526 40.4647 33.4306 40.13C33.2118 39.7919 33.1025 39.371 33.1025 38.8672C33.1025 38.4429 33.1803 38.0866 33.3361 37.7983C33.4919 37.5099 33.704 37.2779 33.9725 37.1023C34.2409 36.9266 34.5459 36.794 34.8873 36.7045C35.2319 36.6151 35.5932 36.5521 35.9711 36.5156C36.4152 36.4692 36.7731 36.4261 37.0449 36.3864C37.3167 36.3433 37.5139 36.2803 37.6365 36.1974C37.7592 36.1146 37.8205 35.992 37.8205 35.8295V35.7997C37.8205 35.4848 37.7211 35.2412 37.5222 35.0689C37.3266 34.8965 37.0482 34.8104 36.687 34.8104C36.3058 34.8104 36.0025 34.8949 35.7772 35.0639C35.5518 35.2296 35.4026 35.4384 35.3297 35.6903L33.3709 35.5312C33.4703 35.0672 33.6659 34.6662 33.9576 34.3281C34.2492 33.9867 34.6254 33.7249 35.0861 33.5426C35.5501 33.357 36.0871 33.2642 36.6969 33.2642C37.1212 33.2642 37.5272 33.3139 37.915 33.4134C38.306 33.5128 38.6524 33.6669 38.954 33.8757C39.2589 34.0845 39.4992 34.353 39.6749 34.6811C39.8506 35.0059 39.9384 35.3954 39.9384 35.8494V41H37.9299V39.9411H37.8702C37.7476 40.1797 37.5835 40.3902 37.378 40.5724C37.1725 40.7514 36.9256 40.8923 36.6373 40.995C36.3489 41.0945 36.0158 41.1442 35.638 41.1442ZM36.2445 39.6825C36.556 39.6825 36.8311 39.6212 37.0698 39.4986C37.3084 39.3726 37.4957 39.2036 37.6316 38.9915C37.7675 38.7794 37.8354 38.5391 37.8354 38.2706V37.4602C37.7691 37.5033 37.678 37.5431 37.562 37.5795C37.4493 37.6127 37.3217 37.6442 37.1792 37.674C37.0366 37.7005 36.8941 37.7254 36.7516 37.7486C36.6091 37.7685 36.4798 37.7867 36.3638 37.8033C36.1152 37.8397 35.8981 37.8977 35.7125 37.9773C35.5269 38.0568 35.3828 38.1645 35.28 38.3004C35.1773 38.433 35.1259 38.5987 35.1259 38.7976C35.1259 39.0859 35.2303 39.3063 35.4391 39.4588C35.6512 39.608 35.9197 39.6825 36.2445 39.6825ZM41.5815 41V33.3636H43.6348V34.696H43.7143C43.8535 34.2221 44.0872 33.8641 44.4153 33.6222C44.7434 33.3769 45.1213 33.2543 45.5488 33.2543C45.6549 33.2543 45.7692 33.2609 45.8919 33.2741C46.0145 33.2874 46.1222 33.3056 46.215 33.3288V35.2081C46.1156 35.1783 45.978 35.1518 45.8024 35.1286C45.6267 35.1054 45.466 35.0938 45.3201 35.0938C45.0086 35.0938 44.7302 35.1617 44.4849 35.2976C44.243 35.4302 44.0507 35.6158 43.9082 35.8544C43.769 36.093 43.6994 36.3681 43.6994 36.6797V41H41.5815ZM51.7546 33.3636V34.9545H47.1559V33.3636H51.7546ZM48.1999 31.5341H50.3178V38.6534C50.3178 38.849 50.3477 39.0014 50.4073 39.1108C50.467 39.2169 50.5498 39.2914 50.6559 39.3345C50.7653 39.3776 50.8912 39.3991 51.0337 39.3991C51.1332 39.3991 51.2326 39.3909 51.332 39.3743C51.4315 39.3544 51.5077 39.3395 51.5607 39.3295L51.8938 40.9055C51.7878 40.9387 51.6386 40.9768 51.4464 41.0199C51.2541 41.0663 51.0205 41.0945 50.7454 41.1044C50.235 41.1243 49.7875 41.0563 49.4031 40.9006C49.0219 40.7448 48.7253 40.5028 48.5131 40.1747C48.301 39.8466 48.1966 39.4323 48.1999 38.9318V31.5341Z" fill="white"/>
      </svg>
      `,
      EndPoint: `<svg width="90" height="90" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26.1449 33.8931C25.9399 33.0961 25.0539 32.4961 23.9919 32.4961C22.7779 32.4961 21.7939 33.2791 21.7939 34.2461C21.7939 35.2121 22.7779 35.9961 23.9919 35.9961L23.9469 36.0021C25.1609 36.0021 26.1449 36.7861 26.1449 37.7521C26.1449 38.7181 25.1609 39.5021 23.9469 39.5021C22.8849 39.5021 21.9989 38.9021 21.7939 38.1051M29.6459 32.4991H33.6459M31.6459 32.4991V39.4991M45.7939 39.4991V32.4991H48.4629C49.4259 32.4991 50.2059 33.2791 50.2059 34.2431C50.2059 35.2051 49.4259 35.9861 48.4629 35.9861H45.7929M39.3229 39.4991C38.6599 39.4991 38.024 39.2357 37.5552 38.7669C37.0863 38.298 36.8229 37.6621 36.8229 36.9991V34.9991C36.8229 34.3361 37.0863 33.7002 37.5552 33.2313C38.024 32.7625 38.6599 32.4991 39.3229 32.4991C39.6513 32.4991 39.9763 32.5638 40.2797 32.6894C40.583 32.815 40.8586 32.9992 41.0907 33.2313C41.3229 33.4635 41.507 33.7391 41.6326 34.0424C41.7583 34.3457 41.8229 34.6708 41.8229 34.9991V36.9991C41.8229 37.3274 41.7583 37.6525 41.6326 37.9558C41.507 38.2591 41.3229 38.5347 41.0907 38.7669C40.8586 38.999 40.583 39.1832 40.2797 39.3088C39.9763 39.4344 39.6513 39.4991 39.3229 39.4991Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" fill="#C10000"/>
      <path d="M44.388 14.7295H27.612C27.3469 14.7293 27.0927 14.8343 26.905 15.0215L15.043 26.8835C14.8555 27.071 14.7501 27.3253 14.75 27.5905V44.3665C14.7501 44.6317 14.8555 44.886 15.043 45.0735L26.905 56.9355C27.0925 57.1231 27.3468 57.2285 27.612 57.2285H44.388C44.6532 57.2285 44.9075 57.1231 45.095 56.9355L56.957 45.0735C57.1446 44.886 57.2499 44.6317 57.25 44.3665V27.5905C57.2499 27.3253 57.1446 27.071 56.957 26.8835L45.095 15.0215C44.9075 14.834 44.6532 14.7296 44.388 14.7295Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45.941 10.9795H26.06C25.7949 10.9793 25.5406 11.0843 25.353 11.2715L11.293 25.3305C11.1058 25.5182 11.0008 25.7725 11.001 26.0375V45.9195C11.001 46.1847 11.1064 46.439 11.294 46.6265L25.353 60.6865C25.5406 60.8737 25.7949 60.9787 26.06 60.9785H45.94C46.2052 60.9785 46.4595 60.8731 46.647 60.6855L60.707 46.6265C60.8945 46.439 60.9999 46.1847 61 45.9195V26.0375C60.9999 25.7723 60.8945 25.518 60.707 25.3305L46.648 11.2715C46.4605 11.084 46.2062 10.9796 45.941 10.9795Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23.8849 42V31.8182H30.7457V33.593H26.0376V36.0192H30.3928V37.794H26.0376V40.2251H30.7656V42H23.8849ZM34.5353 37.5852V42H32.4174V34.3636H34.4359V35.7109H34.5254C34.6944 35.2668 34.9778 34.9155 35.3755 34.657C35.7733 34.3951 36.2555 34.2642 36.8223 34.2642C37.3526 34.2642 37.8149 34.3802 38.2093 34.6122C38.6038 34.8442 38.9103 35.1757 39.1291 35.6065C39.3478 36.0341 39.4572 36.5445 39.4572 37.1378V42H37.3393V37.5156C37.3426 37.0483 37.2233 36.6837 36.9814 36.4219C36.7394 36.1567 36.4063 36.0241 35.9821 36.0241C35.697 36.0241 35.4451 36.0855 35.2264 36.2081C35.0109 36.3307 34.8419 36.5097 34.7193 36.745C34.6 36.977 34.5386 37.2571 34.5353 37.5852ZM43.9403 42.1243C43.3603 42.1243 42.835 41.9751 42.3643 41.6768C41.897 41.3752 41.5258 40.9328 41.2507 40.3494C40.9789 39.7628 40.843 39.0436 40.843 38.1918C40.843 37.3168 40.9839 36.5893 41.2656 36.0092C41.5473 35.4259 41.9219 34.9901 42.3892 34.7017C42.8598 34.41 43.3752 34.2642 43.9354 34.2642C44.3629 34.2642 44.7192 34.3371 45.0043 34.483C45.2926 34.6255 45.5246 34.8045 45.7003 35.0199C45.8793 35.232 46.0152 35.4408 46.108 35.6463H46.1726V31.8182H48.2855V42H46.1974V40.777H46.108C46.0085 40.9891 45.8677 41.1996 45.6854 41.4084C45.5064 41.6139 45.2727 41.7846 44.9844 41.9205C44.6993 42.0563 44.3513 42.1243 43.9403 42.1243ZM44.6115 40.4389C44.9529 40.4389 45.2412 40.3461 45.4766 40.1605C45.7152 39.9716 45.8975 39.7081 46.0234 39.37C46.1527 39.032 46.2173 38.6359 46.2173 38.1818C46.2173 37.7277 46.1544 37.3333 46.0284 36.9986C45.9025 36.6638 45.7202 36.4053 45.4815 36.223C45.2429 36.0407 44.9529 35.9496 44.6115 35.9496C44.2635 35.9496 43.9702 36.044 43.7315 36.233C43.4929 36.4219 43.3123 36.6837 43.1896 37.0185C43.067 37.3532 43.0057 37.741 43.0057 38.1818C43.0057 38.6259 43.067 39.0187 43.1896 39.3601C43.3156 39.6982 43.4962 39.9633 43.7315 40.1555C43.9702 40.3445 44.2635 40.4389 44.6115 40.4389Z" fill="white"/>
      </svg>
      
      `,
    };
    return iconsData[target];
  }, []);

  const drawStepsGuides = useCallback(
    (steps, drawOptions) => {
      // get the center between two points
      const getCenter = (s1, s2) =>
        L.point(
          (s1.Latitude + s2.Latitude) / 2,
          (s1.Longitude + s2.Longitude) / 2
        );

      // get real direction for vehicle
      const getAngle = (s1, s2) => {
        const rotation =
          Math.atan2(s1.Longitude - s2.Longitude, s1.Latitude - s2.Latitude) *
          (180 / Math.PI);
        return rotation >= 0 ? rotation : 360 + rotation;
      };

      let stepGuides = [...steps].map(
        ({ Latitude, Longitude, StepDistance }) => ({
          Latitude,
          Longitude,
          StepDistance,
        })
      );
      for (let i = 0; i < stepGuides?.length - 1; i++) {
        const cv = stepGuides[i + 1];
        const pv = stepGuides[i];
        var center = getCenter(cv, pv);
        var rotation = getAngle(cv, pv);
        stepGuides[i + 1] = {
          ...cv,
          latlng: L.latLng(center.x, center.y),
          rotation,
        };
      }
      stepGuides.shift();
      stepGuides = stepGuides
        .sort((a, b) => new Date(b.StepDistance) - new Date(a.StepDistance))
        .filter((x) => x.StepDistance > (drawOptions.MinDistance || 20))
        .slice(0, drawOptions?.MaxGuides || 500);
      stepGuides.forEach((step) => {
        const icon = L.divIcon({
          iconAnchor: [5, 15],
          iconSize: null,
          html: icons(drawOptions?.guidesIcon, drawOptions?.colorOfGuides),
        });

        const marker =
          step &&
          L.marker(step.latlng, {
            icon,
            pvID: step.pvID,
            cvID: step.cvID,
          });
        step && marker.setRotationAngle(step.rotation);
        step && fullPathGroup && marker.addTo(fullPathGroup);
      });
    },
    [L, fullPathGroup, icons]
  );

  return {
    drawInitialVehicle,
    drawselectedsteps,
    drawEndPointVehicle,
    drawStepsPath,
    drawStepsMarkers,
    drawStepsGuides,
  };
};

export default useDrawHelper;
