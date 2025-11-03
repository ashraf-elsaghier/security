import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Bootstrap
import { Col, Form, Modal, Row } from "react-bootstrap";
import Spinner from "components/UI/Spinner";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { useVehicleContext } from "context/VehiclesContext";

export default function ConfigPopup({ show, setShow, vehChecked }) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const [loading, setloading] = useState(false);
  const [rqLoading, setRqLoading] = useState(false);
  const [dataConfigUpdated, setDataConfigUpdated] = useState({
    trackConfigs: {},
  });

  const { vehicles } = useVehicleContext();
  const { myMap } = useSelector((state) => state.mainMap);
  const { t } = useTranslation("common");
  useEffect(() => {
    // const fetchConfigs = async () => {
    //   setloading(true);
    //   try {
    //     const response = await axios.get("config");
    //     const configurations = response.data?.configs?.trackConfigs;
    //     localStorage.setItem("Popup_Track", JSON.stringify(configurations));
    //     ;
    //   } catch (error) {

    //     localStorage.setItem("Popup_Track", JSON.stringify(defaultConfig));
    //     setDataConfigUpdated({
    //       trackConfigs: defaultConfig,
    //     });
    //     toast.error(error?.response?.data?.message);
    //   } finally {
    //     setloading(false);
    //   }
    // };
    const defaultConfig = {
      RecordDateTime: true,
      Speed: true,
      Direction: true,
      VehicleStatus: true,
      Mileage: true,
      Duration: true,
      DriverName: true,
      GroupName: true,
      PlateNumber: true,
      SimSerialNumber: true,
      SerialNumber: true,
      IgnitionStatus: true,
      TotalWeight: true,
      Temp1: true,
      Hum1: true,
      Address: true,
      EngineStatus: true,
      SeatBelt: true,
      IsPowerCutOff: true,
      ["Latitude , Longitude"]: true,
      VehicleID: true,
      RPM:false,
      CoolantTemp:false,
      TotalMileage:false,
      VIN:false,
      FuelLevelLiter:false,
      FuelLevelPer:false,
      FuelPressure:false,
      HybridVoltage:false
    };
    const config_popup =
      localStorage.getItem("Popup_Track")
      &&
      JSON.parse(localStorage.getItem("Popup_Track"));
    if (show) setDataConfigUpdated({
      trackConfigs: config_popup || defaultConfig,
    })
    //  fetchConfigs();
  }, [show]);

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  const formDataRef = useRef();

  const handleRq = async (e, dataConfig) => {
    e.preventDefault();

    const newDataConfigUpdated = {
      trackConfigs: {},
    };
    dataConfig.map((c) => {
      return (newDataConfigUpdated.trackConfigs[c.name] =
        formDataRef?.current[c.name]?.checked);
    });
    setDataConfigUpdated(newDataConfigUpdated);

    setRqLoading(true);
    try {
      const res = await axios.post("config", newDataConfigUpdated);
      if (res.status === 200) {
        localStorage.setItem(
          "Popup_Track",
          JSON.stringify({
            RecordDateTime: newDataConfigUpdated?.trackConfigs?.RecordDateTime,
            Speed: newDataConfigUpdated?.trackConfigs?.Speed,
            Direction: newDataConfigUpdated?.trackConfigs?.Direction,
            VehicleStatus: newDataConfigUpdated?.trackConfigs?.VehicleStatus,
            Mileage: newDataConfigUpdated?.trackConfigs?.Mileage,
            Duration: newDataConfigUpdated?.trackConfigs?.Duration,
            DriverName: newDataConfigUpdated?.trackConfigs?.DriverName,
            GroupName: newDataConfigUpdated?.trackConfigs?.GroupName,
            PlateNumber: newDataConfigUpdated?.trackConfigs?.PlateNumber,
            SimSerialNumber:
              newDataConfigUpdated?.trackConfigs?.SimSerialNumber,
            SerialNumber: newDataConfigUpdated?.trackConfigs?.SerialNumber,
            IgnitionStatus: newDataConfigUpdated?.trackConfigs?.IgnitionStatus,
            TotalWeight: newDataConfigUpdated?.trackConfigs?.TotalWeight,
            Temp1: newDataConfigUpdated?.trackConfigs?.Temp1,
            Hum1: newDataConfigUpdated?.trackConfigs?.Hum1,
            Address: newDataConfigUpdated?.trackConfigs?.Address,
            EngineStatus: newDataConfigUpdated?.trackConfigs?.EngineStatus,
            VehicleID: newDataConfigUpdated?.trackConfigs?.VehicleID,
            SeatBelt: newDataConfigUpdated?.trackConfigs?.SeatBelt,
            VehicleViolation:
              newDataConfigUpdated?.trackConfigs?.VehicleViolation,
            IsPowerCutOff: newDataConfigUpdated?.trackConfigs?.IsPowerCutOff,
            ["Latitude , Longitude"]:
            newDataConfigUpdated?.trackConfigs["Latitude , Longitude"],
            RPM:newDataConfigUpdated?.trackConfigs?.RPM ?? false,
            CoolantTemp:newDataConfigUpdated?.trackConfigs?.CoolantTemp?? false,
            TotalMileage:newDataConfigUpdated?.trackConfigs?.TotalMileage?? false,
            VIN:newDataConfigUpdated?.trackConfigs?.VIN ?? false,
            FuelLevelLiter:newDataConfigUpdated?.trackConfigs?.FuelLevelLiter?? false,
            FuelLevelPer:newDataConfigUpdated?.trackConfigs?.FuelLevelPer ?? false,
            FuelPressure:newDataConfigUpdated?.trackConfigs?.FuelPressure ?? false,
            HybridVoltage:newDataConfigUpdated?.trackConfigs?.HybridVoltage ?? false
          })
        );
        toast.success(t("add configs is successfully"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      myMap?.deselectAll();
      const vehiclesData = Object.fromEntries(
        vehicles.map((x) => [x?.SerialNumber, x])
      );
      const newData = vehChecked.map((x) => vehiclesData[x?.SerialNumber]);
      newData?.map((x) =>
        myMap?.pin(vehiclesData[x?.SerialNumber], {
          doRezoom: false,
        })
      );
      setRqLoading(false);
      handleClose();
    }
  };

  const dataConfig = [
    {
      name: "RecordDateTime",
      text: "record_date_time_key",
    },
    {
      name: "Speed",
      text: "Speed",
    },
    {
      name: "Direction",
      text: "Direction",
    },
    {
      name: "VehicleStatus",
      text: "vehicle_status_key",
    },
    {
      name: "Mileage",
      text: "Mileage",
    },
    {
      name: "Duration",
      text: "duration_key",
    },
    {
      name: "DriverName",
      text: "driver_name_key",
    },
    {
      name: "GroupName",
      text: "group_name_key",
    },
    {
      name: "PlateNumber",
      text: "PlateNumber",
    },
    {
      name: "SimSerialNumber",
      text: "sim_number_key",
    },
    {
      name: "SerialNumber",
      text: "SerialNumber",
    },
    {
      name: "IgnitionStatus",
      text: "ignition_status_key",
    },
    {
      name: "TotalWeight",
      text: "total_weight_key",
    },
    {
      name: "Temp1",
      text: "Temperature",
    },
    {
      name: "Hum1",
      text: "Humidy",
    },
    {
      name: "Address",
      text: "Address",
    },
    {
      name: "EngineStatus",
      text: "engine_status_key",
    },
    {
      name: "SeatBelt",
      text: "SeatBelt",
    },
    {
      name: "VehicleID",
      text: "vehicle_id_key",
    },
    {
      name: "VehicleViolation",
      text: "Vehicle_Violation_key",
    },
    {
      name: "IsPowerCutOff",
      text: "IsPower_cutoff_key",
    },
    {
      name: "Latitude , Longitude",
      text: "Latitude , Longitude",
    },
    {
      name: "RPM",
      text: "rpm_key",
    },
    {
      name: "CoolantTemp",
      text: "coolant_temp_key",
    },
    {
      name: "TotalMileage",
      text: "total_mileage_key",
    },
    {
      name: "VIN",
      text: "vin_key",
    },
    {
      name: "FuelLevelLiter",
      text: "fuel_level_liter_key",
    },
    {
      name: "FuelLevelPer",
      text: "fuel_level_percentage_key",
    },
    {
      name: "FuelPressure",
      text: "fuel_pressure_key",
    },
    {
      name: "HybridVoltage",
      text: "hybrid_voltage_key",
    },
  ];

  const handleAddCheckItem = (name, e) => {
    const nweConfig = {
      ...dataConfigUpdated,
    };

    nweConfig.trackConfigs[name ?? ""] = e.target.checked;
    setDataConfigUpdated(nweConfig);
  };

  const checkItem = (name, text, index) => (
    <Col lg="6" key={index}>
      <Form.Check
        label={t(text)}
        type="checkbox"
        id={name}
        name={name}
        onChange={(e) => handleAddCheckItem(name, e)}
        checked={
          Object.keys(dataConfigUpdated?.trackConfigs ?? [])?.length
            ? dataConfigUpdated?.trackConfigs[name]
            : true
        }
        disabled={
          Object.values(dataConfigUpdated?.trackConfigs ?? [])?.filter(
            (item) => item == true
          ).length == 1 && dataConfigUpdated?.trackConfigs[name]
        }
      />
    </Col>
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={`${Dark}`}>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("configuration_popup_key")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => handleRq(e, dataConfig)} ref={formDataRef}>
        <Modal.Body className={`${Dark}`}>
          <Row className="p-3 mb-3">
            {loading ? (
              <Spinner />
            ) : (
              dataConfig?.map((item, index) =>
                checkItem(item?.name, item?.text, index)
              )
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer className={`${Dark}`}>
          <div className="d-flex justify-content-around">
            <button
              disabled={rqLoading || vehicles.length === 0}
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
            >
              {!rqLoading ? (
                <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
              ) : (
                <FontAwesomeIcon
                  className="mx-2 fa-spin"
                  icon={faSpinner}
                  size="sm"
                />
              )}
              {t("save_changes_key")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel_key")}
            </button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
