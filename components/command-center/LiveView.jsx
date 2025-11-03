import VideoPlayer from "components/VehiclesCamera/VideoPlayer";
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { AiOutlineCamera } from "react-icons/ai";

const LiveView = ({ channels, jsession, loading }) => {
  return (
    <Card className="h-100 p-3 overflow-auto shadow-sm">
      {channels.length ? (
        <Row className="g-3">
          {channels.map((c, i) => (
            <Col key={c.deviceID + i} xs={12}>
              <VideoPlayer
                deviceId={c.deviceID}
                channel={c.channelID}
                jsession={jsession}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center my-auto">
          <AiOutlineCamera
            className="text-secondary"
            style={{ fontSize: "4rem", marginBottom: "1rem" }}
          />
          <p className="text-muted">
            No channel selected. Please select a channel to load data.
          </p>
        </div>
      )}
    </Card>
  );
};

export default LiveView;
