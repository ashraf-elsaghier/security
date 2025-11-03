import React from "react";
import { Nav } from "react-bootstrap";

export default function ControlItem({
  isActive,
  onClick,
  icon,
  title,
  description,
}) {
  return (
    <Nav.Item>
      <Nav.Link
        onClick={onClick}
        className={`d-flex flex-row gap-2 px-3 py-2 rounded border ${
          isActive ? "bg-primary text-white " : ""
        }`}
      >
        {icon}
        <div className="d-flex flex-column">
          <strong>{title}</strong>
          <small>{description}</small>
        </div>
      </Nav.Link>
    </Nav.Item>
  );
}
