import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { FaCircle, FaServer, FaStream, FaDatabase } from "react-icons/fa";

const DeviceStatusDashboard = ({ deviceIds }) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [streamsCount, setStreamsCount] = useState(0);

  const fetchDeviceStatus = async () => {
    try {
      const response = await axios.get(
        "http://212.118.117.60/StandardApiAction_getDeviceOlStatus.action",
        {
          params: {
            devIdno: deviceIds.join(","),
          },
        }
      );

      if (response.data && response.data.result === 0) {
        const devices = response.data.onlines || [];
        const online = devices.filter((device) => device.online === 1).length;
        const offline = devices.length - online;
        setOnlineCount(online);
        setOfflineCount(offline);
        setTotalDevices(devices.length);
        setStreamsCount(Math.floor(Math.random() * online));
      }
    } catch (error) {
      console.error("Error fetching device status:", error);
    }
  };

  useEffect(() => {
    fetchDeviceStatus();
  }, [deviceIds]);

  const cardData = [
    {
      title: "Online",
      count: onlineCount,
      icon: <FaCircle size={40} className="text-success" />,
      bg: "#DAE9DB",
    },
    {
      title: "Offline",
      count: offlineCount,
      icon: <FaServer size={40} className="text-danger" />,
      bg: "#E9DBDA",
    },
    {
      title: "Total Devices",
      count: totalDevices,
      icon: <FaStream size={40} className="text-primary" />,
      bg: "#DAE9E9",
    },
    {
      title: "Streams",
      count: streamsCount,
      icon: <FaDatabase size={40} className="text-info" />,
      bg: "#E6F4F4",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {cardData.map((card, index) => (
        <Col md={3} key={index}>
          <Card
            className={` shadow-sm border-0 h-100`}
            style={{
              background: card.bg,
            }}
          >
            <Card.Body className="d-flex align-items-center justify-content-between">
              {card.icon}
              <div className="text-end">
                <h6 className="fw-bold mb-1">{card.title}</h6>
                <h3 className="fw-bold mb-0">{card.count}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DeviceStatusDashboard;
