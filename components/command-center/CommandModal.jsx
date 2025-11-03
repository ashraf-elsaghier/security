import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

const commandOptions = [
  { value: 1, label: "Disconnect Oil" },
  { value: 2, label: "Oil Recovery" },
  { value: 3, label: "Turn Off Power" },
  { value: 4, label: "Turn On Power" },
  { value: 5, label: "Restart Device" },
  { value: 6, label: "Restore Factory Settings" },
  { value: 7, label: "Sleep" },
  { value: 8, label: "Wake" },
  { value: 9, label: "Open Device Recording" },
  { value: 10, label: "Turn Off Device Video" },
  { value: 11, label: "Start Channel Polling" },
  { value: 12, label: "Stop Channel Polling" },
  { value: 13, label: "Boot Record Logging" },
  { value: 14, label: "Format Hard Disk" },
  { value: 15, label: "Clear Mileage" },
  { value: 16, label: "Positive Turn" },
  { value: 17, label: "Reverse Turn" },
  { value: 18, label: "Clear Alarm" },
  { value: 19, label: "Switch Cameras" },
  { value: 20, label: "Start Recording" },
  { value: 21, label: "Stop Recording" },
  { value: 22, label: "End WiFi Download" },
  { value: 23, label: "Take Photo" },
  { value: 24, label: "Device Video" },
];

export default function CommandModal({ show, onHide, device }) {
  const [selectedCommand, setSelectedCommand] = useState(null);

  const handleSendCommand = async () => {
    if (!selectedCommand) {
      toast.warning("Please select a command");
      return;
    }

    try {
      const response = await fetch(
        `http://212.118.117.60/StandardApiAction_vehicleControlOthers.action?jsession=SESSION_TOKEN&DevIDNO=${device.id}&CtrlType=${selectedCommand.value}&Usr=admin&Pwd=Saferoad@2025`
      );
      const data = await response.json();
      toast.dismiss();
      toast.success("command sent");
    } catch (error) {
      console.error("Error sending command:", error);
      toast.error("Error sending command");
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Send Command to {device?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Select
          options={commandOptions}
          onChange={(option) => setSelectedCommand(option)}
          placeholder="Select Command"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="fs-5" variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button className="fs-5" variant="primary" onClick={handleSendCommand}>
          Send Command
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
