import { toast } from "react-toastify";

export async function getVehInfo(jsession, cameraData) {
  const url = `http://212.118.117.60/StandardApiAction_queryUserVehicle.action?jsession=${jsession}&language=en`;
  const response = await fetch(url);
  const json = await response.json();
  const devices = [];
  if (json.result === 0) {
    json.vehicles.forEach((vehicle) => {
      if (cameraData.includes(vehicle.dl[0].id)) {
        if (vehicle.chnCount > 0) {
          const channels = vehicle.chnName.split(",").map((channel, index) => ({
            id: `${index + 1}`,
            name: channel,
          }));
          devices.push({
            SerialNumber: vehicle.nm,
            channels: channels,
          });
        }
      }
    });
  }
  return { devices };
}

export async function fetchNetrisaDevices(cameraData) {
  const res = await fetch(
    `http://212.118.117.60/StandardApiAction_login.action?account=admin&password=Saferoad@2025`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    throw new Error("Error occurred during login");
  }
  const data = await res.json();
  if (data.result === 1) {
    throw new Error("Invalid credentials");
  } else {
    const devices = await getVehInfo(data.jsession, cameraData);
    return { jsession: data.jsession, devices: devices };
  }
}
