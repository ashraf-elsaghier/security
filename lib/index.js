import { configureStore } from "@reduxjs/toolkit";
import ToggleMenuSlice from "./slices/toggleSidebar";
import ConfigSlice from "./slices/config";
import fetchUserSlice from "./slices/auth";
import ToggleHeaderSlice from "./slices/toggle-header";
import VehicleInfo from "./slices/vehicleInfo";
import VehicleIds from "./slices/vehicleIds";
import SimCard from "./slices/simCard";
import AramcoTestService from "./slices/aramcoTestService";
import AddDevicesInfo from "./slices/addDevicesInfo";
import UserInfo from "./slices/userInfo";
import AccountInfo from "./slices/accountInfo";
import StreamData from "./slices/StreamData";
import MainMap from "./slices/mainMap";
import addNewScheduledReportReducer from "./slices/addNewScheduledReport";
import TourSlice from "./slices/tour";
import geoSearchSlice from "./slices/geoSearch";
import FirebaseSlice from "./slices/vehicleProcessStatus";
import addNewVehicleReducer from "./slices/addNewVehicle";
import addFormDatas from "./slices/addForm";
import addNewDeviceReducer from "./slices/addNewDevice";
import dateVersionCalculation from "./slices/dateVersionCalculation";
import driverHeatMap from "./slices/driverHeatmap";
import ToggleZoomAuto from "./slices/zoomAuto";
import mostVistiedMap from "./slices/mostVistiedMap";
import dashboardReports from "./slices/dashboardReports";
import notificationsSlice from "./slices/notifications";
import groups from "./slices/groups";
import socketSlice from "./slices/socketSlice";

export default configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    toggleMenu: ToggleMenuSlice,
    config: ConfigSlice,
    auth: fetchUserSlice,
    ToggleHeader: ToggleHeaderSlice,
    vehicleInfo: VehicleInfo,
    vehicleIds: VehicleIds,
    simCard: SimCard,
    aramcoTestService: AramcoTestService,
    addDevicesInfo: AddDevicesInfo,
    userInfo: UserInfo,
    mainMap: MainMap,
    accountInfo: AccountInfo,
    streamData: StreamData,
    firebase: FirebaseSlice,
    addFormDatas: addFormDatas,
    addNewDevice: addNewDeviceReducer,
    addNewVehicle: addNewVehicleReducer,
    addNewScheduledReport: addNewScheduledReportReducer,
    tour: TourSlice,
    geoSearch: geoSearchSlice,
    dateVersion: dateVersionCalculation,
    driverHeatMap: driverHeatMap,
    ToggleZoomAuto: ToggleZoomAuto,
    MostVistiedMap: mostVistiedMap,
    dashboardReports: dashboardReports,
    notifications: notificationsSlice,
    groups: groups,
    socket: socketSlice,
  },
});
