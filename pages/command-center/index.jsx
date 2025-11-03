import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getSession } from "next-auth/client";
import DevicesList from "components/command-center/DevicesList";
import LiveView from "components/command-center/LiveView";
import DevicesControlHeader from "components/command-center/DevicesControlHeader";
import { toast } from "react-toastify";
import { fetchNetrisaDevices } from "services/command-control";
import dynamic from "next/dynamic";
import DeviceStatusDashboard from "components/command-center/DeviceStatusDashboard";

const MapView = dynamic(() => import("components/command-center/MapView"), {
  ssr: false,
});

const Index = ({ cameraData }) => {
  const { t } = useTranslation(["CommandCenter"]);
  const [view, setView] = useState("map");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [jsession, setJession] = useState(null);

  const handleChannelSelect = (deviceSerial, name, channelId) => {
    setView("liveView");
    setSelectedChannels((prevSelectedChannels) => {
      const isAlreadySelected = prevSelectedChannels.some(
        (channel) =>
          channel.deviceID === deviceSerial && channel.channelID === channelId
      );
      if (isAlreadySelected) {
        return prevSelectedChannels.filter(
          (channel) =>
            channel.deviceID !== deviceSerial || channel.channelID !== channelId
        );
      } else {
        return [
          ...prevSelectedChannels,
          { deviceID: deviceSerial, ChannelName: name, channelID: channelId },
        ];
      }
    });
  };

  useEffect(async () => {
    try {
      setLoading(true);
      const { jsession, devices } = await fetchNetrisaDevices(cameraData);
      setDevices(devices.devices);
      setJession(jsession);
    } catch (error) {
      console.error("Error during login or fetching camera data:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Container fluid className="d-flex flex-column">
      {/* Add DeviceStatusDashboard at the top */}
      <DeviceStatusDashboard deviceIds={cameraData} />

      <Row className="flex-grow-1">
        <Col md={4} lg={2} className="pe-0">
          <DevicesList
            devices={devices}
            onChannelSelect={handleChannelSelect}
            selectedChannels={selectedChannels}
            onDeviceSelect={() => setView("liveView")}
            loading={loading}
          />
        </Col>
        <Col md={8} lg={10} className="ps-0">
          <div className="d-flex flex-row" style={{ height: "100%" }}>
            <div
              style={{
                flex: selectedChannels.length > 0 ? "0 0 50%" : "1",
                transition: "flex 0.3s ease",
              }}
            >
              <MapView devices={cameraData} jsession={jsession} />
            </div>
            {selectedChannels.length > 0 && (
              <div
                style={{
                  flex: "0 0 50%",
                  transition: "flex 0.3s ease",
                  overflow: "hidden",
                }}
              >
                <LiveView channels={selectedChannels} jsession={jsession} />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  let cameraData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicles/settings?devType=cam&withloc=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.new_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      cameraData = await response.json();
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";
  if (isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, ["CommandCenter"])),
      cameraData: cameraData.map((camera) => camera?.SerialNumber) || [],
    },
  };
}

export default Index;
