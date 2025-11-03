import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Ui lib
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Button, Card, Form } from "react-bootstrap";

// Css
import Styles from "styles/Settings.module.scss";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { SiMicrosoftexcel } from "react-icons/si";

// Custom Hooks
import useDrawHelper from "hooks/useDrawHelper";

// Components
import PlayVideo from "./PlayVideo";
import Settings from "./Settings";
import ReactSelect from "components/Select";
import StapperContent from "./StapperContent";

// Date Lib
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import { enUS, ar, es, fr } from "date-fns/locale"; // Import the required locales
import IMask from "imask";

// Helpers
import formatHourNumber from "utils/formatHourNumber";
import { convertJsonToExcel } from "helpers/helpers";
import { changeRowDataKeys } from "helpers/histroy/helper";

const StepperComp = ({
  geofences,
  setGeofences,
  chartModal,
  setchartModal,
  setSelectedLocations,
  landMarks,
  setLandMarks,
  isLandMarkChecked,
  setIsLandMarkChecked,
  isGeofencesChecked,
  setIsGeofencesChecked,
  vehicleData: locInfo,
}) => {
  const { t } = useTranslation("history");
  const L = require("leaflet");
  const { query, locale, push } = useRouter();
  const { myMap } = useSelector((state) => state.mainMap);
  const { darkMode } = useSelector((state) => state.config);
  const [loading, setloading] = useState(false);
  const [AllSteps, setAllSteps] = useState({});
  const [selectedStep, setselectedStep] = useState("null");
  const [AllLocations, setAllLocations] = useState({});
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [stats, setStats] = useState(0);
  const newToken = useSelector((state) => state?.auth?.user?.new_token);

  const fullPathGroup = // L.featureGroup().addTo(myMap);
    useMemo(
      () => (myMap && L ? L.featureGroup().addTo(myMap) : {}),
      [L, myMap]
    );
  const {
    drawInitialVehicle,
    drawselectedsteps,
    drawStepsPath,
    drawEndPointVehicle,
  } = useDrawHelper(fullPathGroup);
  const config_getLocations =
    localStorage.getItem("config_getLocations") &&
    JSON.parse(localStorage.getItem("config_getLocations"));
  const stopLoop = useRef(false);
  const [currentSLocation, setCurrentSLocation] = useState(0);
  const [speedCar, setSpeedCar] = useState(1000);
  const [getAllLocations, setGetAllLocations] = useState(
    config_getLocations || false
  );
  // when all locations ON user cannot get range more than month
  const [rangeError, setRangeError] = useState(false);
  const [MinDistance, setMinDistance] = useState(20);
  const [MaxMarkers, setMaxMarkers] = useState(100);
  const [MaxGuides, setMaxGuides] = useState(100);
  const [allMarkers, setAllMarkers] = useState(true);
  const [colorOfMarkers, setColorOfMarkers] = useState("#079aa2");
  const [colorOfGuides, setColorOfGuides] = useState("#079aa2");
  const [markerIcon, setMarkerIcon] = useState("RiMapPinAddFill");
  const [guidesIcon, setGuidesIcon] = useState("FaLocationArrow");
  const [isToggleConfigOpen, setisToggleConfigOpen] = useState(false);

  const [IsFromState, setIsFromState] = useState(false);
  const [workstep, setWorkstep] = useState({});
  const [msgEmptyData, setMsgEmptyData] = useState("");
  const [pathSteps, setPathSteps] = useState([]);

  const [rangeDraw, setRangeDraw] = useState({
    label: "",
    min: 0,
    max: pathSteps?.length - 1,
    step: 1,
    value: {
      min: 0,
      max: pathSteps?.length - 1,
    },
  });
  const [drawOptions, setDrawOptions] = useState({
    MinDistance: +MinDistance,
    MaxMarkers: +MaxMarkers,
    MaxGuides: +MaxGuides,
    allMarkers,
    getAllLocations,
    colorOfMarkers,
    colorOfGuides,
    markerIcon,
    guidesIcon,
  });

  const [Dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const presentDate = moment().format("YYYY-MM-DD");
  const [HoursFrom, setHoursFrom] = useState("00");
  const [MinutsFrom, setMinutsFrom] = useState("00");
  const [HoursTo, setHoursTo] = useState("23");
  const [MinutsTo, setMinutsTo] = useState("59");

  const [newData, setNewAllLocations] = useState([]);
  const [fullDate, setFullDate] = useState({
    strDate: query.Period ?? presentDate,
    endDate: query.Period ?? presentDate,
    strTime: `00:00:00`,
    endTime: `23:59:00`,
    fullTime: `${query.Period ?? presentDate}T00:00:00 ${
      query.Period ?? presentDate
    }T23:59:00`,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [disableBtn, setDisableBtn] = useState(false);

  const mask = IMask.createMask({
    mask: "Y-M-DTH:MN:S Y-M-DTH:MN:S",
    blocks: {
      Y: {
        mask: IMask.MaskedRange,
        from: 2010,
        to: 2050,
      },
      M: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
      },
      D: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
      },
      H: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23,
      },
      MN: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
      },
      S: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
      },
    },
  });

  const [validated, setValidated] = useState(true);

  // this to translate the right side of dateRangePicker
  useEffect(() => {
    if (showDatePicker) {
      // this span contain text of the date (thisweek thisweek lastmonth ...)
      const allspan = document.querySelectorAll(".rdrStaticRangeLabel");
      const allDiv = document.querySelectorAll(".rdrInputRange span");
      allspan.forEach((s) => (s.textContent = t(s.textContent)));
      allDiv.forEach((div) => (div.textContent = t(div.textContent)));
    }
  }, [showDatePicker]);

  const localeMap = {
    en: enUS,
    ar,
    es,
    fr,
  };
  const localeSetting = {
    locale: localeMap[locale],
  };

  // for moving the Car
  useEffect(() => {
    let steps =
      getAllLocations &&
      (selectedStep === -1 || (!selectedStep && selectedStep !== 0))
        ? Object.values(AllLocations).flat()
        : selectedSteps;

    if (stats === 1) {
      // stats === 1 handle playing video
      setTimeout(() => {
        myMap?.UpdateMarker(steps[currentSLocation], {
          history: true,
        });
        if (myMap) {
          myMap?.customZoom();
        }
        setCurrentSLocation((prevState) => prevState + 1);
      }, speedCar);
    } else if (stats === 2) {
      // handle go to first step
      myMap?.UpdateMarker(steps[currentSLocation], {
        history: true,
      });
    } else if (stats === 3) {
      // handle prev ,next and pause
      myMap?.UpdateMarker(steps[currentSLocation], {
        history: true,
      });
    } else {
      // handle go to last step and stop
      myMap?.UpdateMarker(steps[currentSLocation], {
        history: true,
      });
    }
  }, [stats, currentSLocation, myMap, selectedSteps, selectedStep]);

  const loopArray = async (array) => {
    let pageno = 1;
    let pagesize = 20000;
    let resPage = [];
    let currSelectedLocations;
    let res;

    setloading(true);
    const [startDateTime, endDateTime] = fullDate.fullTime.split(" ");
    do {
      res = await axios.get(
        `vehicles/historyplayback?VehID=${
          query?.VehID
        }&pageNumber=${pageno}&pageSiz=${pagesize}&strDate=${new Date(
          startDateTime
        ).toISOString()}&endDate=${new Date(endDateTime).toISOString()}&mode=1`
      );
      if (res.status === 200) {
        const newData = res?.data?.historylocations?.map(function (data) {
          return {
            ID: data?._id,
            VehicleID: data?.VehicleID,
            RecordDateTime: data?.RecordDateTime,
            Latitude: data?.Latitude,
            Longitude: data?.Longitude,
            Direction: data?.Direction,
            Speed: data?.Speed,
            Address: data?.Address,
            Invalid: data?.Invalid,
            VehicleStatus: data.VehicleStatus,
            DisplayName: data?.DisplayName,
            configJson: data?.configJson,
          };
        });
        resPage = resPage.concat(newData);
      } else {
        toast.error(res.toString());
        setDisableBtn(false);
      }

      pageno++;
    } while (res?.data?.historylocations?.length >= pagesize && locInfo);

    if (resPage?.length) {
      currSelectedLocations = [...resPage];
      currSelectedLocations = currSelectedLocations.sort(
        (a, b) => new Date(b.RecordDateTime) - new Date(a.RecordDateTime)
      );

      currSelectedLocations = currSelectedLocations
        .reduce((pv, cv) => {
          if (!pv.length) return [cv];
          const lv = pv[pv.length - 1];
          pv.push({
            ...cv,
            Duration:
              (new Date(lv.RecordDateTime) - new Date(cv.RecordDateTime)) /
              1000,
            StepDistance: L.latLng(lv.Latitude, lv.Longitude).distanceTo(
              L.latLng(cv.Latitude, cv.Longitude)
            ),
            EndDate: lv.RecordDateTime,
            Guide: {},
          });
          return pv;
        }, [])
        .reverse()
        .slice(0, currSelectedLocations.length - 1);
      currSelectedLocations = currSelectedLocations.reduce((pv, cv) => {
        pv.push({
          ...cv,
          IdleSince:
            cv.Speed > 0
              ? 0
              : cv.Duration + (pv.length > 0 ? pv[pv.length - 1].IdleSince : 0),
        });
        return pv;
      }, []);
    }

    const allLocations = {};
    setNewAllLocations([...currSelectedLocations]);
    const startDateUTC = new Date(startDateTime).getTime();
    const endDateUTC = new Date(endDateTime).getTime();

    const filteredData = currSelectedLocations.filter((s) => {
      const recordDateUTC = new Date(s.RecordDateTime).getTime();
      const isAfterStart = recordDateUTC >= startDateUTC;
      const isBeforeEnd = recordDateUTC < endDateUTC;
      const status = isAfterStart && isBeforeEnd;
      return status;
    });
    if (filteredData.length) {
      filteredData?.forEach((re) => (allLocations[re.ID] = re));
      setAllLocations(allLocations);
      drawInitialVehicle(filteredData[0], locInfo, drawOptions, true);
      drawEndPointVehicle(
        filteredData[filteredData?.length - 1],
        locInfo,
        drawOptions,
        true
      );
      setSelectedLocations(filteredData);
      drawselectedsteps(array[0], filteredData, locInfo, true, drawOptions);
    }
    setloading(false);
    setDisableBtn(false);
  };

  const [makePlayBtnDisabled, setMakePlayBtnDisabled] = useState(true);
  const handleselectedStep = async (item, index, fromAllSteps = false) => {
    try {
      // Clear map and reset state
      if ((getAllLocations && !fromAllSteps) || !fromAllSteps) {
        myMap.deselectAll();
        fullPathGroup.clearLayers();
        if (item?.ID === "DummyStep") setMakePlayBtnDisabled(false);
        if (item?.IsIdle) {
          setMakePlayBtnDisabled(true);
        } else {
          if (item?.StrEvent == "Trip") {
            setMakePlayBtnDisabled(false);
          } else {
            if (item?.StrEvent == "Parked" && item?.ID !== "DummyStep") {
              setMakePlayBtnDisabled(true);
            }
          }
        }
        setselectedStep(index);
      }

      setSelectedLocations([]);
      setSelectedSteps([]);
      setPathSteps([]);
      setStats(0);
      setSpeedCar(1000);
      setCurrentSLocation(0);
      let allLocations = {};
      const { StrDate, EndDate } = item;
      if (selectedStep === index) {
        setMakePlayBtnDisabled(getAllLocations ? false : true);
        setselectedStep(0 - 1);
        myMap?.deselectAll();
        fullPathGroup.clearLayers();
        if (drawOptions.getAllLocations) {
          const [startDateTime, endDateTime] = fullDate.fullTime.split(" ");
          const startDateUTC = new Date(startDateTime).getTime();
          const endDateUTC = new Date(endDateTime).getTime();

          const filteredData = newData.filter((s) => {
            const recordDateUTC = new Date(s.RecordDateTime).getTime();
            const isAfterStart = recordDateUTC >= startDateUTC;
            const isBeforeEnd = recordDateUTC < endDateUTC;
            const status = isAfterStart && isBeforeEnd;
            return status;
          });
          if (filteredData.length) {
            filteredData.forEach((re) => (allLocations[re.ID] = re));
            setAllLocations(allLocations);
            drawInitialVehicle(filteredData[0], locInfo, drawOptions, true);
            drawEndPointVehicle(
              filteredData[filteredData.length - 1],
              locInfo,
              drawOptions,
              true
            );
            setSelectedLocations(filteredData);
            drawselectedsteps(
              Object.values(AllSteps)[0],
              filteredData,
              locInfo,
              true,
              drawOptions
            );
          }
        }
        return;
      }
      // Check if currSelectedLocations is already cached
      let currSelectedLocations = AllLocations[item?.ID] || [];
      const isFromState = !!currSelectedLocations.length;
      setIsFromState(isFromState);

      // If no cached locations and event is "Parked" or "IsIdle", retrieve initial location
      if (
        !currSelectedLocations?.length &&
        (item?.StrEvent === "Parked" || item?.IsIdle)
      ) {
        let lat = item?.StrLat || 0;
        let lng = item?.StrLng || 0;

        // If lat/lng is not available, fetch data from the server
        if (lat === 0 || lng === 0) {
          const res = await axios.get(
            `vehicles/historyplayback?VehID=${
              query?.VehID
            }&pageNumber=${1}&pageSiz=${1000}&strDate=${StrDate}&endDate=${EndDate}&mode=1`
          );
          if (res.status === 200) {
            lat = res?.data?.historylocations[0]?.Latitude || 0;
            lng = res?.data?.historylocations[0]?.Longitude || 0;
          }
        }

        const steps = {
          ...locInfo,
          ID: item?._id,
          RecordDateTime: item?.StrDate,
          EndDate: item?.EndDate,
          Latitude: lat,
          Longitude: lng,
          Duration: item?.Duration,
          Address: item?.StrAdd || item?.Address,
          Speed: 0,
          VehicleStatus: item?.StrEvent === "Parked" ? 0 : 2,
          DisplayName: locInfo?.DisplayName || "NA",
        };
        AllLocations[item?.ID] = [steps];
        currSelectedLocations = [steps];
        setAllLocations((prev) => ({
          ...prev,
          [item?.ID]: [...currSelectedLocations],
        }));
      }

      if (drawOptions.getAllLocations) {
        myMap?.deselectAll();
        fullPathGroup.clearLayers();
        let fromDate = new Date(StrDate);
        let toDate = new Date(EndDate);
        newData.forEach((re) => (allLocations[re.ID] = re));
        let filteredData = Object.keys(allLocations)
          .filter((id) => {
            let startdate = new Date(allLocations[id]?.RecordDateTime);
            let enddate = new Date(allLocations[id]?.EndDate);

            return (
              startdate.getTime() >= fromDate.getTime() &&
              enddate.getTime() <= toDate.getTime()
            );
          })
          .map((key) => allLocations[key]);
        setAllLocations({ [item.ID]: filteredData });
        const maxIdleSince =
          filteredData.length > 0
            ? Math.max(
                ...filteredData.map((x) =>
                  !isNaN(x.IdleSince) ? x.IdleSince : 0
                )
              )
            : 0;
        drawInitialVehicle(
          filteredData[filteredData.length - 1] ?? currSelectedLocations[0],
          locInfo,
          drawOptions
        );

        if ((item.IsTrip && item.Distance) || item.ID == "DummyStep") {
          setAllSteps((prev) => ({
            ...prev,
            [item.ID]: {
              ...prev[item.ID],
              maxIdleSince: maxIdleSince,
            },
          }));
          setSelectedSteps(filteredData);
          setSelectedLocations(filteredData);
          drawselectedsteps(
            Object.values(AllSteps)[0],
            filteredData,
            locInfo,
            true,
            drawOptions
          );
        }

        return;
      }

      // If no cached locations and event is not "Parked" and not "IsIdle"
      if (
        (!currSelectedLocations.length &&
          item?.StrEvent !== "Parked" &&
          !item?.IsIdle) ||
        (item.ID == "DummyStep" && currSelectedLocations.length == 1)
      ) {
        const expSteps = Math.ceil(item?.Duration / 20);

        let progress = `Please wait, expecting ${expSteps} data points...`;
        setDisableBtn(true);

        if (!getAllLocations && !fromAllSteps) {
          toast.warning(progress);
        }
        setloading(true);

        const pagesize =
          expSteps < 1000
            ? 250
            : expSteps < 5000
            ? 500
            : expSteps < 10000
            ? 750
            : 1000;

        let res;
        let resPage = [];

        let pageno = 1;

        do {
          res = await axios.get(
            `vehicles/historyplayback?VehID=${query?.VehID}&pageNumber=${pageno}&pageSiz=${pagesize}&strDate=${StrDate}&endDate=${EndDate}&mode=1`
          );

          if (res.status === 200) {
            const newData = res?.data?.historylocations.map(function (data) {
              return {
                ID: data?._id,
                VehicleID: data?.VehicleID,
                RecordDateTime: data?.RecordDateTime,
                Latitude: data?.Latitude,
                Longitude: data?.Longitude,
                Direction: data?.Direction,
                Speed: data?.Speed,
                Address: data?.Address,
                Invalid: data?.Invalid,
                VehicleStatus: data.VehicleStatus,
                DisplayName: locInfo?.DisplayName,
                configJson: locInfo?.configJson,
              };
            });

            resPage = resPage.concat(newData);

            const message =
              newData?.length === pagesize
                ? `${resPage?.length} Records Fetched, up to ${
                    resPage[resPage?.length - 1]?.RecordDateTime || item.EndDate
                  }, out of about ${expSteps} ...`
                : `Fetching data is completed, start drawing ${resPage?.length} records`;

            drawStepsPath(newData);
            toast.dismiss();
            toast.info(message);
            // setDisableBtn(false);
          } else {
            toast.error(res.toString());
            setDisableBtn(false);
          }

          pageno++;
        } while (res?.data?.historylocations?.length >= pagesize);

        if (resPage.length) {
          currSelectedLocations = [...resPage];
          currSelectedLocations = currSelectedLocations.sort(
            (a, b) => new Date(b.RecordDateTime) - new Date(a.RecordDateTime)
          );

          currSelectedLocations = currSelectedLocations
            .reduce((pv, cv) => {
              if (!pv.length) return [cv];
              const lv = pv[pv.length - 1];
              pv.push({
                ...cv,
                Duration:
                  (new Date(lv.RecordDateTime) - new Date(cv.RecordDateTime)) /
                  1000,
                StepDistance: L.latLng(lv.Latitude, lv.Longitude).distanceTo(
                  L.latLng(cv.Latitude, cv.Longitude)
                ),
                EndDate: lv.RecordDateTime,
                Guide: {},
              });
              return pv;
            }, [])
            .reverse()
            .slice(0, currSelectedLocations.length - 1);

          currSelectedLocations = currSelectedLocations.reduce((pv, cv) => {
            pv.push({
              ...cv,
              IdleSince:
                cv.Speed > 0
                  ? 0
                  : cv.Duration +
                    (pv.length > 0 ? pv[pv.length - 1].IdleSince : 0),
              IdleStart:
                cv.Speed > 0
                  ? null
                  : pv.length > 0
                  ? pv[pv.length - 1].IdleStart
                  : cv.RecordDateTime,
            });
            return pv;
          }, []);

          if (item.status === "InProgress") {
            const lastLocation =
              currSelectedLocations[currSelectedLocations.length - 1];
            item.EndDate = lastLocation.RecordDateTime;
            setAllSteps((prev) => ({
              ...prev,
              [item.ID]: { ...item },
            }));
          }

          setAllLocations((prev) => ({
            ...prev,
            [item?.ID]: [...currSelectedLocations],
          }));
        } else {
          const steps = {
            ...locInfo,
            ID: item?._id,
            RecordDateTime: item?.StrDate || item?.endDate,
            EndDate: item?.EndDate,
            Duration: item?.Duration,
            Address: item?.StrAdd || item?.Address,
            Speed: 0,
            VehicleStatus: item?.StrEvent === "Parked" ? 0 : 2,
            DisplayName: locInfo?.DisplayName || "NA",
          };

          !fromAllSteps && toast.error("No Data Found for this trip!");
          AllLocations[item.ID] = [steps];
          currSelectedLocations = [steps];
          setAllLocations({
            [item.ID]: [...currSelectedLocations],
          });
        }

        setloading(false);
        setDisableBtn(false);
      }

      const maxIdleSince =
        currSelectedLocations.length > 0
          ? Math.max(
              ...currSelectedLocations.map((x) =>
                !isNaN(x.IdleSince) ? x.IdleSince : 0
              )
            )
          : 0;

      setAllSteps((prev) => ({
        ...prev,
        [item.ID]: {
          ...prev[item.ID],
          maxIdleSince: maxIdleSince,
          excessiveIdle: maxIdleSince > item?.maxIdle,
        },
      }));

      setSelectedSteps(currSelectedLocations);

      setSelectedLocations(currSelectedLocations);
      currSelectedLocations &&
        drawInitialVehicle(currSelectedLocations[0], locInfo, drawOptions);

      setWorkstep(item);
      setPathSteps(currSelectedLocations);
      drawselectedsteps(
        item,
        currSelectedLocations,
        locInfo,
        isFromState,
        drawOptions
      );
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    if (myMap) {
      const markers = myMap.activeGroup()?.getLayers();
      if (markers) {
        const markersToRemove = markers.filter(
          (marker) => marker?.id === undefined
        );
        markersToRemove.forEach((marker) => {
          myMap.removeLayer(marker);
        });
      }

      if (markers?.length > 1) {
        const markersToRemove = markers.filter(
          (marker) => marker?.options?.locInfo?.VehicleStatus === 0
        );
        markersToRemove.forEach((marker) => {
          myMap.removeLayer(marker);
        });
      }
      myMap.setCluster(false);
    }
  }, [stats, currentSLocation, myMap, selectedSteps]);

  const handleClose = () => {
    setselectedStep(0 - 1);
    myMap?.deselectAll();
    fullPathGroup.clearLayers();
    setMakePlayBtnDisabled(getAllLocations ? false : true);
    setStats(0);
    const allLocations = {};
    if (getAllLocations) {
      newData.forEach((re) => (allLocations[re.ID] = re));

      setAllLocations(allLocations);
      const allSelectedSteps = Object.values(AllSteps)[0];
      setSelectedLocations(newData);
      drawInitialVehicle(newData[0], locInfo, drawOptions, true);
      // drawEndPointVehicle(newData[newData?.length - 1], locInfo, drawOptions);

      drawselectedsteps(allSelectedSteps, newData, locInfo, true, drawOptions);
    }
  };

  useEffect(() => {
    document?.body?.setAttribute("typeBody", "history");
    const getConfig = async () => {
      await axios
        .get("config")
        .then((res) => {
          if (res.status === 200) {
            const {
              MinDistance,
              MaxMarkers,
              MaxGuides,
              allMarkers,
              getAllLocations,
              colorOfMarkers,
              colorOfGuides,
              markerIcon,
              guidesIcon,
            } = res?.data?.configs?.historyPlayBackConfigs;
            setDrawOptions(res?.data?.configs?.historyPlayBackConfigs);
            setGetAllLocations(getAllLocations);
            setMinDistance(MinDistance);
            setMaxMarkers(MaxMarkers);
            setMaxGuides(MaxGuides);
            setAllMarkers(allMarkers);
            setColorOfMarkers(colorOfMarkers);
            setColorOfGuides(colorOfGuides);
            setMarkerIcon(markerIcon);
            setGuidesIcon(guidesIcon);
          }
        })
        .catch((err) => {
          toast.error(err.meesage);
        });
    };

    getConfig();
  }, []);
  const handleSaveSettings = async () => {
    setisToggleConfigOpen((prev) => !prev);
    const _newConfig = {
      historyPlayBackConfigs: {
        MinDistance: +MinDistance,
        MaxMarkers: +MaxMarkers,
        MaxGuides: +MaxGuides,
        allMarkers,
        getAllLocations,
        colorOfMarkers,
        colorOfGuides,
        markerIcon,
        guidesIcon,
      },
    };
    setDrawOptions(_newConfig.historyPlayBackConfigs);
    setisToggleConfigOpen(false);
    setSelectedLocations(pathSteps);
    pathSteps?.length &&
      drawselectedsteps(
        workstep,
        pathSteps,
        locInfo,
        IsFromState,
        _newConfig.historyPlayBackConfigs,
        true
      );
    try {
      await axios.post("config/history", _newConfig);
    } catch (err) {
      toast.error(err.meesage);
    }
  };

  function handleSelect(item) {
    setDates([item.selection]);
    setFullDate((prev) => ({
      ...prev,
      strDate: `${moment(item.selection.startDate).format("YYYY-MM-DD")}`,
      endDate: `${moment(item.selection.endDate).format("YYYY-MM-DD")}`,
      fullTime: `${moment(item.selection.startDate).format(
        "YYYY-MM-DD"
      )}T${HoursFrom}:${MinutsFrom}:00 ${moment(item.selection.endDate).format(
        "YYYY-MM-DD"
      )}T${HoursTo}:${MinutsTo}:00`,
    }));

    if (getAllLocations) {
      const diffInMonths = moment(item.selection.endDate).diff(
        moment(item.selection.startDate),
        "months"
      );
      if (diffInMonths < 1) {
        setRangeError(false);
      } else {
        setRangeError(true);
        // toast.error(
        //   "You can't pick for more than 1 month, please disable 'all locations' feature"
        // );
      }
    }
  }

  const handleHoursFrom = (value) => {
    setFullDate((prev) => ({
      ...prev,
      strTime: `${value}:${MinutsFrom}:00`,
      fullTime: `${prev.strDate}T${value}:${MinutsFrom}:00 ${prev.endDate}T${HoursTo}:${MinutsTo}:00`,
    }));
    setHoursFrom(value);
  };

  const handleMinutsFrom = (value) => {
    setFullDate((prev) => ({
      ...prev,
      strTime: `${HoursFrom}:${value}:00`,
      fullTime: `${prev.strDate}T${HoursFrom}:${value}:00 ${prev.endDate}T${HoursTo}:${MinutsTo}:00`,
    }));
    setMinutsFrom(value);
  };

  const handleHoursTo = (value) => {
    setFullDate((prev) => ({
      ...prev,
      endTime: `${value}:${MinutsTo}:00`,
      fullTime: `${prev.strDate}T${HoursFrom}:${MinutsFrom}:00 ${prev.endDate}T${value}:${MinutsTo}:00`,
    }));
    setHoursTo(value);
  };

  const handleMinutsTo = (value) => {
    setFullDate((prev) => ({
      ...prev,
      endTime: `${HoursTo}:${value}:00`,
      fullTime: `${prev.strDate}T${HoursFrom}:${MinutsFrom}:00 ${prev.endDate}T${HoursTo}:${value}:00`,
    }));
    setMinutsTo(value);
  };

  const getDateOptions = (nums) =>
    Array.from(Array(nums).keys()).map((it) => ({
      value: it < 10 ? `0${it}` : it,
      label: it < 10 ? `0${it}` : it,
    }));

  const hoursOptions = getDateOptions(24);

  const minutsOptions = getDateOptions(60);

  const handleGetSteps = useCallback(() => {
    if (getAllLocations) {
      setMakePlayBtnDisabled(false);
    }
    myMap.deselectAll();
    fullPathGroup.clearLayers();
    setselectedStep(null);
    setSelectedLocations([]);
    setSelectedSteps([]);
    setPathSteps([]);
    setAllSteps({});
    setStats(0);
    setSpeedCar(1000);
    setCurrentSLocation(0);
    let valid = true;
    stopLoop.current = false;

    if (rangeError) {
      toast.error(
        "You can't pick for more than 1 month, please disable 'all locations' feature"
      );
      return;
    }
    // Date validation
    if (Date.parse(fullDate.strDate) > Date.parse(fullDate.endDate)) {
      toast.warning("Please make sure that start date is before end date");
      setValidated(false);
      valid = false;
    } else if (fullDate.fullTime.length !== 39) {
      toast.warning(t("Please enter a valid date range"));
      setValidated(false);
      valid = false;
    } else {
      setValidated(true);
      valid = true;
    }

    if (valid === true) {
      myMap?.deselectAll();
      fullPathGroup.clearLayers();
      setShowDatePicker(false);
      setloading(true);
      setAllLocations({});
      setAllSteps({});
      setselectedStep(null);
      setSelectedLocations([]);
      setSelectedSteps([]);
      setMsgEmptyData("");
      const fullUtcStrDate = new Date(
        `${moment(fullDate.strDate).format("YYYY-MM-DD")}T${fullDate.strTime}`
      ).getTime();
      const fullUtcEndDate = new Date(
        `${moment(fullDate.endDate).format("YYYY-MM-DD")}T${fullDate.endTime}`
      ).getTime();

      if (getAllLocations) {
        const diffInMonths = moment(fullUtcEndDate).diff(
          moment(fullUtcStrDate),
          "months"
        );
        if (diffInMonths <= 1) {
          setRangeError(false);
        } else {
          setRangeError(true);
          setloading(false);
          toast.error(
            "You can't pick for more than 1 month, please disable 'all locations' feature"
          );
          return;
        }
      }
      (async () => {
        await axios
          .get(
            `vehicles/historysteps?VehID=${query?.VehID}&pageNumber=1&pageSiz=10000&strDate=${fullUtcStrDate}&endDate=${fullUtcEndDate}`
          )
          .then(({ data }) => {
            if (data?.historysteps && data?.historysteps?.length) {
              const historysteps = data.historysteps.map((s) => {
                let ns = {
                  ...s,
                  IsIdle: s?.StrEvent == "Trip" && !s.Distance,
                  maxIdle: 60 * 10,
                  maxIdleSince: 0,
                  excessiveIdle: false,
                };

                if (s?._id || getAllLocations || s?.ID) {
                  ns = {
                    ...ns,
                    ID: s?.ID ?? s?._id,
                    IsIdle: s?.IsTrip && !s.Distance,
                    StrEvent: s?.IsTrip ? "Trip" : "Parked",
                    Endvent: s?.IsTrip ? "Parked" : "Trip",
                    StrDate: s?.StrDate,
                    EndDate: s?.EndDate,
                    StrLat: s?.Coord?.[0] ?? 0,
                    StrLng: s?.Coord?.[1] ?? 0,
                  };
                }
                return ns;
              });

              const allHistorysteps = {};
              historysteps.forEach((item) => {
                allHistorysteps[item.ID] = item;
              });

              setloading(false);
              setAllSteps(allHistorysteps);
              if (drawOptions.getAllLocations) {
                loopArray([...historysteps]);
                setMsgEmptyData("");
              }
            } else {
              setMsgEmptyData("there is no data");
              toast.info("there is no data");
              setloading(false);
            }
          })
          .catch((error) => {
            toast.error(error.message);
            setloading(false);
          });
      })();
    }
  }, [
    newToken,
    // drawOptions.getAllLocations,
    query?.VehID,
    Dates,
    HoursFrom,
    MinutsFrom,
    HoursTo,
    MinutsTo,
    fullDate,
    AllSteps,
  ]);
  function convertSeconds(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0)
      parts.push(`${remainingSeconds}s`);
    return parts.join(" ");
  }
  const handleExport = (data, name) => {
    convertJsonToExcel(
      changeRowDataKeys(
        data.map((v) => ({
          PlateNumber: locInfo?.PlateNumber,
          DisplayName: locInfo?.DisplayName,
          ...v,
          Distance: parseFloat(((v.Distance ?? 0) / 1000).toFixed(2)),
          Duration: convertSeconds(v?.Duration ?? 0),
        }))
      ),
      name
    );
  };

  useEffect(() => {
    localStorage.setItem(
      "config_getLocations",
      JSON.stringify(getAllLocations)
    );

    if (query.Period) {
      handleGetSteps();
      push(`history?&VehID=${query.VehID}`);
    }
  }, [query.Period, getAllLocations]);
  return (
    <>
      <Card
        className="px-2 menuTreeHistory  position-relative"
        style={{ backgroundColor: darkMode && "rgb(21 25 37)" }}
      >
        <button
          id="config-toggle-btn"
          onClick={() => {
            setisToggleConfigOpen((prev) => !prev);
            setShowDatePicker(false);
          }}
          type="button"
          className={Styles.config_btn2}
          style={{
            backgroundColor: darkMode && "rgb(21 25 37)",
            left: locale === "ar" ? "0" : "",
            right: !(locale === "ar") ? "0" : "",
          }}
        >
          <FontAwesomeIcon icon={faSlidersH} />
        </button>

        <Form.Control
          id="history-date-picker"
          size="md"
          type="text"
          placeholder={fullDate.fullTime}
          value={fullDate.fullTime} // Sat Jan 14 2023 23:59:59 GMT+0200 (Eastern European Standard Time)
          onChange={(e) => {
            const inputValue = e.target.value;
            const maskedInput = mask.resolve(inputValue);
            setFullDate((prev) => ({
              ...prev,
              strDate: maskedInput?.split(" ")[0]?.split("T")[0],
              strTime: maskedInput?.split(" ")[0]?.split("T")[1],
              endDate: maskedInput?.split(" ")[1]?.split("T")[0],
              endTime: maskedInput?.split(" ")[1]?.split("T")[1],
              fullTime: maskedInput,
            }));
          }}
          onClick={() => {
            setShowDatePicker(true);
            setisToggleConfigOpen(false);
          }}
          className={`border border-${!validated && "danger"}`}
        />

        {/* conditional Rendering for Date Range Picker */}
        <div
          className={`align-items-start justify-content-start bg-black  ${
            locale === "ar" ? "calender-rtl" : ""
          }`}
        >
          {showDatePicker ? (
            <>
              <div
                className="d-flex justify-content-between gap-3"
                style={{
                  backgroundColor: darkMode ? "#222738" : "#fff",
                  width: "35rem",
                }}
              >
                <div
                  className="d-flex flex-row justify-content-start ms-3 py-3 gap-1"
                  style={{ width: "200px" }}
                >
                  <Button
                    size="lg"
                    variant="danger"
                    className="col-2"
                    onClick={() => {
                      setShowDatePicker(false);
                    }}
                  >
                    X
                  </Button>
                  <Button
                    size="lg"
                    variant="primary"
                    className="px-3 col-10"
                    onClick={handleGetSteps}
                    disabled={disableBtn}
                  >
                    {t("Get_Steps")}
                  </Button>
                </div>
                <div
                  className="dateBx d-flex justify-content-between gap-2"
                  // style={{ width: "332px", gap: "1rem" }}
                >
                  <div
                    className="inputDateFrom d-flex justify-content-between gap-1"
                    // style={{ width: "50%", gap: "1.5rem" }}
                  >
                    <ReactSelect
                      onSelectChange={handleHoursFrom}
                      options={hoursOptions}
                      defaultValue={{
                        value: HoursFrom ? HoursFrom : "00",
                        label: HoursFrom ? HoursFrom : "00",
                      }}
                      value={{
                        value: HoursFrom ? HoursFrom : "00",
                        label: HoursFrom ? HoursFrom : "00",
                      }}
                      Style={{ marginLeft: "0.7rem" }}
                      className="mb-3  mt-3"
                      cuStyles={{
                        minHeight: "30px",
                      }}
                    />
                    <ReactSelect
                      onSelectChange={handleMinutsFrom}
                      options={minutsOptions}
                      defaultValue={{
                        value: MinutsFrom ? MinutsFrom : "00",
                        label: MinutsFrom ? MinutsFrom : "00",
                      }}
                      value={{
                        value: MinutsFrom ? MinutsFrom : "00",
                        label: MinutsFrom ? MinutsFrom : "00",
                      }}
                      className="mb-3 mt-3"
                      cuStyles={{
                        minHeight: "30px",
                      }}
                    />
                  </div>
                  <div className="inputDateTo d-flex justify-content-between gap-1">
                    <ReactSelect
                      onSelectChange={handleHoursTo}
                      value={{
                        value: HoursTo ? HoursTo : "23",
                        label: HoursTo ? HoursTo : "23",
                      }}
                      options={hoursOptions}
                      defaultValue={{
                        value: HoursTo ? HoursTo : "23",
                        label: HoursTo ? HoursTo : "23",
                      }}
                      className="mb-3 mt-3"
                      cuStyles={{
                        minHeight: "30px",
                      }}
                    />
                    <ReactSelect
                      onSelectChange={handleMinutsTo}
                      options={minutsOptions}
                      defaultValue={{
                        value: MinutsTo ? MinutsTo : "59",
                        label: MinutsTo ? MinutsTo : "59",
                      }}
                      className="mb-3 mt-3 me-3"
                      cuStyles={{
                        minHeight: "30px",
                      }}
                    />
                  </div>
                </div>
              </div>

              <DateRangePicker
                maxDate={moment().toDate()}
                ranges={Dates}
                onChange={handleSelect}
                rangeColors={["#0E6395"]}
                locale={localeSetting.locale}
              />
            </>
          ) : null}
        </div>
        <Settings
          setRangeError={setRangeError}
          rangeError={rangeError}
          setShowDatePicker={setShowDatePicker}
          handleSaveSettings={handleSaveSettings}
          MinDistance={MinDistance}
          MaxMarkers={MaxMarkers}
          MaxGuides={MaxGuides}
          allMarkers={allMarkers}
          colorOfMarkers={colorOfMarkers}
          colorOfGuides={colorOfGuides}
          markerIcon={markerIcon}
          guidesIcon={guidesIcon}
          setMinDistance={setMinDistance}
          setMaxMarkers={setMaxMarkers}
          setMaxGuides={setMaxGuides}
          setAllMarkers={setAllMarkers}
          setColorOfMarkers={setColorOfMarkers}
          setColorOfGuides={setColorOfGuides}
          setMarkerIcon={setMarkerIcon}
          setGuidesIcon={setGuidesIcon}
          setGetAllLocations={setGetAllLocations}
          getAllLocations={getAllLocations}
          chartModal={chartModal}
          setchartModal={setchartModal}
          geofences={geofences}
          setGeofences={setGeofences}
          setLandMarks={setLandMarks}
          landMarks={landMarks}
          isGeofencesChecked={isGeofencesChecked}
          isLandMarkChecked={isLandMarkChecked}
          setIsGeofencesChecked={setIsGeofencesChecked}
          setIsLandMarkChecked={setIsLandMarkChecked}
          L={L}
          isToggleConfigOpen={isToggleConfigOpen}
          setisToggleConfigOpen={setisToggleConfigOpen}
          t={t}
          rangeDraw={rangeDraw}
          pathSteps={pathSteps}
          setRangeDraw={setRangeDraw}
          fullPathGroup={fullPathGroup}
          workstep={workstep}
          locInfo={locInfo}
          isFromState={IsFromState}
          drawOptions={drawOptions}
          drawselectedsteps={drawselectedsteps}
        />

        <PlayVideo
          AllSteps={AllSteps}
          loading={loading}
          selectedSteps={
            getAllLocations &&
            (selectedStep === -1 || (!selectedStep && selectedStep !== 0))
              ? Object.values(AllLocations).flat()
              : selectedSteps
          }
          setStats={setStats}
          setCurrentSLocation={setCurrentSLocation}
          currentSLocation={currentSLocation}
          setSpeedCar={setSpeedCar}
          speedCar={speedCar}
          stats={stats}
          getAllLocations={getAllLocations}
          makePlayBtnDisabled={makePlayBtnDisabled}
        />

        {loading && (
          <FontAwesomeIcon
            className="mx-2 fa-spin text-info fs-4 d-block mx-auto mt-3"
            icon={faSpinner}
            size="sm"
          />
        )}

        <div>
          {Object.values(AllSteps).length ? (
            <p className="mt-3 d-flex justify-content-between align-items-center">
              <h4>{t("All_Steps")}</h4>

              <Button
                size="sm"
                className="d-flex align-items-center justify-content-between gap-2 px-2 py-1"
                onClick={() =>
                  handleExport(Object.values(AllSteps), "All Steps")
                }
              >
                <span>{t("Export")}</span> <SiMicrosoftexcel />
              </Button>
            </p>
          ) : (
            ""
          )}
        </div>

        <Stepper
          nonLinear
          activeStep={selectedStep}
          orientation="vertical"
          className="p-0 pe-1 mt-4"
          style={{
            overflowY: !Object.keys(AllSteps ?? {})?.length && "hidden",
            overflowX: !Object.keys(AllSteps ?? {})?.length ? "auto" : "hidden",
          }}
        >
          {Object.values(AllSteps ?? {})?.map((item, index) => {
            var hours = formatHourNumber(Math.floor(item?.Duration / 3600));
            var minutes = formatHourNumber(
              Math.floor((item?.Duration % 3600) / 60)
            );
            var seconds = formatHourNumber(item?.Duration % 60);
            return (
              <Step key={item?.ID}>
                <StapperContent
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  item={item}
                  loading={loading}
                  index={index}
                  handleClose={handleClose}
                  handleselectedStep={handleselectedStep}
                  step={AllLocations[item.ID]}
                  locInfo={locInfo}
                  makePlayBtnDisabled={makePlayBtnDisabled}
                />
              </Step>
            );
          })}

          {!Object.keys(AllSteps ?? {})?.length && !loading && (
            <div>
              <div className="col-md-12 text-center">
                <i className="fas fa-info-circle p-2 text-info fs-4"></i>
                <h5>
                  {msgEmptyData ? msgEmptyData : t("Select_a_valid_date")}
                </h5>
              </div>
            </div>
          )}
        </Stepper>
      </Card>
    </>
  );
};

export default StepperComp;
