import axios from "axios";
import { useDispatch } from "react-redux";
import { locConfigModel } from "helpers/helpers";
import { addFullVehData } from "lib/slices/StreamData";
import { encryptName } from "helpers/encryptions";
import { useSession } from "next-auth/client";
import moment from "moment";
import { useState } from "react";
import StreamHelper from "helpers/streamHelper";

function useStreamDataState(VehFullData) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [session] = useSession();
  const { aggregate } = StreamHelper();

  const fetchRedisData = async () => {
    try {
      const res = await axios.post("/vehicles/lastlocations", {
        lite: 3,
        fields: [
          "SerialNumber",
          "Mileage",
          "Longitude",
          "Latitude",
          "RecordDateTime",
          "EngineStatus",
          "Speed",
          "Direction",
          "Address",
          "IButtonID",
          "IsPowerCutOff",
          "IsFuelCutOff",
          "IsCrash",
          "RPM",
          "CoolantTemp",
          "TotalMileage",
          "VIN",
          "FuelLevelLiter",
          "FuelLevelPer",
          "FuelPressure",
          "HybridVoltage",
          "Hum1",
          "Hum2",
          "Hum3",
          "Hum4",
          "Temp1",
          "Temp2",
          "Temp3",
          "Temp4",
          "Satellites",
          "DevConfig"
        ],
      });
      return res.data.data ?? [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const userData = JSON.parse(
    localStorage.getItem(encryptName("userData")) ?? "{}"
  );

  let updatedDataObj = VehFullData
    ? Object.fromEntries(VehFullData.map((x) => [x.SerialNumber, x]))
    : {};

  const apiGetVehicles = async (localExpireMin = 30, syncBtn = false) => {
    let vehStorage = {};
    let updated = false;

    vehStorage = userData["userId"] == session?.user.id ? userData : {};
    if (!localStorage.getItem(encryptName("updatedStorage"))) {
      localStorage.clear();
      vehStorage = {};
    }

    if (syncBtn) {
      localStorage.removeItem(encryptName("userData"));
      vehStorage = {};
    }

    const isStorageExpired =
      (new Date(vehStorage?.updateTime) ?? new Date(0)) <
      new Date(new Date().setMinutes(new Date().getMinutes() - localExpireMin));
    if (!vehStorage?.vehData?.length || isStorageExpired) {
      let apiData = [];
      apiData = await apiLoadVehSettings(false, syncBtn);
      apiData = Object.fromEntries(apiData.map((x) => [x?.SerialNumber, x]));
      updatedDataObj = { ...updatedDataObj, ...apiData };
      updated = true;
    } else {
      updatedDataObj = Object.fromEntries(
        vehStorage?.vehData?.map((x) => [x?.SerialNumber, x])
      );
    }

    let udo = Object.values(updatedDataObj);

    if (updated) {
      udo =
        udo.length < 4000
          ? udo
          : udo.map((x) => {
              return {
                VehicleID: x.VehicleID,
                SerialNumber: x.SerialNumber,
                DriverID: x.DriverID ?? x?.IButtonID,
                DisplayName: x.DisplayName,
                PlateNumber: x.PlateNumber,
                GroupName: x.GroupName,
                DriverName: x.DriverName,
                GroupID: x.GroupID,
                EngineStatus: x.EngineStatus,
                RecordDateTime: moment.utc(x.RecordDateTime),
                Latitude: x.Latitude,
                Longitude: x.Longitude,
                Speed: x.Speed ?? 0,
                SpeedLimit: x.SpeedLimit,
                lastTrips: x.lastTrips,
                GroupID: x.GroupID,
              };
            });
      localStorage.setItem(
        encryptName("userData"),
        JSON.stringify({
          userId: session?.user.id,
          updateTime: new Date(),
          vehData: udo,
        })
      );
      localStorage.setItem(encryptName("updatedStorage"), true);
    }
    const vehicleSerial = udo.map((vehicle) => vehicle.VehicleID);
    const serialNumbers = udo.map((vehicle) => vehicle.SerialNumber);

    // Fetch Redis data and last trips in parallel
    const [redisData] = await Promise.all([fetchRedisData(serialNumbers)]);
    // Create a map of last trips for quick lookup

    // Merge data into the result
    udo = udo.map((vehicle) => {
      const redisVehicleData = redisData.find(
        (data) => data.SerialNumber === vehicle.SerialNumber
      );

      const updatedVehicle = {
        ...vehicle,
        lastTrips: moment().local().format("YYYY-MM-DD HH:mm:ss") || null,
      };

      if (redisVehicleData) {
        return aggregate(redisVehicleData, updatedVehicle);
      } else {
        return {
          ...updatedVehicle,
          VehicleStatus: updatedVehicle?.SerialNumber?.startsWith("NoSerial")
            ? 501
            : 500,
        };
      }
    });

    setLoading(false);
    dispatch(addFullVehData([...udo]));

    return {
      updatedResult: udo,
    };
  };
  const apiLoadVehSettings = async (withLoc = true) => {
    setLoading(true);

    try {
      // Fetch vehicle settings
      const fetchVehicleSettings = axios.get(`/vehicles/settings?devType=gps`);
      // Wait for the settings response
      const res = await fetchVehicleSettings;
      let result =
        res.data?.map((x) => {
          return {
            ...x,
            WorkingHours: x?.WorkingHours || 0,
            SpeedLimit: (x?.SpeedLimit ?? 0) > 0 ? x?.SpeedLimit : 120,
            MinVolt: x?.MinVolt ?? 0,
            MaxVolt: x?.MaxVolt ?? 0,
            RecordDateTime: moment.utc(
              x.RecordDateTime || locConfigModel.RecordDateTime
            ),
            Speed: x.Speed ?? 0,
            SerialNumber: x?.SerialNumber
              ? x?.SerialNumber
              : `NoSerial_${Math.floor(Math.random() * 100000)}`,
          };
        }) || [];

      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    }
  };

  const trackStreamLoader = async (syncBtn) => {
    await apiGetVehicles(30, syncBtn);
  };

  return {
    loading,
    trackStreamLoader,
  };
}

export default useStreamDataState;
