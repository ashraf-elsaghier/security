import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import style from "styles/Reports.module.scss";
import { toast } from "react-toastify";
import SideBarReports from "components/Reports/sideBar";
import TableTaps from "components/Reports/TableTaps";
import UseDarkmode from "hooks/UseDarkmode";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import moment from "moment";
import Model from "components/UI/Model";
import UseTableColumns from "hooks/UseTableColumns";
import { encryptName } from "helpers/encryptions";
import Spinner from "components/UI/Spinner";
import { validateEmail } from "helpers/helpers";
import ReportsOptions from "components/Reports/ReportsOptions";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
const ReportsContent = ({
  dataSideBar,
  treeData,
  setTreeData,
  fromSupport = false,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["Tour", "reports"]);
  const [controller, setController] = useState(new AbortController());
  const updateController = useRef(new AbortController());

  const [manuelclose, setManuelclose] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const version5 = false;
  const [Data_table, setData_table] = useState([]);
  const [reportApi, setReportApi] = useState("");
  const [vehChecked, setVehChecked] = useState([]);
  const [loadingFromDashboard, setLoadingFromDashboard] = useState(false);
  const [reportsOptionsShow, setReportsOptionsShow] = useState(false);
  const [showCurrentActiveReportOptions, setShowCurrentActiveReportOptions] =
    useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [accounts, setAccounts] = useState([]);

  const [emailPopup, setEmailPopup] = useState(false);

  const [popupData, setPopupData] = useState();

  const [vechLoading, setVechLoading] = useState(false);

  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();

  const [email, setEmail] = useState("");
  const { isFromDashboard, reportName } = useSelector(
    (stat) => stat.dashboardReports
  );
  const darkMode = useSelector((state) => state.config.darkMode);

  useEffect(() => {
    if (isFromDashboard) {
      setLoadingFromDashboard(true);
      setDateStatus("two");
    }
  }, []);

  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["reports"],
  });

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (index === 11 && action === ACTIONS.PREV) {
        setToggleMinuTrack((prev) => !prev);
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  const [fullSelectedReportData, setFullSelectedReportData] = useState({
    name: "",
    api: "",
    pagination: "",
    startDate: "",
    endDate: "",
    minimumSpeed: 0,
    speedDurationOver: 0,
    fuelData: null,
    overSpeed: 0,
    tripDuration: false,
    data: [],
    geoId: "",
  });

  const [reportsTitleSelectedId, setReportsTitleSelectedId] = useState(0);
  const [reportsDataSelected, setReportsDataSelected] = useState([]);
  const [reportsTitleSelected, setReportsTitleSelected] = useState("");
  const [dateStatus, setDateStatus] = useState(
    isFromDashboard && reportName === "Over_Speed_Report_key" ? "two" : ""
  );
  const [loadingShowReport, setLoadingShowReport] = useState(false);
  const [loadingShowCurrentReport, setLoadingShowCurrentReport] =
    useState(false);
  const [closeAndOpenReportsList, setCloseAndOpenReportsList] = useState(true);

  const [vehiclesError, setVehiclesError] = useState("");

  const [geofencesOptions, setGeofencesOptions] = useState([]);

  const TableColumns = UseTableColumns();

  const [mainApi, setMainApi] = useState([]);
  const [paginationSize, setPaginationSize] = useState(10);

  const resources = {
    en: {
      translation: require("../../public/locales/en/reports.json"),
    },
  };
  useEffect(() => {
    if (reportsOptionsShow || showCurrentActiveReportOptions) {
      document.querySelector(".btn-close").onclick = () => {
        setReportsOptionsShow(false);
        setVehiclesError(""); // reset setVehiclesError

        setShowCurrentActiveReportOptions(false);
        setManuelclose(true);

        if (controller) {
          controller.abort();
        }
      };
    }
  }, [reportsOptionsShow, showCurrentActiveReportOptions]);

  // Create a new Date object for the current local time

  // Fetch geofences incase of user select geofenc report
  useEffect(() => {
    const fetchgeofences = async () => {
      try {
        const res = await axios.get(`geofences`);

        setGeofencesOptions(
          res?.data?.allGeoFences?.map((geo) => ({
            label: geo?.handledData?.GeofenceName,
            value: geo?.handledData?.ID,
          }))
        );
      } catch (error) {
        toast.error(error?.response?.data?.message || "Somwthing Went Wrong");
      }
    };

    if (reportsOptionsShow && reportsTitleSelected === "Geofences_Log_key") {
      fetchgeofences();
    }
  }, [reportsOptionsShow, reportsTitleSelected]);
  // fetch report data

  const fetchReports = async (
    id,
    api,
    name,
    vehChecked,
    fullSelectedReportData,
    type
  ) => {
    const newController = new AbortController();
    setController(newController);
    const query = new URL(
      `https://${
        name === "last_vehicle_status_key" ? "www.test.com" + api : api
      }`
    ).searchParams;
    const EndDate = query.get("EndDate");
    const strDate = query.get("strDate");
    const fuelPrice = query.get("fuelPrice");
    const speed = query.get("speed");
    const duration = query.get("duration");
    const geoId = query.get("geoId");

    const activeReportApi =
      !fromSupport &&
      (vehChecked?.length === treeData?.length || isFromDashboard)
        ? `${fullSelectedReportData.api}?strDate=${strDate}&EndDate=${EndDate}&duration=${duration}&speed=${speed}&fuelPrice=${fuelPrice}&geoId=${geoId}`
        : api;
    try {
      const response =
        name === "last_vehicle_status_key"
          ? await getLastLocations()
          : name === "Active_Devices_Summary_Key"
          ? await axios.post(
              `dashboard/reports/activeAccountsVehiclesSummary`,
              { EndDate, accounts },
              { signal: controller.signal, timeout: 15000 }
            )
          : await axios.get(`${activeReportApi}`, {
              signal: controller.signal,
              timeout:
                name === "Driving_Statistics_Per_Period_key"
                  ? 0
                  : isFromDashboard
                  ? null
                  : vehChecked?.length > 4000
                  ? 120000
                  : 15000,
            });
      if (response.data.message) {
        toast.warning(t(response.data.message));
      }

      if (response.status === 200 || name === "last_vehicle_status_key") {
        if (
          name === "last_vehicle_status_key" ||
          Object.hasOwn(response.data, "result") ||
          (Object.hasOwn(response.data, "vehicles") &&
            (Array.isArray(response.data?.result) ||
              Array.isArray(response.data?.vehicles)))
        ) {
          let newData = [
            ...Data_table,
            {
              ...fullSelectedReportData,
              id,
              total: 0,
              api,
              name,
              vehChecked,
              dateStatus,
              currentPage: 1,
              data: response.data?.result || response.data?.vehicles,
              geoId: fullSelectedReportData?.geoId,
            },
          ];
          setFullSelectedReportData((prev) => ({
            ...prev,
            api,
          }));

          fullSelectedReportData.pagination &&
            setMainApi((prev) => [...prev, { id, mainApi: api }]);

          setData_table([...newData]);

          return { res: newData };
        } else {
          let newData = [
            ...Data_table,
            {
              ...fullSelectedReportData,
              id,
              total: 0,
              api,
              name,
              vehChecked,
              dateStatus,
              currentPage: 1,
              data: [],
              geoId: "",
            },
          ];

          setFullSelectedReportData((prev) => ({
            ...prev,
            api,
          }));
          fullSelectedReportData.pagination &&
            setMainApi((prev) => [...prev, { id, mainApi: api }]);

          setData_table([...newData]);
          return { res: newData };
        }
      } else {
        toast.error(t(response.data.message));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        if (error?.response?.data) {
          toast.error(
            t(error?.response?.data?.message) || t("Something Went Wrong")
          );
          return;
        }
        setPopupData({ api, tableName: name });
        setEmailPopup(true);
      }
    }
  };

  const GetReportsOnEmail = async () => {
    const reportName = resources.en.translation[popupData.tableName].replaceAll(
      " ",
      "_"
    );
    setLoadingEmail(true);
    setEmailPopup(false);

    const translatedKeys = TableColumns[`${reportName}Column`].map((col) => ({
      [col.field]: col.headerName,
    }));

    axios
      .post("dashboard/reports/downloadExcel", {
        data: {
          url: popupData.api,
          headers: translatedKeys,
          email,
          zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
      .then((res) => {
        setEmail("");
        setLoadingEmail(false);
        toast.success(res?.data?.message);
      })
      .catch((error) => {
        setLoadingEmail(false);
        toast.error(error?.response?.data?.message);
      });
  };

  function toLocalISOString(date) {
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localTime = date.getTime() - timezoneOffset; // Get local time by subtracting the timezone offset
    const localDate = new Date(localTime); // Create a new Date object with the local time
    const isoString = localDate.toISOString(); // Convert the local date to ISO string format
    return isoString;
  }

  const handleApi = (fullSelectedReportData) => {
    const HandleDate = () => {
      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      return {
        year,
        Month: month > 9 ? month : `0${month}`,
        Day: day > 9 ? day : `0${day}`,
      };
    };
    let hisF = `${
      fullSelectedReportData.endDate &&
      fullSelectedReportData.endDate[0].split("T")[0]
    }`; // e.g 2022-07-14
    let dateF = new Date(hisF);
    dateF.setDate(dateF.getDate() + 1);
    // get first date for most reports
    let yearF = HandleDate().year;

    let MonthF = HandleDate().Month;

    let DayF = HandleDate().Day;

    const nowTime = new Date();
    let FDate = isFromDashboard
      ? moment(`${yearF}-${MonthF}-${DayF}T00:00:00`)
          .utc()
          .subtract(6, "days")
          .format("YYYY-MM-DD HH:mm:ss")
      : moment(`${yearF}-${MonthF}-${DayF}T00:00:00`)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");
    let [yearL, MonthL, DayL] = [yearF, MonthF, DayF];

    let LDate = `${yearL}-${MonthL}-${DayL}T${
      nowTime.getUTCHours() < "10"
        ? `0${nowTime.getUTCHours()}`
        : nowTime.getUTCHours()
    }:${
      nowTime.getMinutes() < "10"
        ? `0${nowTime.getMinutes()}`
        : nowTime.getMinutes()
    }:00`;
    if (!version5) {
      LDate = toLocalISOString(new Date(LDate));
      FDate = toLocalISOString(new Date(FDate));
    }
    let strDate = fullSelectedReportData.startDate
      ? fullSelectedReportData.startDate
      : FDate;
    let endDate = fullSelectedReportData.endDate
      ? fullSelectedReportData.endDate
      : LDate;

    if (version5) {
      strDate = toLocalISOString(new Date(strDate));
      endDate = toLocalISOString(new Date(endDate));
    } else {
      strDate = new Date(strDate).toISOString().slice(0, -1);
      endDate = new Date(endDate).toISOString().slice(0, -1);
    }

    const pS = 100000;
    const fuelPrice = fullSelectedReportData?.fuelData;
    const duration = fullSelectedReportData?.tripDuration
      ? fullSelectedReportData?.tripDuration
      : fullSelectedReportData?.speedDurationOver;

    const speed = fullSelectedReportData?.overSpeed
      ? fullSelectedReportData?.overSpeed
      : fullSelectedReportData?.minimumSpeed;

    const apiFirstSlice = `${
      reportApi.length ? reportApi : fullSelectedReportData.api
    }?`;
    const { vehData } =
      JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") || [];
    const vehIds = isFromDashboard
      ? vehData?.map((v) => v?.VehicleID)
      : vehChecked?.map((v) => v?.VehicleID);
    const apiMidSlice =
      fullSelectedReportData.name !== "Active_Devices_Summary_Key"
        ? `strDate=${
            fullSelectedReportData.name === "hours_And_Mileage_Daily_Reports"
              ? new Date(strDate.toString() + "Z").getTime()
              : strDate
          }&EndDate=${
            fullSelectedReportData.name === "hours_And_Mileage_Daily_Reports"
              ? new Date(endDate.toString() + "Z").getTime()
              : endDate
          }&vehIDs=${vehIds ?? ""}&fuelPrice=${fuelPrice}${
            fullSelectedReportData.name === "Geofences_Log_key"
              ? "&geoId=" + fullSelectedReportData.geoId || ""
              : ""
          }`
        : `strDate=${
            fullSelectedReportData.name === "hours_And_Mileage_Daily_Reports"
              ? new Date(strDate.toString() + "Z").getTime()
              : strDate
          }&EndDate=${
            fullSelectedReportData.name === "hours_And_Mileage_Daily_Reports"
              ? new Date(endDate.toString() + "Z").getTime()
              : endDate
          }&accounts=${JSON.stringify(accounts)}`;
    const apiEndSlice = `speed=${speed}&duration=${duration}`;
    return fullSelectedReportData.name !== "Active_Devices_Summary_Key"
      ? `${apiFirstSlice}&${apiMidSlice}&${apiEndSlice}`
      : `${apiFirstSlice}&${apiMidSlice}`;
  };

  function parseGeofencePath(path) {
    return path
      .split("|")
      .filter(Boolean)
      .map((coord) => {
        const [lat, lng] = coord.split(",").map(Number);
        return { lat, lng };
      });
  }

  function isPointInGeofences(vehicleID, pointLat, pointLng, geofences) {
    const results = [];
    for (const geofence of geofences) {
      if (geofence.Vehicles.includes(vehicleID)) {
        let isInside = false;
        if (geofence.GeoFenceType === 1) {
          // Circle geofence
          isInside = isPointInCircle(
            pointLat,
            pointLng,
            geofence.GeofenceCenterPoint.lat,
            geofence.GeofenceCenterPoint.lng,
            geofence.GeofenceRadius
          );
        } else if (geofence.GeoFenceType === 2) {
          // Polygon geofence
          const polygonPath = parseGeofencePath(geofence.GeofencePath);
          isInside = isPointInPolygon(pointLat, pointLng, polygonPath);
        }
        if (pointLat == "N/A" || pointLng == "N/A") {
          results.push({
            geoID: geofence.GeofenceID,
            geoName: geofence.GeofenceName,
            status: "N/A",
          });
        } else {
          results.push({
            geoID: geofence.GeofenceID,
            geoName: geofence.GeofenceName,
            status: isInside ? "in" : "out",
          });
        }
      }
    }
    return results;
  }

  function isPointInCircle(pointLat, pointLng, centerLat, centerLng, radius) {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (angle) => angle * (Math.PI / 180);
    const dLat = toRadians(pointLat - centerLat);
    const dLng = toRadians(pointLng - centerLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(centerLat)) *
        Math.cos(toRadians(pointLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= radius;
  }

  function isPointInPolygon(pointLat, pointLng, polygonPath) {
    let isInside = false;
    const x = pointLng,
      y = pointLat;
    for (
      let i = 0, j = polygonPath.length - 1;
      i < polygonPath.length;
      j = i++
    ) {
      const xi = polygonPath[i].lng,
        yi = polygonPath[i].lat;
      const xj = polygonPath[j].lng,
        yj = polygonPath[j].lat;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  const getLastLocations = async () => {
    try {
      const vehiclesSerials = vehChecked.map((v) => v.SerialNumber);

      const data = {
        serialNumbers: vehiclesSerials,
        lite: 3,
        fields: ["SerialNumber", "Longitude", "Latitude", "RecordDateTime"],
      };
      const geos = await axios.get("/geofences/geoFencesAccWithVhs");

      const vehiclesLatestData = await axios.post(
        "vehicles/lastUpdateBySerials",
        data
      );
      const combinedData = vehChecked.map((vehicle) => {
        const checkedVehicle = vehiclesLatestData.data.find(
          (checked) => checked.SerialNumber == vehicle.SerialNumber
        );
        return checkedVehicle
          ? {
              VehicleID: vehicle.VehicleID,
              PlateNumber: vehicle.PlateNumber,
              DisplayName: vehicle.DisplayName,
              Latitude: checkedVehicle.Latitude,
              Longitude: checkedVehicle.Longitude,
            }
          : {
              VehicleID: vehicle.VehicleID,
              PlateNumber: vehicle.PlateNumber,
              DisplayName: vehicle.DisplayName,
              Latitude: vehicle.Latitude ?? "N/A",
              Longitude: vehicle.Longitude ?? "N/A",
            };
      });
      let finaleResult = [];
      combinedData.forEach((vehicle) => {
        const results = isPointInGeofences(
          vehicle.VehicleID,
          vehicle.Latitude,
          vehicle.Longitude,
          geos.data
        );
        results.forEach((result) =>
          finaleResult.push({ ...vehicle, ...result })
        );
      });
      return { data: { result: finaleResult } };
    } catch (error) {
      console.log(error);
    }
  };
  const ShowReports = async (Show, name, fullSelectedReportData, allveh) => {
    if (Show === "Show") {
      // check if user clicked on the show button
      if (
        name === "last_vehicle_status_key" ||
        vehChecked.length ||
        (accounts.length && name === "Active_Devices_Summary_Key") ||
        isFromDashboard
      ) {
        // check if there is a vehChecked
        setVehiclesError(""); // reset setVehiclesError
        setLoadingShowReport(true); // asign loadingShowReport state to true
        const id = Math.random().toString(32).substring(3);
        const api = handleApi(fullSelectedReportData, dateStatus);
        try {
          let type = name === "last_vehicle_status_key" ? "frontReport" : "";
          const { res } = await fetchReports(
            id,
            api,
            name,
            vehChecked,
            fullSelectedReportData,
            type
          );
          console.log("====================================");
          console.log("====================================");
          console.log(res);
          const lastItem = res.find((tab) => tab.id === id);
          setFullSelectedReportData((prev) => ({
            ...prev,
            id,
            name,

            data: [
              ...prev.data,
              {
                id,
                name,
                api: fullSelectedReportData.api,
                startDate: fullSelectedReportData.startDate,
                endDate: fullSelectedReportData.endDate,
                geoId: fullSelectedReportData.geoId,

                vehChecked,
              },
            ],
          }));
          setReportsTitleSelected(isFromDashboard ? reportName : reportTitle);
          setReportsTitleSelectedId(id);

          setReportsDataSelected(lastItem);
        } catch (error) {
          console.log("====================================");
          console.log(error);
          console.log("====================================");
          if (!manuelclose) {
            // toast.error("Error: " + error?.response?.data?.message);
          }
        } finally {
          setReportsOptionsShow(false);
          setLoadingShowReport(false);
          tourAfterReport2(5);
          setLoadingFromDashboard(false);
        }
      } else if (!accounts.length && name === "Active_Devices_Summary_Key") {
        setVehiclesError("Please Select At Least one Account");
      } else {
        setVehiclesError("Please Select At Least one Vehicle");
      }
    } else if (Show === "updateCurrentActiveReportOptions") {
      updateController.current = {
        id: fullSelectedReportData.id,
        controller: new AbortController(),
      };
      if (vehChecked.length || accounts.length) {
        // check if there is a vehChecked
        setVehiclesError(""); // reset setVehiclesError
        setLoadingShowCurrentReport(reportsDataSelected.id); // asign loadingShowReport state to true
        const api = handleApi(fullSelectedReportData, dateStatus);
        const query = new URL(
          `https://${
            name === "last_vehicle_status_key" ? "www.test.com" + api : api
          }`
        ).searchParams;
        const EndDate = query.get("EndDate");
        const strDate = query.get("strDate");
        const fuelPrice = query.get("fuelPrice");
        const speed = query.get("speed");
        const duration = query.get("duration");

        const vech =
          vehChecked?.length === treeData?.length || isFromDashboard
            ? `${api.split("?")[0]}?strDate=${
                fullSelectedReportData.name ===
                "hours_And_Mileage_Daily_Reports"
                  ? new Date(strDate.toString() + "Z").getTime()
                  : strDate
              }&EndDate=${
                fullSelectedReportData.name ===
                "hours_And_Mileage_Daily_Reports"
                  ? new Date(EndDate.toString() + "Z").getTime()
                  : EndDate
              }&duration=${duration}&speed=${speed}&fuelPrice=${fuelPrice}`
            : api;
        try {
          // const response = await axios.get(`${api}`);
          const response =
            name === "last_vehicle_status_key"
              ? await getLastLocations()
              : name === "Active_Devices_Summary_Key"
              ? await axios.post(
                  `dashboard/reports/activeAccountsVehiclesSummary`,
                  { EndDate, accounts },
                  {
                    signal: updateController.current.controller.signal,
                    timeout: vehChecked?.length > 4000 ? 120000 : 150000,
                  }
                )
              : await axios.get(`${vech}`, {
                  signal: updateController.current.controller.signal,
                  timeout:
                    name === "Driving_Statistics_Per_Period_key" ? 0 : 15000,
                });

          setReportsDataSelected([]);
          setReportsTitleSelected("");
          setReportsTitleSelectedId(0);
          if (response.status === 200 || name === "last_vehicle_status_key") {
            if (
              Object.hasOwn(response.data, "result") &&
              Array.isArray(response.data?.result)
            ) {
              setData_table((prev) => {
                let selectedReport = prev.find(
                  (item) => item.id === fullSelectedReportData.id
                );
                selectedReport.data = response.data?.result;
                selectedReport.api = api;
                selectedReport.startDate = fullSelectedReportData.startDate;
                selectedReport.endDate = fullSelectedReportData.endDate;
                selectedReport.vehChecked = vehChecked?.map(
                  (v) => v?.VehicleID
                );
                fullSelectedReportData.pagination &&
                  setMainApi((prev) => {
                    // selectedApi.mainApi = api;
                    return prev;
                  });
                setReportsTitleSelected(selectedReport?.name);
                setReportsTitleSelectedId(selectedReport?.id);
                setReportsDataSelected(selectedReport);
                return prev;
              });
            } else {
              setData_table((prev) => {
                let selectedReport = prev.find(
                  (item) => item.id === fullSelectedReportData.id
                );
                selectedReport.data = [];
                selectedReport.api = "";
                selectedReport.startDate = fullSelectedReportData.startDate;
                selectedReport.endDate = fullSelectedReportData.endDate;
                selectedReport.vehChecked = vehChecked?.map(
                  (v) => v?.VehicleID
                );
                fullSelectedReportData.pagination &&
                  setMainApi((prev) => {
                    // selectedApi.mainApi = api;
                    return prev;
                  });
                setReportsTitleSelected(selectedReport?.name);
                setReportsTitleSelectedId(selectedReport?.id);
                setReportsDataSelected(selectedReport);
                return prev;
              });
            }
          } else {
            toast.error(`Error:  ${response.data?.message}`);
          }
        } catch (error) {
          // setLoading(false);
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            if (error?.response?.data) {
              toast.error(
                error?.response?.data?.message || "Something Went Wrong"
              );
              return;
            }
            setPopupData({ api, tableName: name });
            setEmailPopup(true);
          }
        } finally {
          setLoadingShowCurrentReport(false);
        }
      } else if (accounts.length) {
        toast.error("Please Select At Least one Account");
        return;
      } else {
        toast.error("Please Select At Least one Vehicle");
        return;
      }
    }
  };

  // switching between taps
  const handleTap = (name, id, api, startDate, endDate, vehCh, accCh) => {
    setReportApi(api);
    setVehChecked(vehCh);
    setFullSelectedReportData((prev) => ({
      ...prev,
      api,
      name,
      id,
      startDate,
      endDate,
    }));

    // filter Data_table by id
    let listFiltered = Data_table.find((item) => item.id === id);

    setFullSelectedReportData((prev) => ({
      ...prev,
      name,
      id,
      api: listFiltered.api,
    }));

    // reset reportsTitleSelectedId to 0
    setReportsTitleSelectedId(0);

    // reset loadingShowReport to false
    setLoadingShowReport(false);

    // add new selected reports's data to setReportsDataSelected
    setReportsDataSelected(listFiltered);

    // add selected report title to setReportsTitleSelected
    setReportsTitleSelected(name);

    // add selected report id to setReportsTitleSelectedId then return it
    setReportsTitleSelectedId(id);
  };

  // handle icon to open Reports List
  const handleCloseAndOpenReportsList = (status) =>
    setCloseAndOpenReportsList(status);

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    e.persist();
    if (updateController.current.id == id) {
      updateController.current?.controller?.abort();
    }
    let reportTabsFiltered = fullSelectedReportData?.data?.filter(
      (item) => item?.id !== id
    );
    // re set tabs filtered

    // filter Data_table with the last reportTabsFiltered tab
    let listFiltered = Data_table.filter((item) => item.id !== id);
    let lastListFiltered = listFiltered[listFiltered.length - 1];
    setData_table(listFiltered);

    if (lastListFiltered) {
      setReportApi(lastListFiltered.api);
      setFullSelectedReportData((prev) => ({
        ...prev,
        data: reportTabsFiltered,
        id: lastListFiltered.id,
      }));
    } else {
      setFullSelectedReportData((prev) => ({
        ...prev,
        data: reportTabsFiltered,
      }));
    }

    // check if listFiltered have elements if yes re set reportsDataSelected state
    // with new value of allData_tableOther filtered
    listFiltered.length
      ? setReportsDataSelected(lastListFiltered)
      : setReportsDataSelected([]);

    if (!listFiltered.length) {
      // to reset pagination when last tap
      setPaginationSize(10);
      setReportsTitleSelected("");
      return setReportsTitleSelectedId(0);
    }
    // re set target title with new last reportTabsFiltered
    if (reportTabsFiltered[reportTabsFiltered.length - 1]) {
      setReportsTitleSelected(
        reportTabsFiltered[reportTabsFiltered.length - 1]?.name
      );
      setReportsTitleSelectedId(
        reportTabsFiltered[reportTabsFiltered.length - 1]?.id
      );
    }
  };
  //////////////////////
  const [dateChange, setDataChange] = useState(new Date("2023-1-1"));
  function tourguideNext() {
    if (tourState) {
      dispatch(enableTour());
      setState({ stepIndex: 3, steps: steps });
    }
  }
  function tourAfterReport(index) {
    if (tourState) {
      setState({ stepIndex: 4, steps: steps });
    }
  }
  function tourAfterReport2(index) {
    if (tourState) {
      setState({ stepIndex: index, steps: steps });
    }
  }
  return (
    <div>
      {" "}
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#1e8178",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            // padding: "16px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Card>
        <Card.Body>
          <div className={`position-relative h-100`}>
            <div
              className={`position-absolute ${style.DropdownChild} shadow-sm`}
              style={{
                opacity: closeAndOpenReportsList ? 1 : 0,
                zIndex: closeAndOpenReportsList ? 900 : -1,
                transition: "all 0.5s",
                backgroundColor: UseDarkmode("#151824", "rgb(235 235 235)"),
              }}
            >
              <SideBarReports
                tourfunction={tourguideNext}
                tourcutsom={tourAfterReport}
                tourState={tourState}
                handleCloseAndOpenReportsList={handleCloseAndOpenReportsList}
                reportsTitleSelected={reportsTitleSelected}
                setReportsTitleSelected={setReportsTitleSelected}
                setReportsOptionsShow={setReportsOptionsShow}
                setReportTitle={setReportTitle}
                setReportApi={setReportApi}
                setDateStatus={setDateStatus}
                setFullSelectedReportData={setFullSelectedReportData}
                setData_table={setData_table}
                setVehChecked={setVehChecked}
                setAccounts={setAccounts}
                dataSideBar={dataSideBar}
                ShowReports={ShowReports}
                fullSelectedReportData={fullSelectedReportData}
              />
              {reportsOptionsShow ? (
                <div className="position-relative">
                  <ReportsOptions
                    tourCustom={tourAfterReport2}
                    show={reportsOptionsShow}
                    treeData={treeData}
                    setTreeData={setTreeData}
                    vechLoading={vechLoading}
                    geofencesOptions={geofencesOptions}
                    setAccounts={setAccounts}
                    onHide={ShowReports}
                    accounts={accounts}
                    reportsTitleSelected={reportsTitleSelected}
                    loadingShowReport={loadingShowReport}
                    dateStatus={dateStatus}
                    setVehiclesError={setVehiclesError}
                    vehiclesError={vehiclesError}
                    setFullSelectedReportData={setFullSelectedReportData}
                    fullSelectedReportData={fullSelectedReportData}
                    vehChecked={vehChecked}
                    setVehChecked={setVehChecked}
                    dateChange={dateChange}
                    setDataChange={setDataChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {loadingFromDashboard && <Spinner />}
          <TableTaps
            fullSelectedReportData={fullSelectedReportData}
            reportsTitleSelectedId={reportsTitleSelectedId}
            handleTap={handleTap}
            treeData={treeData}
            setTreeData={setTreeData}
            // config={config}
            setAccounts={setAccounts}
            accounts={accounts}
            handleCloseTab={handleCloseTab}
            style={style}
            Data_table={Data_table}
            setData_table={setData_table}
            reportsDataSelected={reportsDataSelected}
            reportsTitleSelected={reportsTitleSelected}
            mainApi={mainApi}
            ///////////
            show={showCurrentActiveReportOptions}
            setShow={setShowCurrentActiveReportOptions}
            ShowReports={ShowReports}
            loadingShowCurrentReport={loadingShowCurrentReport}
            dateStatus={dateStatus}
            setVehiclesError={setVehiclesError}
            vehiclesError={vehiclesError}
            setFullSelectedReportData={setFullSelectedReportData}
            vehChecked={vehChecked}
            setVehChecked={setVehChecked}
            setDataChange={setDataChange}
            dateChange={dateChange}
            setDateStatus={setDateStatus}
            paginationSize={paginationSize}
            setPaginationSize={setPaginationSize}
          />
        </Card.Body>
      </Card>
      <button
        onClick={() => handleCloseAndOpenReportsList(true)}
        className={`${style.hamburger}`}
        style={{
          opacity: closeAndOpenReportsList ? 0 : 1,
          zIndex: closeAndOpenReportsList ? -1 : 888,
          transition: "all 0.2s",
        }}
      >
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
      </button>
      {/* Email Popup */}
      {emailPopup && (
        <Model
          header={t("reports:Confirm")}
          show={emailPopup}
          onHide={() => {
            setEmailPopup(false);
            setEmail("");
          }}
          updateButton={t("reports:Send")}
          size={"md"}
          className={"mt-5"}
          onUpdate={GetReportsOnEmail}
          disabled={!validateEmail(email)}
        >
          <h5 className="mb-3 " style={{ letterSpacing: "1.1px" }}>
            {t("reports:asking_To_Report")}
          </h5>

          <Form.Control
            type="email"
            placeholder={t("reports:Enter_Email")}
            value={email}
            isInvalid={!validateEmail(email) && email.trim() !== ""}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {!validateEmail(email) && email.trim() !== "" && (
            <p className="text-danger">Email is not valid</p>
          )}
        </Model>
      )}
      {loadingEmail && (
        <Model
          header={t("reports:Confirm")}
          show={loadingEmail}
          onHide={() => setLoadingEmail(false)}
          size={"md"}
          footer={false}
          className={"mt-5"}
        >
          <h5 className="mb-3 " style={{ letterSpacing: "1.1px" }}>
            {t("reports:confirm")}
          </h5>
        </Model>
      )}
    </div>
  );
};
export default ReportsContent;
