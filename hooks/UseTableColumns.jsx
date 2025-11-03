import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import moment from "moment";
const UseTableColumns = () => {
  const { t } = useTranslation("Table");

  // Convert the UTC time to local time
  const handlePeriodLocal = (params) => {
    let strData = moment.utc(
      params?.data?.Period?.split("TO")[0],
      "YYYY-MM-DD HH:mm:ss"
    );
    let endData = moment.utc(
      params?.data?.Period?.split("TO")[1],
      "YYYY-MM-DD HH:mm:ss"
    );

    return `${strData.local().format("YYYY-MM-DD HH:mm:ss")} To: ${endData
      .local()
      .format("YYYY-MM-DD HH:mm:ss")}`;
  };

  function isFloat(n) {
    return n % 1 !== 0;
  }

  const handleToFixed = (data) => (isFloat(data) ? +data?.toFixed(2) : +data);

  const handleToFixedDistance = (params) =>
    handleToFixed(+params?.data?.Distance);

  const handleToFixedFuleL = (params) => {
    return params?.data?.fule_L !== undefined
      ? +params?.data?.fule_L?.toFixed(2)
      : 0;
  };

  const handleToFixedFuel_SR = (params) =>
    params?.data?.fuel_SR !== undefined ? +params?.data?.fuel_SR.toFixed(2) : 0;

  const handleToFixedAvgWeight = (params) => {
    let AvgWeight = isFloat(+params?.data?.AvgWeight)
      ? +params?.data?.AvgWeight?.toFixed(2)
      : +params?.data?.AvgWeight;
    return +AvgWeight;
  };

  const handleMongoDate = (value) =>
    moment(moment.parseZone(value)).local().format("YYYY-MM-DD HH:mm:ss");

  const createMapUrl = (lat, lng, address) => {
    var linkText = document.createTextNode(address);
    const resultElement = document.createElement("a");
    resultElement.appendChild(linkText);
    resultElement.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    resultElement.target = "_blank";
    return resultElement;
  };

  class MapRenderer {
    init(params) {
      const coordinates = params.data.Coordinates.split(",");
      this.eGui = createMapUrl(
        coordinates[0],
        coordinates[1],
        params.data.Address
      );
    }
    getGui() {
      return this.eGui;
    }
  }

  class TripStrMapRenderer {
    init(params) {
      this.eGui = createMapUrl(
        params.data.StrLat,
        params.data.StrLng,
        params.data.StrAddress
      );
    }
    getGui() {
      return this.eGui;
    }
  }
  class TripEndMapRenderer {
    init(params) {
      this.eGui = createMapUrl(
        params.data.EndLat,
        params.data.EndLng,
        params.data.StrAddress
      );
    }
    getGui() {
      return this.eGui;
    }
  }

  const handleDAT_Score = (params) => `${params?.data?.DAT_Score}%`;

  const handleGroupName = (params) => {
    if (params?.data?.Group_Name) {
      return params?.data?.Group_Name == null
        ? "Ungrouped"
        : params?.data?.Group_Name;
    } else {
      return params?.data?.GroupName == null
        ? "Ungrouped"
        : params?.data?.GroupName;
    }
  };

  const handleSeatBelt = (params) => {
    return params?.data?.SeatBeltStatus === "yes" ? t("True") : t("False");
  };
  const handleEngine = (params) => {
    return params?.data?.EngineStatus === "on" ? t("True") : t("False");
  };

  let filterParamsForDate = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      const originalDate = new Date(cellValue);
      originalDate.setHours(0);
      originalDate.setMinutes(0);
      originalDate.setSeconds(0);
      originalDate.setMilliseconds(0);

      return new Date(originalDate) < filterLocalDateAtMidnight
        ? -1
        : new Date(originalDate) > filterLocalDateAtMidnight
        ? 1
        : 0;
    },
  };

  const Working_Hours_and_Mileage_Daily_BasisColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        // valueGetter: handlePeriod,
        valueGetter: handlePeriodLocal,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },

      {
        headerName: `${t("StrLat")}`,
        field: "StrLat",
      },
      {
        headerName: `${t("EndLat")}`,
        field: "EndLat",
      },
      {
        headerName: `${t("StrLng")}`,
        field: "StrLng",
      },
      {
        headerName: `${t("EndLng")}`,
        field: "EndLng",
      },

      {
        headerName: `${t("W.Hours")}`,
        field: "Duration",
        valueGetter: (params) => {
          let regex = /(\d+) Days/;
          let matches = regex.exec(params.data.Duration);
          if (matches && matches.length > 1) {
            let days = parseInt(matches[1]);

            // Add a leading zero if the number of days is less than 10
            let formattedDays = days.toString().padStart(2, "0");

            // Replace the original number of days with the formatted one
            let output = params.data.Duration.replace(
              regex,
              formattedDays + " Days"
            );
            return output;
          } else {
            return "0 Days " + params.data.Duration;
          }
        },
        // valueGetter: (params) => (params?.data?.Duration / 3600).toFixed(2),
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("DriverID")}`,
        field: "DriverID",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("history_playback")}`,
        cellRenderer: (param) => {
          return (
            <a
              target="_blank"
              href={`/history?&VehID=${param?.data?.VehicleID}&Period=${
                param?.data?.Period.split("T")[0]
              }`}
            >
              {" "}
              {t("View History")}{" "}
            </a>
          );
        },
      },
    ],
    [t]
  );

  const Working_Hours_and_Mileage_PeriodColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,

        // fix Sorting
        comparator: (valueA, valueB, nodeA, nodeB, isDescending) =>
          valueA - valueB,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "Duration",
        valueGetter: (params) => {
          let regex = /(\d+) Days/;
          let matches = regex.exec(params.data.Duration);
          if (matches && matches.length > 1) {
            let days = parseInt(matches[1]);

            // Add a leading zero if the number of days is less than 10
            let formattedDays = days.toString().padStart(2, "0");

            // Replace the original number of days with the formatted one
            let output = params.data.Duration.replace(
              regex,
              formattedDays + " Days"
            );
            return output;
          } else {
            return "0 Days " + params.data.Duration;
          }
        },
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
        // valueGetter: handleFullName,
      },
      {
        headerName: `${t("DriverID")}`,
        field: "DriverID",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const Custom_Running_TimeColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },

      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "Duration",
        // valueGetter: (params) => (params?.data?.Duration / 3600).toFixed(2),
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("F.Cost_SR")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const Trip_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },

      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("DriverID")}`,
        field: "DriverID",
        valueGetter: (param) =>
          param?.data?.DriverID ? param?.data?.DriverID : "N/A",
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "StrDate",
        valueGetter: (params) => handleMongoDate(params.data.StrDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("End_Time")}`,
        field: "EndDate",
        valueGetter: (params) => handleMongoDate(params.data.EndDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("Idle Time")}`,
        field: "idleTime",
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
        filter: "agNumberColumnFilter",
      },
      // {
      //   headerName: `${t("AVG_Speed")}`,
      //   field: "avgSpeed",
      //   filter: "agNumberColumnFilter",
      //   // valueGetter: handleToAvgSpeed,
      // },
      {
        headerName: `${t("Start_Address")}`,
        field: "StrAddress",
        cellRenderer: TripStrMapRenderer, //({ data }) => getMapUrl(data?.Latitude ?? 0, data?.Longitude ?? 0),
        cellRendererParams: {},
      },
      {
        headerName: `${t("End_Address")}`,
        field: "EndAddress",
        cellRenderer: TripEndMapRenderer, //({ data }) => getMapUrl(data?.Latitude ?? 0, data?.Longitude ?? 0),
        cellRendererParams: {},
      },
      {
        headerName: `${t("Start_Coordinate")}`,
        field: "startCoordinates",
        // valueGetter: ({ data }) =>
        //   `(${(data?.StrLat || 0).toFixed(5)}, ${(data?.StrLng || 0).toFixed(
        //     5
        //   )})`,
      },
      {
        headerName: `${t("End_Coordinate")}`,
        field: "endCoordinates",

        // valueGetter: ({ data }) =>
        //   `(${(data?.EndLat || 0).toFixed(5)}, ${(data?.EndLng || 0).toFixed(
        //     5
        //   )})`,
      },
    ],
    [t]
  );

  const Fuel_Summary_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const Driver_LoggingColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("DriverID")}`,
        field: "DriverID",
        valueGetter: (param) =>
          param?.data?.DriverID ? param?.data?.DriverID : "N/A",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const Driving_Statistics_Per_PeriodColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("DriverID")}`,
        field: "DriverID",
        valueGetter: (param) =>
          param?.data?.DriverID ? param?.data?.DriverID : "N/A",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
        filter: "agTextColumnFilter",
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "W_hours",
      },
      {
        headerName: `${t("Rapid_Acceleration")}`,
        field: "RapidAccel",
      },
      {
        headerName: `${t("MaxSpeedStrDate")}`,
        field: "MaxSpeedStrDate",
        valueGetter: (params) => handleMongoDate(params.data.MaxSpeedStrDate),
      },
      {
        headerName: `${t("MaxSpeedStrLng")}`,
        field: "MaxSpeedStrLng",
      },
      {
        headerName: `${t("MaxSpeedStrLat")}`,
        field: "MaxSpeedStrLat",
      },
      {
        headerName: `${t("Harsh_Braking_count")}`,
        field: "HarshBraking",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Overspeed")}`,
        field: "OverSpeed",

        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",

        filter: "agNumberColumnFilter",
      },

      {
        headerName: `${t("DAT_Score")}`,
        field: "DAT_Score",
        cellStyle: (params) => {
          if (params?.data?.DAT_Score < 50) {
            return { backgroundColor: "#f01e2c" };
          } else if (params?.data?.DAT_Score < 75) {
            return { backgroundColor: "#e5de00" };
          } else if (params?.data?.DAT_Score >= 75) {
            return { backgroundColor: "#32cd32" };
          }
        },
        defaultSort: "desc",
        sortable: true,
        valueGetter: handleDAT_Score,
        comparator: function (valueA, valueB) {
          return +valueA.replace("%", "") - +valueB.replace("%", "");
        },
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );
  const geoOverSpeedColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Record_Date_Time")}`,
        field: "RecordDateTime",
        valueGetter: (params) => handleMongoDate(params.data.RecordDateTime),
      },
      {
        headerName: `${t("Geo_Name")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoID",
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Address")}`,
        field: "Address",
      },
      {
        headerName: `${t("Coordinates")}`,
        field: "Coordinates",
      },
      {
        headerName: `${t("SerialNumber")}`,
        field: "SerialNumber",
      },
      {
        headerName: `${t("Vehicle Geo ID")}`,
        field: "VehGeoID",
      },
    ],
    [t]
  );

  const Zone_ActivityColumn = useMemo(
    () => [
      {
        headerName: `${t("Group")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoID",
      },
      {
        headerName: `${t("Geo_Name")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("DriverName")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      // {
      //   headerName: `${t("Enter_Zone")}`,
      //   field: "StartAddress",
      //   valueGetter: (param) =>
      //     param?.data?.StartAddress ? param.data.StartAddress : "N/A",
      // },
      {
        headerName: `${t("Start_Date")}`,
        field: "StartDate",
        valueGetter: (params) => handleMongoDate(params?.data?.StartDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      // {
      //   headerName: `${t("Exit_Zone")}`,
      //   field: "EndAddress",
      //   valueGetter: (param) =>
      //     param?.data?.EndAddress ? param.data.EndAddress : "N/A",
      // },
      {
        headerName: `${t("Finish_Date")}`,
        field: "FinishDate",
        valueGetter: (params) => handleMongoDate(params?.data?.FinishDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
        valueGetter: (params) => {
          let regex = /(\d+) Days/;
          let matches = regex.exec(params.data.Duration);
          if (matches && matches.length > 1) {
            let days = parseInt(matches[1]);

            // Add a leading zero if the number of days is less than 10
            let formattedDays = days.toString().padStart(2, "0");

            // Replace the original number of days with the formatted one
            let output = params.data.Duration.replace(
              regex,
              formattedDays + " Days"
            );
            return output;
          } else {
            return "0 Days " + params.data.Duration;
          }
        },
        // valueGetter: (params) =>
        //   formatDurationV2(params?.data?.Duration || 0 * 1e3, 5),

        // formatDurDates(params?.data?.EnterTime, params?.data?.ExitTime, 5),
      },
    ],
    [t]
  );

  const Geofences_LogColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        // filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoID",
      },
      {
        headerName: `${t("Geo_Name")}`,
        field: "GeoName",
      },

      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Operation")}`,
        field: "Operation",
      },
      {
        headerName: `${t("Time")}`,
        field: "RecordDateTime",
        valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("End_Coordinates")}`,
        field: "EndCoordinates",
      },
    ],
    [t]
  );

  const Zones_Summary_ActivitiesColumn = useMemo(
    () => [
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1geoname",
      },
      {
        headerName: `${t("Number_of_Vehicle")}`,
        field: "numberofVehicle",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Trip_count")}`,
        field: "countTrips",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
        valueGetter: (params) => {
          let regex = /(\d+) Days/;
          let matches = regex.exec(params.data.Duration);
          if (matches && matches.length > 1) {
            let days = parseInt(matches[1]);

            // Add a leading zero if the number of days is less than 10
            let formattedDays = days.toString().padStart(2, "0");

            // Replace the original number of days with the formatted one
            let output = params.data.Duration.replace(
              regex,
              formattedDays + " Days"
            );
            return output;
          } else {
            return "0 Days " + params.data.Duration;
          }
        },
        // valueGetter: (params) =>
        //   formatDurationV2(params?.data?.Duration || 0 * 1e3, 5),
      },
      {
        headerName: `${t("During_Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
    ],
    [t]
  );

  const Zones_Summary_Activities_DailyColumn = useMemo(
    () => [
      // {
      //   headerName: `${t("Vehicle_Id")}`,
      //   field: "VehicleID",
      // },
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1geoname",
      },
      {
        headerName: `${t("Number_of_Vehicle")}`,
        field: "numberofVehicle",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Trip_count")}`,
        field: "countTrips",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
        // valueGetter: (params) =>
        //   formatDuration(params?.data?.Duration || 0 * 1e3, 5),
      },
      {
        headerName: `${t("During_Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
    ],
    [t]
  );

  const In_Zone_DetailsColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoId",
      },
      {
        headerName: `${t("Zone_Name")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("Zone_In_Time")}`,
        field: "zoneIn",
        valueGetter: ({ data }) => handleMongoDate(data?.zoneIn),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Zone_Out_time")}`,
        field: "zoneOut",
        valueGetter: ({ data }) => handleMongoDate(data?.zoneOut),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("In_Zone_Duration")}`,
        field: "Duration",
        valueGetter: (params) => {
          let regex = /(\d+) Days/;
          let matches = regex.exec(params.data.Duration);
          if (matches && matches.length > 1) {
            let days = parseInt(matches[1]);

            // Add a leading zero if the number of days is less than 10
            let formattedDays = days.toString().padStart(2, "0");

            // Replace the original number of days with the formatted one
            let output = params.data.Duration.replace(
              regex,
              formattedDays + " Days"
            );
            return output;
          } else {
            return "0 Days " + params.data.Duration;
          }
        },
        // valueGetter: (params) =>
        //   formatDurDates(params?.data?.zoneIn, params?.data?.zoneOut, 4),
        // valueGetter: handleinZone_Duration,
      },
    ],
    [t]
  );

  const In_Zone_SummaryColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoID",
      },
      {
        headerName: `${t("Zone_Name")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("count_Trips")}`,
        field: "countTrips",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("In_Zone_Duration")}`,
        field: "Duration",
        // valueGetter: (params) =>
        //   formatDurDates(params?.data?.zoneIn, params?.data?.zoneOut, 5),
      },
    ],
    [t]
  );
  const non_Contracted_GeoFencesColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("FinishSpeed")}`,
        field: "FinishSpeed",
      },
      {
        headerName: `${t("StartSpeed")}`,
        field: "StartSpeed",
      },
      {
        headerName: `${t("Geo_ID")}`,
        field: "GeoID",
      },
      {
        headerName: `${t("GeoName")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("EndCoordinates")}`,
        field: "EndCoordinates",
      },
      {
        headerName: `${t("Record_Date_Time")}`,
        field: "RecordDateTime",
        valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
    ],
    [t]
  );
  const last_vehicle_statusColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      // {
      //   headerName: `${t("Group_Name")}`,
      //   field: "GroupName",
      // },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Latitude")}`,
        field: "Latitude",
      },
      {
        headerName: `${t("Longitude")}`,
        field: "Longitude",
      },
      {
        headerName: `${t("Geo_Name")}`,
        field: "geoName",
      },
      { headerName: `${t("Geo_ID")}`, field: "geoID" },
      {
        headerName: `${t("status")}`,
        field: "status",
      },
    ],
    [t]
  );

  const Weight_Statistics_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },

      {
        headerName: `${t("Time")}`,
        field: "Time",
        valueGetter: ({ data }) => handleMongoDate(data?.Time),
      },

      {
        headerName: `${t("Avg_weight")}`,
        field: "AvgWeight",
        valueGetter: handleToFixedAvgWeight,
      },

      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const Weight_Detailed_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Time")}`,
        field: "Time",
        valueGetter: ({ data }) => handleMongoDate(data?.Time),
      },
      {
        headerName: `${t("weight")}`,
        field: "weight",
      },
      {
        headerName: `${t("Voltage_Reading")}`,
        field: "VoltageReading",
      },
      {
        headerName: `${t("Weight Volt")}`,
        field: "WeightVolt",
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
        filter: "agNumberColumnFilter",
      },

      {
        headerName: `${t("Speed_Limit")}`,
        field: "speedLimit",
      },
      {
        headerName: `${t("Vehicle_Status")}`,
        field: "VehicleStatus",
        valueGetter: ({ data }) =>
          data?.VehicleStatus ? data?.VehicleStatus : "N/A",
      },
    ],
    [t]
  );

  const Temperature_Summary_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      // {
      //   headerName: `${t("Serial_Number")}`,
      //   field: "SerialNumber",
      // },
      {
        headerName: `${t("Period")}`,
        field: "Period",
        valueGetter: handlePeriodLocal,
      },
      {
        headerName: `${t("Max_T1")}`,
        field: "MaxT1",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Min_T1")}`,
        field: "MinT1",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Max_T2")}`,
        field: "MaxT2",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Min_T2")}`,
        field: "MinT2",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Max_T3")}`,
        field: "MaxT3",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Min_T3")}`,
        field: "MinT3",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Max_T4")}`,
        field: "MaxT4",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Min_T4")}`,
        field: "MinT4",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("AVG_T3")}`,
        field: "avgT3",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Avg_T4")}`,
        field: "avgT4",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Max_Hum")}`,
        field: "MaxHum",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Min_Hum")}`,
        field: "MinHum",
        filter: "agNumberColumnFilter",
      },
    ],
    [t]
  );

  const Temperature_Detailed_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },

      {
        headerName: `${t("Record_Date_Time")}`,
        field: "RecordDateTime",
        valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Temp1")}`,
        field: "Temp1",
      },
      {
        headerName: `${t("Temp2")}`,
        field: "Temp2",
      },
      {
        headerName: `${t("Temp3")}`,
        field: "Temp3",
      },
      {
        headerName: `${t("Temp4")}`,
        field: "Temp4",
      },
      {
        headerName: `${t("Hum1")}`,
        field: "Hum1",
      },
      {
        headerName: `${t("Hum2")}`,
        field: "Hum2",
      },
      {
        headerName: `${t("Hum3")}`,
        field: "Hum3",
      },
      {
        headerName: `${t("Hum4")}`,
        field: "Hum4",
      },
      {
        headerName: `${t("Vehicle_Status")}`,
        field: "VehicleStatus",
      },
      {
        headerName: `${t("Address")}`,
        field: "Address",
      },
    ],
    [t]
  );

  const Speed_Over_Duration_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "StrDate",
        valueGetter: ({ data }) => handleMongoDate(data?.StrDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("End_Time")}`,
        field: "EndDate",
        valueGetter: ({ data }) => handleMongoDate(data?.EndDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Start_Address")}`,
        field: "StrAddress",
        cellRenderer: TripStrMapRenderer, //({ data }) => getMapUrl(data?.Latitude ?? 0, data?.Longitude ?? 0),
        cellRendererParams: {},
      },
      {
        headerName: `${t("End_Address")}`,
        field: "EndAddress",
        cellRenderer: TripEndMapRenderer, //({ data }) => getMapUrl(data?.Latitude ?? 0, data?.Longitude ?? 0),
        cellRendererParams: {},
      },
      {
        headerName: `${t("Start_Coordinate")}`,
        field: "startCoordinates",
        valueGetter: ({ data }) =>
          `(${(data?.StrLat || 0).toFixed(5)}, ${(data?.StrLng || 0).toFixed(
            5
          )})`,
      },
      {
        headerName: `${t("End_Coordinate")}`,
        field: "endCoordinates",

        valueGetter: ({ data }) =>
          `(${(data?.EndLat || 0).toFixed(5)}, ${(data?.EndLng || 0).toFixed(
            5
          )})`,
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("Duration_in_Seconds")}`,
        field: "DurationInSeconds",
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("Count")}`,
        field: "Count",
        filter: "agNumberColumnFilter",
      },
    ],
    [t]
  );

  const Over_Speed_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Time")}`,
        field: "RecordDateTime",
        valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },

      {
        headerName: `${t("Over_Speed")}`,
        filter: "agNumberColumnFilter",
        field: "OverSpeed",
      },
      {
        headerName: `${t("Coordinates")}`,
        field: "Coordinates",
      },
      {
        headerName: `${t("Address")}`,
        field: "Address",
        cellRenderer: MapRenderer, //({ data }) => getMapUrl(data?.Latitude ?? 0, data?.Longitude ?? 0),
        cellRendererParams: {},
      },
    ],
    [t]
  );

  const Offline_Vehicles_ReportColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },

      {
        headerName: `${t("Last_Online_Date")}`,
        field: "lastUpdateTime",
        valueGetter: ({ data }) => handleMongoDate(data?.lastUpdateTime),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Last_Location")}`,
        field: "Address",
      },
      {
        headerName: `${t("Offline_(Days)")}`,
        field: "OfflineDays",
        // valueGetter: handleOfflineDays,
        cellStyle: (params) => {
          if (+params.data.OfflineDays >= 2) {
            //mark police cells as red
            return { backgroundColor: "#ffc0cb" };
          }
          return null;
        },
      },
    ],
    [t]
  );

  const User_VehiclesColumn = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Vehicle_Status")}`,
        field: "VehicleStatus",
      },
      {
        headerName: `${t("Last_Online_Date")}`,
        field: "lastUpdatedDate",
        valueGetter: ({ data }) => handleMongoDate(data?.lastUpdatedDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Last_Location")}`,
        field: "Address",
      },
      {
        headerName: `${t("Offline_(Days)")}`,
        field: "offlineDays",
        cellStyle: (params) => {
          if (params?.data?.offlineDays > 1) {
            //mark police cells as red
            return { backgroundColor: "#ffc0cb" };
          }
          return null;
        },
      },
    ],
    [t]
  );

  const Vehicle_Idling_and_Parking_ReportsColumn = useMemo(
    () => [
      {
        headerName: `${t("Vehicle_Id")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Status")}`,
        field: "Status",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
        // valueGetter: (params) =>
        //   formatDurationV2(params?.data?.Duration || 0 * 1e3, 5),
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "StrDate",
        valueGetter: ({ data }) => handleMongoDate(data?.StrDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("End_Time")}`,
        field: "EndDate",
        valueGetter: ({ data }) => handleMongoDate(data?.EndDate),
        filter: "agDateColumnFilter",
        filterParams: filterParamsForDate,
      },
      {
        headerName: `${t("Start_Address")}`,
        field: "StrAdd",
      },
      {
        headerName: `${t("End_Address")}`,
        field: "EndAdd",
      },
      {
        headerName: `${t("Coordinates")}`,
        field: "coordinates",
      },
    ],
    [t]
  );

  const Seatbelt_and_Door_ReportColumn = useMemo(() => [
    {
      headerName: `${t("Vehicle_Id")}`,
      field: "VehicleID",
    },
    { headerName: `${t("DisplayName")}`, field: "DisplayName" },
    { headerName: `${t("PlateNumber")}`, field: "PlateNumber" },
    {
      headerName: `${t("Group_Name")}`,
      field: "Group_Name",
      valueGetter: handleGroupName,
    },
    {
      headerName: `${t("RecordDateTime")}`,
      field: "RecordDateTime",
      valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
      filter: "agDateColumnFilter",
      filterParams: filterParamsForDate,
    },
    { headerName: `${t("Latitude")}`, field: "Latitude" },
    { headerName: `${t("Longitude")}`, field: "Longitude" },
    { headerName: `${t("Address")}`, field: "Address" },
    { headerName: `${t("DriverName")}`, field: "DriverName" },
    // { headerName: `${t("FirstName")}`, field: "FirstName" },
    // { headerName: `${t("LastName")}`, field: "LastName" },
    {
      headerName: `${t("SeatBeltStatus")}`,
      field: "SeatBeltStatus",
      valueGetter: handleSeatBelt,
    },
    {
      headerName: `${t("EngineStatus")}`,
      field: "EngineStatus",
      valueGetter: handleEngine,
    },
    { headerName: `${t("VehicleStatus")}`, field: "VehicleStatus" },
    // { headerName: `${t("Direction")}`, field: "Direction" },
    { headerName: `${t("Speed")}`, field: "Speed" },
    { headerName: `${t("Mileage")}`, field: "Mileage" },
    {
      headerName: `${t("door_status")}`,
      field: "DoorStatus",
      valueGetter: (params) => t(params.data.DoorStatus),
    },
  ]);
  const Parking_Group_ReportColumn = useMemo(() => [
    {
      headerName: `${t("Vehicle_Id")}`,
      field: "VehicleID",
    },
    { headerName: `${t("DisplayName")}`, field: "DisplayName" },
    { headerName: `${t("PlateNumber")}`, field: "PlateNumber" },
    { headerName: `${t("SerialNumber")}`, field: "SerialNumber" },
    {
      headerName: `${t("Group_Name")}`,
      field: "Group_Name",
      valueGetter: handleGroupName,
    },
    {
      headerName: `${t("startParkingDate")}`,
      field: "startParkingDate",
      valueGetter: ({ data }) =>
        data?.startParkingDate !== "N/A"
          ? handleMongoDate(data?.startParkingDate)
          : "N/A",
      filter: "agDateColumnFilter",
      filterParams: filterParamsForDate,
    },
    {
      headerName: `${t("lastUpdatedDate")}`,
      field: "lastUpdatedDate",
      valueGetter: ({ data }) => handleMongoDate(data?.lastUpdatedDate),
      filter: "agDateColumnFilter",
      filterParams: filterParamsForDate,
    },
    {
      headerName: `${t("Offline_(Days)_parking")}`,
      field: "offlineDays",
      cellStyle: (params) => {
        if (params.data.Status == "Exceeded") {
          return { backgroundColor: "#f01e2c" };
        }
        if (params.data.Status == "1 day yet") {
          return { backgroundColor: "#e5de00" };
        }
        return null;
      },
    },
    {
      headerName: `${t("Status")}`,
      field: "Status",
    },
    { headerName: `${t("Max_Allowed_Days")}`, field: "maxAllowedDays" },
    { headerName: `${t("Parking_Group_Name")}`, field: "parkingGroupName" },
    { headerName: `${t("Address")}`, field: "Address" },

    { headerName: `${t("VehicleStatus")}`, field: "VehicleStatus" },
  ]);
  const Parked_Vehicles_Summary = useMemo(() => [
    {
      headerName: `${t("Vehicle_Id")}`,
      field: "VehicleID",
    },
    { headerName: `${t("DisplayName")}`, field: "DisplayName" },
    { headerName: `${t("PlateNumber")}`, field: "PlateNumber" },
    { headerName: `${t("SerialNumber")}`, field: "SerialNumber" },
    {
      headerName: `${t("Group_Name")}`,
      field: "Group_Name",
      valueGetter: handleGroupName,
    },
    { headerName: `${t("Duration")}`, field: "Duration" },
  ]);

  const Active_Devices_SummaryColumn = useMemo(() => [
    {
      headerName: `${t("Account_ID")}`,
      field: "accountID",
      width: 350,
    },
    { headerName: `${t("Account_Name")}`, field: "accountName", width: 350 },
    {
      headerName: `${t("Offline_Count")}`,
      field: "offlineOnlineResult.offline",
    },
    {
      headerName: `${t("Online_Count")}`,
      field: "offlineOnlineResult.online",
      width: 350,
    },

    {
      headerName: `${t("Total_Count")}`,
      field: "offlineOnlineResult.total",
      width: 350,
    },
  ]);

  const Alarms_and_NotificationsColumn = useMemo(() => [
    {
      headerName: `${t("DisplayName")}`,
      field: "DisplayName",
    },
    { headerName: `${t("PlateNumber")}`, field: "PlateNumber" },
    {
      headerName: `${t("SerialNumber")}`,
      field: "SerialNumber",
    },
    {
      headerName: `${t("AlarmType")}`,
      field: "AlarmType",
    },

    {
      headerName: `${t("Address")}`,
      field: "Address",
    },
    {
      headerName: `${t("RecordDateTime")}`,
      field: "RecordDateTime",
      valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
    },
    {
      headerName: `${t("Vehicle_Id")}`,
      field: "VehicleID",
    },
  ]);

  const Ai_AlarmColumn = useMemo(() => [
    {
      headerName: `${t("Vehicle_Id")}`,
      field: "VehicleID",
    },
    {
      headerName: `${t("DisplayName")}`,
      field: "DisplayName",
    },
    { headerName: `${t("PlateNumber")}`, field: "PlateNumber" },
    {
      headerName: `${t("AlarmType")}`,
      field: "AlarmType",
    },

    {
      headerName: `${t("Address")}`,
      field: "Address",
    },
    {
      headerName: `${t("RecordDateTime")}`,
      field: "RecordDateTime",
      valueGetter: ({ data }) => handleMongoDate(data?.RecordDateTime),
    },
    {
      headerName: `${t("Group_Name")}`,
      field: "Group_Name",
      valueGetter: handleGroupName,
    },
    {
      headerName: `${t("DriverName")}`,
      field: "DriverName",
    },
  ]);

  return {
    Working_Hours_and_Mileage_Daily_BasisColumn,
    Working_Hours_and_Mileage_PeriodColumn,
    Custom_Running_TimeColumn,
    Trip_ReportColumn,
    Fuel_Summary_ReportColumn,
    Driver_LoggingColumn,
    Driving_Statistics_Per_PeriodColumn,
    geoOverSpeedColumn,
    Zone_ActivityColumn,
    Geofences_LogColumn,
    Zones_Summary_ActivitiesColumn,
    Zones_Summary_Activities_DailyColumn,
    In_Zone_DetailsColumn,
    In_Zone_SummaryColumn,
    non_Contracted_GeoFencesColumn,
    last_vehicle_statusColumn,
    Weight_Statistics_ReportColumn,
    Weight_Detailed_ReportColumn,
    Temperature_Summary_ReportColumn,
    Temperature_Detailed_ReportColumn,
    Speed_Over_Duration_ReportColumn,
    Over_Speed_ReportColumn,
    Offline_Vehicles_ReportColumn,
    User_VehiclesColumn,
    Vehicle_Idling_and_Parking_ReportsColumn,
    Seatbelt_and_Door_ReportColumn,
    Active_Devices_SummaryColumn,
    Alarms_and_NotificationsColumn,
    Ai_AlarmColumn,
    Parking_Group_ReportColumn,
    Parked_Vehicles_Summary,
  };
};

export default UseTableColumns;
