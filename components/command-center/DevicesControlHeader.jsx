import React from "react";
import { Card, Nav } from "react-bootstrap";
import { FaMapMarkedAlt, FaVideo } from "react-icons/fa";
import ControlItem from "./ControlItem";

/**
 * DevicesControlHeader
 * @param {string} currentView - Current view state ("map" or "liveView").
 * @param {function} setView - Function to switch views.
 */

export default function DevicesControlHeader({
  currentView,
  setView,
  setSelectedChannels,
}) {
  const tabs = [
    {
      key: "map",
      icon: <FaMapMarkedAlt className="mb-1" size={25} />,
      title: "Map",
      description: "View devices on map",
    },
    {
      key: "liveView",
      icon: <FaVideo className="mb-1" size={25} />,
      title: "Live View",
      description: "View live camera feeds",
    },
  ];

  return (
    <Card className="py-2">
      <Nav
        variant="tabs"
        className=" justify-content-start gap-3 border-0 mx-3"
      >
        {tabs.map((tab) => (
          <ControlItem
            key={tab.key}
            isActive={currentView === tab.key}
            onClick={() => {
              if (tab.key == "map") setSelectedChannels([]);
              setView(tab.key);
            }}
            icon={tab.icon}
            title={tab.title}
            description={tab.description}
          />
        ))}
      </Nav>
    </Card>
  );
}
