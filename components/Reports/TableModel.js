export default class TableModel {
    constructor(item, cashedVeh) {
        Object.keys(cashedVeh).forEach((key) => {
            this[key] = cashedVeh[key];
        });

        this.VehicleID = item.VehicleID;
        this.SerialNumber = item.SerialNumber;
        // this.DriverID = item.DriverID;
        this.StrDate = item.StrDate;
        this.EndDate = item.EndDate;
        this.MaxSpeed = item.MaxSpeed;
        this.fule_L = item.fule_L;
        this.fuel_SR = item.fuel_SR;
        this.Distance = item.Distance;
        this.avgSpeed = item.avgSpeed;
        this.Duration = item.Duration;
        // this.DriverName = item.DriverName;
        this.DisplayName = item.DisplayName;
        this.PlateNumber = item.PlateNumber;
        // this.GroupName = item.GroupName;
    }
}
