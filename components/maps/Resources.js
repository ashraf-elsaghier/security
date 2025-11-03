﻿import moment from "moment";
import { Saferoad } from "./leafletchild";
import * as translation from "../../public/assets/map-translation.js";
import { CalcDuration } from "helpers/helpers";
export var Resources = getResources();

// export var popupData = getPopupData();

function getResources() {
  var Icons = {
    RecordDateTime: "fas fa-clock",
    Speed: "fas fa-tachometer-alt",
    Direction: "fab fa-safari",
    EngineStatus: "fab fa-whmcs",
    VehicleStatus: "fas fa-wifi",
    Mileage: "fas fa-expand-alt",
    Duration: "far fa-hourglass",
    DriverUrl: "far fa-user",
    GroupName: "fas fa-users-cog",
    PlateNumber: "fab fa-deploydog",
    SimCardNumber: "fas fa-sim-card",
    SerialNumber: "fas fa-barcode",
    IgnitionStatus: "fas fa-plug",
    weightreading: "fas fa-weight-hanging",
    Temp: "fas fa-temperature-low",
    HUM: "fas fa-wind",
    Address: "fas fa-map-marked-alt",
    VehicleID: "fas fa-key",
    SeatBelt: "fa-solid fa-user-shield",
    LangLat: "fa-solid fa-location-dot",
    Invalid: "fa-solid fa-list-check",
    IsPowerCutOff: "fa-solid fa-satellite-dish",
    VehicleViolation: "fa-solid fa-ban",
    RPM: "fas fa-cogs",
    CoolantTemp: "fas fa-thermometer-half",
    TotalMileage: "fas fa-road",
    VIN: "fas fa-fingerprint",
    FuelLevelLiter: "fas fa-gas-pump",
    FuelLevelPer: "fas fa-percent",
    FuelPressure: "fas fa-compress-arrows-alt",
    HybridVoltage: "fas fa-bolt",
  };
  var resources = {
    Tips: {
      RecordDateTime: "Record Date",
      Speed: "Speed",
      Direction: "Direction",
      EngineStatus: "Engine Status",
      VehicleStatus: "Vehicle Status",
      Mileage: "Mileage",
      Duration: "Duration",
      DriverUrl: "Driver Name",
      GroupName: "Group Name",
      PlateNumber: "Plate Number",
      SimCardNumber: "Sim Number",
      SerialNumber: "Serial Number",
      IgnitionStatus: "Ignition Control",
      weightreading: "Actual Weight",
      Temp: "Temperature Sensor 1",
      HUM: "Humidity Sensor 1",
      Address: "Address",
      NA: "Not Available",
      DriverNA: "No Driver",
      AllGroups: "All Groups",
      SeatBelt: "Seat Belt",
    },
    Icons: Icons,
    Actions: {
      Title: "Options",
      FullHistory: "Full History PlayBack",
      EditInformation: "Edit Information",
      CalibrateMileage: "Calibrate Mileage",
      CalibrateWeight: "Calibrate Weight",
      ShareLocation: "Share Location",
      SubmitCommand: "Submit New Command",
      DisableVehicle: "Disable Vehicle",
      EnableVehicle: "Enable Vehicle",
    },
    guides: {
      SelectPOint: "Please Select A point",
      NameRequired: "Please Enter the name",
      Processing: "Processing",
    },
    Status: {
      EngineOn: "On",
      EngineOff: "Off",
      VehicleOffline: "Offline",
      VehicleOverSpeed: "Over Speed",
      VehicleSleeping: "Sleep Mode",
      VehicleOverStreetSpeed: "OverStreet Speed",
      VehicleStopped: "Stopped",
      VehicleRunning: "Running",
      VehicleIdle: "Idle",
      VehicleInvalid: "Invalid Status",
      IgnitionEnabled: "Installed",
      IgnitionDisabled: "Not Installed",
    },
    paymentLabels: {
      cardNumber: "Card Number",
      expirationDate: "MM/YY",
      cvv: "CVV",
      cardHolder: "Card Holder Name",
    },
  };

  //   if ("body".attr("data-lang") == "ar") {
  //     resources = {
  //       Tips: {
  //         RecordDateTime: "تاريخ الحركة",
  //         Speed: "السرعة",
  //         Direction: "الاتجاه",
  //         EngineStatus: "حالة المحرك",
  //         VehicleStatus: "حالة المركبات",
  //         Mileage: "الاميال (كم)",
  //         Duration: "المدة",
  //         DriverUrl: "اسم السائق",
  //         GroupName: "اسم المجموعة",
  //         PlateNumber: "رقم اللوحة",
  //         SimCardNumber: "الرقم التسلسلي للشريحة",
  //         SerialNumber: "الرقم التسلسلي للجهاز",
  //         IgnitionStatus: "جهاز تحكم التشغيل",
  //         weightreading: "الوزن الفعلي",
  //         Temp: "حساس الحرارة 1",
  //         HUM: "حساس الرطوبة 1",
  //         Address: "العنوان",
  //         NA: "غير متاح",
  //         DriverNA: "غير معرف",
  //         AllGroups: "الجميع",
  //       },
  //       Icons: Icons,
  //       Actions: {
  //         Title: "خيارات",
  //         FullHistory: "تتبع التاريخ كاملا للمركبة",
  //         EditInformation: "تحرير معلومات المركبة",
  //         CalibrateMileage: "إعادة تعيين الأميال",
  //         CalibrateWeight: "إعادة تعين اعدادات الوزن",
  //         ShareLocation: "مشاركة الموقع",
  //         SubmitCommand: "تقديم امر جديد",
  //         DisableVehicle: "ايقاف التشغيل",
  //         EnableVehicle: "السماح بالتشغيل",
  //       },
  //       guides: {
  //         SelectPOint: "الرجاء اختيار الموقع",
  //         NameRequired: "الرجاء ادخال الاسم",
  //         Processing: "تحميل",
  //       },
  //       Status: {
  //         EngineOn: "تعمل",
  //         EngineOff: "لا تعمل",
  //         VehicleOffline: "مطفئة",
  //         VehicleOverSpeed: "تجاوز السرعة",
  //         VehicleOverStreetSpeed: "تجاوز سرعة الطريق",
  //         VehicleStopped: "متوقفة",
  //         VehicleRunning: "تسير",
  //         VehicleIdle: "سكون",
  //         VehicleInvalid: "حالة مجهولة",
  //         IgnitionEnabled: "مركب",
  //         IgnitionDisabled: "غير مركب",
  //       },
  //       paymentLabels: {
  //         cardNumber: "رقم البطاقة",
  //         expirationDate: "MM/YY",
  //         cvv: "CVV",
  //         cardHolder: "اسم حامل البطاقة",
  //       },
  //     };
  //   }

  return resources;
}

const getIconPopup = (id) => Resources.Icons[id];

const getAvg = (vals, navalue, dev = 1) => {
  vals = vals.filter((x) => x && x != navalue && !isNaN(x));
  let avg = !vals.length
    ? navalue
    : vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg == navalue ? navalue : avg / dev;
};

// This Function of all data in popup in track and historyplayback pages
export function popupData(locInfo) {
  var currentLocale;
  let lang;
  if (window.location.pathname.split("/")[1] === "ar") {
    currentLocale = translation.mapArabic;
    lang = "ar/";
  } else if (window.location.pathname.split("/")[1] === "fr") {
    currentLocale = translation.mapFrench;
    lang = "fr/";
  } else if (window.location.pathname.split("/")[1] === "es") {
    currentLocale = translation.mapSpanish;
    lang = "es/";
  } else {
    currentLocale = translation.mapEnglish;
    lang = "";
  }
  var driver = () =>
    (locInfo?.DriverID ?? locInfo?.IButtonID) != null
      ? `<span> ${
          !isNaN(locInfo?.DriverID ?? locInfo?.IButtonID)
            ? locInfo?.DriverName
            : ` ${
                locInfo?.DriverID?.substring(0, 10)?.padEnd(13, ".") ??
                locInfo?.IButtonID?.substring(0, 10)?.padEnd(13, ".")
              }`
        }</span>`
      : currentLocale.DriverNA;

  return [
    {
      id: "RecordDateTime",
      Tooltip: currentLocale.Record_Date,
      val: moment(moment.parseZone(locInfo?.RecordDateTime))
        .local()
        .format("LL hh:mm:ss a"),
      icon: getIconPopup("RecordDateTime"),
    },
    {
      id: "VehicleID",
      Tooltip: currentLocale.Vehicle_ID,
      val: locInfo?.VehicleID,
      unit: "",
      icon: getIconPopup("VehicleID"),
    },
    {
      id: "Speed",
      Tooltip: currentLocale.Speed,
      val:
        Math.floor(locInfo?.Speed) === locInfo?.Speed ||
        locInfo?.Speed === null ||
        locInfo?.Speed === undefined
          ? locInfo?.Speed
          : locInfo?.Speed.toFixed(0),
      unit: "km/h",
      icon: getIconPopup("Speed"),
    },
    {
      id: "Direction",
      Tooltip: currentLocale.Direction,
      val: locInfo?.Direction ?? currentLocale.Unknown + " &deg;",
      icon: getIconPopup("Direction"),
    },

    {
      id: "VehicleStatus",
      Tooltip: currentLocale.Vehicle_Status,
      val:
        Saferoad.Popup.Helpers.VStatusToStr(locInfo?.VehicleStatus) ??
        currentLocale.Unknown,
      icon: getIconPopup("VehicleStatus"),
    },
    {
      id: "VehicleViolation",
      Tooltip: currentLocale.Vehicle_Violation,
      val:
        Saferoad.Popup.Helpers.ViolationsToStr(locInfo?.AlarmCode) ?? "Unknown",
      icon: getIconPopup("VehicleViolation"),
    },
    {
      id: "EngineStatus",
      Tooltip: currentLocale.EngineStatus,
      val:
        Saferoad.Popup.Helpers.EStatusToStr(locInfo?.EngineStatus) ??
        currentLocale.Unknown,
      unit: "",
      icon: getIconPopup("EngineStatus"),
    },
    {
      id: "Mileage",
      Tooltip: currentLocale.Mileage,
      val: locInfo?.Mileage
        ? (locInfo?.Mileage / 1000).toFixed(2)
        : currentLocale.Unknown,
      unit: "KM",
      icon: getIconPopup("Mileage"),
    },
    {
      id: "Duration",
      Tooltip: currentLocale.Duration,
      val: CalcDuration(locInfo?.Duration) ?? currentLocale.Unknown,
      unit: "",
      icon: getIconPopup("Duration"),
    },
    {
      id: "DriverName",
      Tooltip: currentLocale.Driver_Name,
      val: driver(),
      icon: getIconPopup("DriverUrl"),
      DriverID: locInfo?.DriverID || locInfo?.IButtonID || locInfo?.RFID,
    },

    {
      id: "GroupName",
      Tooltip: currentLocale.Group_Name,
      val: locInfo?.GroupName ?? currentLocale.UnGrouped,
      icon: getIconPopup("GroupName"),
    },
    {
      id: "PlateNumber",
      Tooltip: currentLocale.PlateNumber,
      val: locInfo?.PlateNumber ?? currentLocale.Unknown,
      unit: "",
      icon: getIconPopup("PlateNumber"),
    },
    {
      id: "SimSerialNumber",
      Tooltip: currentLocale.SimNumber,
      val: locInfo?.SimSerialNumber ?? currentLocale.Unknown,
      unit: "",
      icon: getIconPopup("SimCardNumber"),
    },
    {
      id: "SerialNumber",
      Tooltip: currentLocale.SerialNumber,
      val: locInfo?.SerialNumber ?? currentLocale.Unknown,
      icon: getIconPopup("SerialNumber"),
    },
    {
      id: "IgnitionStatus",
      Tooltip: currentLocale.IgnitionControl,
      val:
        Saferoad.Popup.Helpers.IgnitionToStr(locInfo?.IgnitionStatus) ??
        currentLocale.Unknown,
      icon: getIconPopup("IgnitionStatus"),
    },
    {
      id: "TotalWeight",
      Tooltip: currentLocale.ActualWeight,
      val:
        locInfo?.WeightReading > 0
          ? locInfo?.WeightReading
          : currentLocale.Unknown,
      unit: locInfo?.WeightReading > 0 ? "kg" : "",
      icon: getIconPopup("weightreading"),
    },
    {
      id: "Temp1",
      Tooltip: currentLocale.temperature,
      val:
        getAvg(
          [locInfo?.Temp1, locInfo?.Temp2, locInfo?.Temp3, locInfo?.Temp4],
          3000,
          10
        ) == 3000
          ? currentLocale.NotAvailable
          : getAvg(
              [locInfo?.Temp1, locInfo?.Temp2, locInfo?.Temp3, locInfo?.Temp4],
              3000,
              10
            ),
      unit:
        getAvg(
          [locInfo?.Temp1, locInfo?.Temp2, locInfo?.Temp3, locInfo?.Temp4],
          3000,
          10
        ) == 3000
          ? ""
          : "C",
      icon: getIconPopup("Temp"),
    },

    {
      id: "Hum1",
      Tooltip: currentLocale.HumiditySensor1,
      val:
        getAvg(
          [locInfo?.Hum1, locInfo?.Hum2, locInfo?.Hum3, locInfo?.Hum4],
          -1,
          10
        ) == -1
          ? currentLocale.NotAvailable
          : getAvg(
              [locInfo?.Hum1, locInfo?.Hum2, locInfo?.Hum3, locInfo?.Hum4],
              -1,
              10
            ),
      unit:
        getAvg(
          [locInfo?.Hum1, locInfo?.Hum2, locInfo?.Hum3, locInfo?.Hum4],
          -1,
          10
        ) == -1
          ? ""
          : "%",

      icon: getIconPopup("HUM"),
    },
    {
      id: "SeatBelt",
      Tooltip: currentLocale.SeatBelt,
      val: locInfo?.SeatBelt
        ? currentLocale.Yes
        : currentLocale.No ?? currentLocale.No,
      icon: getIconPopup("SeatBelt"),
    },
    {
      id: "Latitude , Longitude",
      Tooltip: currentLocale.LatitudeLongitude,
      val: `${locInfo?.Latitude ?? currentLocale.Unknown} , ${
        locInfo?.Longitude ?? currentLocale.Unknown
      }`,
      icon: getIconPopup("LangLat"),
    },
    {
      id: "Invalid",
      Tooltip: currentLocale.Invalid_Locations,
      val:
        !locInfo?.EngineStatus && +locInfo.Speed > 0
          ? currentLocale.Yes
          : currentLocale.No ?? currentLocale.Unknown,
      icon: getIconPopup("Invalid"),
    },
    {
      id: "IsPowerCutOff",
      Tooltip: currentLocale.IsPowerCutOff,
      val: locInfo?.IsPowerCutOff
        ? currentLocale.Yes
        : currentLocale.No ?? currentLocale.No,
      icon: getIconPopup("IsPowerCutOff"),
    },

    {
      id: "RPM",
      Tooltip: currentLocale.RPM,
      val: locInfo?.RPM ?? 0,
      unit: "RPM",
      icon: getIconPopup("RPM"),
    },
    {
      id: "CoolantTemp",
      Tooltip: currentLocale.CoolantTemp,
      val: locInfo?.CoolantTemp ?? currentLocale.Unknown,
      unit: "°C",
      icon: getIconPopup("CoolantTemp"),
    },
    {
      id: "TotalMileage",
      Tooltip: currentLocale.TotalMileage,
      val: locInfo?.TotalMileage
        ? (locInfo?.TotalMileage / 1000).toFixed(2)
        : 0,
      unit: "KM",
      icon: getIconPopup("TotalMileage"),
    },
    {
      id: "VIN",
      Tooltip: currentLocale.VIN,
      val: locInfo?.VIN ?? currentLocale.Unknown,
      unit: "",
      icon: getIconPopup("VIN"),
    },
    {
      id: "FuelLevelLiter",
      Tooltip: currentLocale.FuelLevelLiter,
      val: locInfo?.FuelLevelLiter ?? 0,
      unit: "L",
      icon: getIconPopup("FuelLevelLiter"),
    },
    {
      id: "FuelLevelPer",
      Tooltip: currentLocale.FuelLevelPer,
      val: locInfo?.FuelLevelPer ?? 0,
      unit: "%",
      icon: getIconPopup("FuelLevelPer"),
    },
    {
      id: "FuelPressure",
      Tooltip: currentLocale.FuelPressure,
      val: locInfo?.FuelPressure ?? 0,
      unit: "bar",
      icon: getIconPopup("FuelPressure"),
    },
    {
      id: "HybridVoltage",
      Tooltip: currentLocale.HybridVoltage,
      val: locInfo?.HybridVoltage ?? currentLocale.Unknown,
      unit: "V",
      icon: getIconPopup("HybridVoltage"),
    },
    {
      id: "Address",
      Tooltip: currentLocale.Address,
      val: locInfo?.Address ?? currentLocale.Unknown,
      icon: getIconPopup("Address"),
    },
  ];
}
