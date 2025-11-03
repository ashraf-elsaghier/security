import { useVehicleContext } from "context/VehiclesContext";

const useLatestVehicleUpdate = (serialNumber) => {
  const { getVehicleBySerialNumber } = useVehicleContext();

  return getVehicleBySerialNumber(serialNumber);
};

export default useLatestVehicleUpdate;
