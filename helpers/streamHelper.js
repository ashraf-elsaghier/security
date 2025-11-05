import {
  locConfigModel,
  locDataModel,
  Date2KSA,
  Date2UTC,
  WeightVoltToKG,
  isDateExpired,
} from "../helpers/helpers";
import dynamic from "next/dynamic";
import moment from "moment"

const { Mapjs } = dynamic(() => import("../components/maps/leafletchild"), {
  ssr: false,
});

const StreamHelper = () => {
  const { latLng } = require("leaflet");

  const groupBykey = (list, key) => {
    return list.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const CalcVehTotal = (FullVehData) => {
    
    const statusGroups = groupBykey(FullVehData, "VehicleStatus");
    const totalDrivers =
      FullVehData.filter((v) => v["DriverID"])?.length ?? 0;
    const VehTotal = {
      totalVehs: FullVehData.length,
      activeVehs:
        FullVehData.length -
        (statusGroups[5]?.length || 0 + statusGroups[600]?.length || 0),
      offlineVehs:
        (statusGroups[5]?.length || 0) + (statusGroups[600]?.length || 0), 
         SleepingVehs:
        statusGroups[204]?.length || 0, //
      idlingVehs: statusGroups[2]?.length ?? 0, //
      RunningVehs: statusGroups[1]?.length ?? 0, //
      stoppedVehs: statusGroups[0]?.length ?? 0, //
      ospeedVehs: statusGroups[101]?.length ?? 0, //
      osspeedVehs: statusGroups[100]?.length ?? 0, //
      invalidVehs: (statusGroups[203]?.length || 0) + (statusGroups[201]?.length || 0), 

      totalDrivers: totalDrivers,
      activeDrivers:
        totalDrivers -
        (statusGroups[5]?.filter((v) => v["DriverID"])?.length ?? 0),
    };
    return VehTotal;
  };
  const  isBefore=(date1, date2) =>{
    return new Date(date1) <= new Date(date2);
  }
  
  const holdStatus = [600, 5, 0, 2];
  const CalcMileage = (Mileage) => (Mileage ? Mileage.toFixed(2) : 0);
  const CalcDuration = (newInfo, oldInfo) => {
        return moment().diff(moment(oldInfo?.lastTrips ?? newInfo?.lastTrips));
  };
  const calcTimeDiff = (date) => {
    let a = new Date(moment(date).parseZone().utc())
    let b = new Date()
    let c = b.getTime() - a.getTime()
    const hours = c / (1000 * 60 * 60);
    return hours;
  }

  const CalcDistance = (newInfo, oldInfo) =>
    parseFloat(
      CalcMileage(
        latLng(newInfo.Latitude ?? 0, newInfo.Longitude ?? 0).distanceTo(
          latLng(oldInfo.Latitude ?? 0, oldInfo.Longitude ?? 0)
        )
      )
    );
  const aggregate = (newInfo, oldInfo) => {
    newInfo?.SpeedLimit = oldInfo?.SpeedLimit;
    newInfo.VehicleStatus = CalcVstatus(newInfo);
    newInfo.WeightReading = WeightVoltToKG(newInfo, oldInfo);
      if (oldInfo != null) {
        if (
          !Mapjs?.helpers?.isValidAddress(newInfo.Address) &&
          Mapjs?.helpers?.isValidAddress(oldInfo.Address)
        )
          newInfo.Address = oldInfo.Address;
      }
    
      const keysToCheck = [
        "RPM",
        "CoolantTemp",
        "TotalMileage",
        "FuelLevelLite",
        "FuelLevelPer",
        "FuelPressure",
        "HybridVoltage",
      ];
      
      keysToCheck.forEach((key) => {
        if (
          newInfo?.[key] === undefined || 
          newInfo?.[key] === null || 
          newInfo?.[key] === 0
        ) {
          if (oldInfo?.[key] !== undefined) {
            newInfo[key] = oldInfo[key];
          }
        }
      });
    
      const updatedData = { ...oldInfo, ...newInfo };
      delete updatedData.duration;
      return updatedData;
    };
    

  const CalcVstatus = (newInfo) => {
  var Status = 5;

  var duration = calcTimeDiff(newInfo.RecordDateTime);
  
  if (newInfo.SerialNumber?.startsWith("NoSerial")) {
  return  Status = 501;
  } 
  else if (!newInfo.Longitude && !newInfo.Latitude) {
  return  Status = 500
  } 
  else  if ((!newInfo.EngineStatus && duration > 48) || (newInfo.EngineStatus && duration > 12)){
     return Status = 5
    }
    // sleep mode
   else if (newInfo.Satellites === 0 && newInfo.DevConfig === 'device: astro900') {
      return 201;
    }
    else if(!newInfo.EngineStatus && duration < 48 &&  duration > 4 ){
     return Status = 204
  }


      // check feul cutoff 
  else if (newInfo.IsFuelCutOff == true || newInfo.IsFuelCutOff == 1 ) {
  return  Status = 203;
  } 
  // check poweroff
    else if (newInfo.IsPowerCutOff ||  (!newInfo.EngineStatus && newInfo.Speed > 0) || newInfo.IsFuelCutOff == true || newInfo.IsFuelCutOff == 1) {
   return Status = 201;
  } 

  // check running
  else if (newInfo.EngineStatus == 1 && newInfo.Speed <= 5) {
  return  Status = 2;
  } 

  // check overspeed
  else if (
    newInfo.EngineStatus == 1 &&
    newInfo.Speed > newInfo.SpeedLimit
  ) {
  return  Status = 101;
  }
  else if (
    newInfo.EngineStatus == 1 &&
    newInfo.Speed <= newInfo.SpeedLimit &&
    newInfo.Speed > 5
  ) {
   return Status = 1;
  }
  else if (!newInfo.EngineStatus && newInfo.Speed > 0) {
   return Status = 300;
  } 


  else if (!newInfo.EngineStatus &&  duration < 4) {
  return  Status = 0;
  }
  return Status;
};

  const tolocInfo = function (_message, config = false) {
    var data = _message.val();
    var _locInfo = Object.assign({}, config ? locConfigModel : locDataModel);

    //let {DeviceTypeID,DeviceType: _, ...transdata} = data;
    if(!config) delete data['DeviceTypeID'];
    return Object.assign(_locInfo, data);
  };
  const objTolocInfo = function (data, config = false) {
    var _locInfo = Object.assign({}, config ? locConfigModel : locDataModel);
    return Object.assign(_locInfo, data);
  };

  const fbtolocInfo = (_message, VehFullData, _initial = false) => {
    var data = _message?.val ? _message.val() : _message;
    if (data == null) return { locInfo: null, updated: false };

    var _newInfo = { ...locDataModel };
    _newInfo = { ..._newInfo, ...data };

    _newInfo.SerialNumber = _newInfo.SerialNumber ?? _newInfo.Serial;
    _newInfo.RecordDateTime = moment.utc(_newInfo.RecordDateTime);

    _newInfo.Mileage = CalcMileage(_newInfo.Mileage);
    if (isDateExpired(_newInfo)) _newInfo.VehicleStatus = 5;
    delete _newInfo.Serial;

    let _oldInfo = {
      ...VehFullData.find((x) => x.SerialNumber == _newInfo.SerialNumber),
    };
    // if (JSON.stringify(_oldInfo) == "{}") {
    //   return { locInfo: null, updated: false };
    // }

    if (
      _oldInfo.Latitude > 0 &&
      _newInfo.RecordDateTime != null &&
      new Date(_newInfo.RecordDateTime) < new Date(_oldInfo.RecordDateTime)
    )
      return { locInfo: _oldInfo, updated: false };
    if (_initial) setTimeout(() => {}, Math.floor(Math.random() * 5 * 6e4) + 1);
    // let _oldInfoCopy = JSON.parse(JSON.stringify(_oldInfo));
    // aggregate( _newInfo, _oldInfo, _initial);
    if (_oldInfo?.lastTrip != null) {
      // do update by setLocalStorage
      let lastTrip = [...JSON.parse(JSON.stringify(_oldInfo))?.lastTrip]
      if (
        (_newInfo?.EngineStatus && _oldInfo?.lastTrip[0]) ||
        (!_newInfo?.EngineStatus && !_oldInfo?.lastTrip[0])
      ) {
        // _oldInfoCopy.lastTrip[1] = new Date(_newInfo.RecordDateTime);
      } else {
        lastTrip[0] = _newInfo.EngineStatus;
        lastTrip[1] = new Date(_newInfo.RecordDateTime);
      }
      _oldInfo?.lastTrip = lastTrip
      // _oldInfo = { ..._oldInfoCopy };
    }
    
    
    
    Object.assign(_oldInfo, _newInfo); //_oldInfo = { ..._oldInfo, ...locInfo };//join fix and updated data
    return { locInfo: _oldInfo, updated: true };
  };
  const checkNewOfflines = (VehFullData) => {
    var newOfflines = VehFullData?.filter(x => x?.VehicleStatus != 5 && x?.VehicleStatus != 600).map(x => { return {...x, VehicleStatus: CalcVstatus(x)};});
    return newOfflines.filter(x => x?.VehicleStatus == 5 || x?.VehicleStatus == 600);
  };

  return {
    isBefore,
    groupBykey,
    holdStatus,
    CalcMileage,
    CalcVehTotal,
    CalcDuration,
    CalcDistance,
    aggregate,
    CalcVstatus,
    tolocInfo,
    objTolocInfo,  
    fbtolocInfo,
    checkNewOfflines,
  };
};

export default StreamHelper;
