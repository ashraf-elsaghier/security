import React, { useState } from "react";
import VehiclesPopup from "./VehiclesPopup";
import { useTranslation } from "next-i18next";
import { Button, Form } from "react-bootstrap";
import TextError from "../TextError";

const SelectVehicles = ({ vehChecked, setVehChecked, error }) => {
  const { t } = useTranslation("preventiveMaintenance");

  const [open, setOpen] = useState(false);

  return (
    <>
      <Form.Group
        className="col-md-6 col-lg-4 mb-3"
        controlId={t("select_vehicles_key")}
        onClick={() => setOpen(true)}
      >
        <Form.Label>{t("select_vehicles_key")}</Form.Label>
        <div
          id="selectedVehicles"
          name="selectedVehicles"
          className="px-2 d-flex align-items-center border-primary"
          style={{
            minHeight: "38px",
            borderRadius: "4px",
            border: "1px solid",
            cursor: "pointer",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {vehChecked?.map((veh) => (
            <Button className="bg-secondary ms-1" style={{ height: "21px" }}>
              {veh.DisplayName}
            </Button>
          ))}
          {!vehChecked.length && t("Select")}
        </div>
        {error && !vehChecked.length && <TextError>{error}</TextError>}
      </Form.Group>

      {open && (
        <VehiclesPopup
          open={open}
          setOpen={setOpen}
          vehChecked={vehChecked}
          setVehChecked={setVehChecked}
        />
      )}
    </>
  );
};

export default SelectVehicles;
