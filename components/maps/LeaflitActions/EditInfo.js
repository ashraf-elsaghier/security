import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Col, Form, Modal, Row } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactSelect from "components/Select";
import Image from "next/image";
import { VehicleOptions } from "helpers/helpers";
import { encryptName } from "helpers/encryptions";
import StreamHelper from "helpers/streamHelper";
import { useSession } from "next-auth/client";

export default function EditInfo({
  show,
  setShow,
  allTreeData,
  setAllTreeData,
  setSelectedVehicles,
}) {
  const darkMode = useSelector((state) => state.config.darkMode);
  const { t } = useTranslation("common");
  const session = useSession();
  const userRole = session[0]?.user?.user?.role?.toLowerCase();
  const [rqLoading, setRqLoading] = useState(false);
  const { myMap } = useSelector((state) => state.mainMap);
  const id = document
    .getElementById("EditInformationBtn")
    .getAttribute("data-id");

  let locInfo = JSON.parse(
    localStorage.getItem(encryptName("userData"))
  ).vehData.find((x) => x.VehicleID == id);

  const localIcon = VehicleOptions(t).find(
    (x) => x.value == localStorage.getItem("VehicleIcon")
  );

  const [Data, setData] = useState({
    DisplayName: locInfo.DisplayName,
    PlateNumber: locInfo.PlateNumber,
    SpeedLimit: locInfo.SpeedLimit,
    config: locInfo.configJson,
    configJson: locInfo.configJson,
  });

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  // Add old data to the inputs
  useEffect(() => {
    if (show) {
      setData({
        DisplayName: locInfo.DisplayName,
        PlateNumber: locInfo.PlateNumber,
        SpeedLimit: locInfo.SpeedLimit,
        config: locInfo.configJson,
        configJson: locInfo.configJson,
      });
    }
  }, [show]);
  const handleRq = (e) => {
    e.preventDefault();
    setRqLoading(true);
    const oldStorage = JSON.parse(
      localStorage.getItem(encryptName("userData")) ?? "{}"
    );
    const { vehData } = oldStorage;
    const Index = allTreeData.findIndex(
      (x) => x.VehicleID == locInfo.VehicleID
    );
    const storageIndex = vehData.findIndex(
      (x) => x.VehicleID == locInfo.VehicleID
    );

    const updated_data = {
      ...allTreeData[Index],
      ...Data,
      configJson: Data.config,
      config: Data.configJson,
    };
    const updated_Storage_data = {
      ...vehData[storageIndex],
      ...locInfo,
      ...Data,
    };
    axios
      .put(`dashboard/vehicles/updateConfig/${locInfo.VehicleID}`, {
        DisplayName: updated_data.DisplayName,
        AccountID: locInfo.AccountID,
        PlateNumber: updated_data.PlateNumber,
        SpeedLimit: updated_data.SpeedLimit,
        config:
          updated_data.configJson || locInfo.configJson || '{"icon":"sedan1"}',
      })
      .then(() => {
        vehData[storageIndex] = updated_Storage_data;
        localStorage.setItem(
          encryptName("userData"),
          JSON.stringify({ ...oldStorage, vehData: vehData })
        );
        toast.success("Vehicle updated Successfully");
        setAllTreeData((prev) => {
          const tempArr = prev.map((v) => {
            if (v.VehicleID == updated_data.VehicleID) {
              return { ...v, ...locInfo, ...updated_data };
            }
            return v;
          });
          return tempArr;
        });

        setSelectedVehicles((prev) => {
          const tempArr = prev.map((v) => {
            if (v.VehicleID == updated_data.VehicleID) {
              return updated_data;
            }
            return v;
          });
          return tempArr;
        });
        myMap.pin({ ...locInfo, ...updated_data });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setRqLoading(false);
        handleClose();
      });
  };
  const handlePlateNumberOnKeyPress = (e) => {
    !/[A-Za-z0-9 ]+/.test(e.key) ? e.preventDefault() : false;
  };

  const handleIconVehicle = (value) => {
    const filteredValue = VehicleOptions(t).find(
      (item) => item.value === value
    );
    setData({
      ...Data,
      config: JSON.stringify({
        ...JSON.parse(Data?.config ?? "null"),
        icon: filteredValue.name,
      }),
      configJson: JSON.stringify({
        ...JSON.parse(Data?.config ?? "null"),
        icon: filteredValue.name,
      }),
    });
  };
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
          {t("edit_vehicle_information_key")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Body className={`${Dark}`}>
          <Row className="p-3 mb-3">
            <Col lg="12">
              <Form.Group className="form-group">
                <Form.Label htmlFor="DisplayName">
                  {t("DisplayName")}
                </Form.Label>
                <Form.Control
                  name="DisplayName"
                  type="text"
                  id="DisplayName"
                  placeholder={t("DisplayName")}
                  value={Data.DisplayName}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      DisplayName: e.target.value,
                    })
                  }
                  required
                  disabled={userRole != "admin"}
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="PlateNumber">
                  {t("PlateNumber")}
                </Form.Label>
                <Form.Control
                  name="PlateNumber"
                  type="text"
                  id="PlateNumber"
                  placeholder={t("PlateNumber")}
                  defaultValue={Data.PlateNumber}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      PlateNumber: e.target.value,
                    })
                  }
                  onKeyPress={handlePlateNumberOnKeyPress}
                  required
                  disabled={userRole != "admin"}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label htmlFor="SpeedLimit">{t("SpeedLimit")}</Form.Label>
                <Form.Control
                  name="SpeedLimit"
                  type="text"
                  id="SpeedLimit"
                  placeholder={t("SpeedLimit")}
                  value={Data.SpeedLimit}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      SpeedLimit: +e.target.value,
                    })
                  }
                  onKeyPress={handlePlateNumberOnKeyPress}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="12">
              <p className="fs-5 text-secondary text-center">
                {t("vehicle_icon_key")}
              </p>
              <ReactSelect
                onSelectChange={handleIconVehicle}
                // value={
                //   (
                //     VehicleOptions(t).find(
                //       (o) => o.name == JSON.parse(Data?.config ?? "null")?.icon
                //     ) ??
                //     localIcon ??
                //     VehicleOptions(t)[0]
                //   ).value
                // }
                options={VehicleOptions(t)}
                defaultValue={
                  VehicleOptions(t).find(
                    (o) => o.name == JSON?.parse(Data?.config ?? "null")?.icon
                  ) ??
                  localIcon ??
                  VehicleOptions(t)[0]
                }
                label={t("select_car_icon_key")}
                className="mb-3"
                formatOptionLabel={(guide) => (
                  <div className="d-flex align-items-center ps-3">
                    <span style={{ rotate: "90deg" }}>
                      {/* {guide.icon} */}
                      <Image
                        width={14}
                        height={30}
                        src={guide?.img}
                        alt={guide?.label}
                        title={guide?.label}
                      />
                    </span>

                    <span className="ms-2 text-capitalize px-2">
                      {guide.label}
                    </span>
                  </div>
                )}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className={`${Dark}`}>
          <div className="d-flex justify-content-around">
            <button
              disabled={rqLoading}
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
              {t("Save_changes")}
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
