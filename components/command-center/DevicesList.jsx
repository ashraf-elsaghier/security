import React from "react";
import { Card, Accordion, Spinner } from "react-bootstrap";
import { FaVideo } from "react-icons/fa";

const DevicesList = ({
  devices,
  onChannelSelect,
  selectedChannels,
  loading,
}) => {
  // Generate a list of keys to keep all accordions open
  const activeKeys = devices.map((_, index) => index.toString());

  return (
    <Card className="border-0 shadow-sm h-100">
      <Accordion activeKey={activeKeys}>
        {loading ? (
          <div className="d-flex justify-content-center w-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          devices.map((device, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={device.SerialNumber}
              className="border-0"
            >
              <Accordion.Header>{device.SerialNumber}</Accordion.Header>
              <Accordion.Body className="p-2">
                <ul className="list-unstyled mb-0">
                  {device.channels.map((channel) => {
                    const isSelected = selectedChannels.some(
                      (selectedChannel) =>
                        selectedChannel.deviceID === device.SerialNumber &&
                        selectedChannel.channelID === channel.id
                    );
                    return (
                      <li
                        key={channel.id}
                        className={`ms-3 d-flex align-items-center justify-content-between mb-2 p-2 ${
                          isSelected ? "bg-primary text-white rounded" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          onChannelSelect(
                            device.SerialNumber,
                            channel.name,
                            channel.id
                          )
                        }
                      >
                        <span>{channel.name}</span>
                        <FaVideo
                          size={20}
                          color={isSelected ? "white" : "green"}
                        />
                      </li>
                    );
                  })}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))
        )}
      </Accordion>
    </Card>
  );
};

export default DevicesList;
