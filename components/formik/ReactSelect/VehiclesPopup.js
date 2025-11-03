import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import style from "styles/ReportsOptions.module.scss";
import { useTranslation } from "next-i18next";
import UseDarkmode from "hooks/UseDarkmode";

import { useSelector } from "react-redux";
import MenuTreeReports from "components/tree/MenuTreeReports";
import { encryptName } from "helpers/encryptions";
import { CustomInput } from "components/CustomInput";

const VehiclesPopup = ({ open, setOpen, setVehChecked, vehChecked }) => {
  const { t } = useTranslation("reports");
  const [treeFilter, setTreeFilter] = useState("");

  const [vehData, setVehData] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const vehicleIds = useSelector((state) => state?.vehicleIds);

  const [vehiclesError, setVehiclesError] = useState("");

  useEffect(() => {
    const { vehData } =
      JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") || [];
    setVehData(vehData);
    setTreeData(vehData);
  }, []);

  // const handleFilter = (e) => {

  //   setTreeFilter(e.target.value.toLowerCase());

  //   e.target.value
  //     ? setTreeData(
  //       vehData.filter((item) => {
  //         const filterDisplayName = item?.DisplayName?.replace(/\s/g, "")
  //           .toLowerCase()
  //           ?.includes(e.target.value?.replace(/\s/g, "")?.toLowerCase())

  //         const filterSerialNumber =
  //           item.SerialNumber?.includes(e.target.value.toLowerCase()) ||
  //           item.Serial?.includes(e.target.value.toLowerCase());
  //         return filterDisplayName || filterSerialNumber;
  //       })
  //     )
  //     : setTreeData(vehData);
  // };

  // const handleChangeInput = (e, veh) => {
  //   if (e.target.id === "All" && e.target.checked) {
  //     setDisabled(true);
  //     return setVehChecked(treeData);
  //   } else if (e.target.id === "All" && !e.target.checked) {
  //     setDisabled(false);

  //     return setVehChecked([]);
  //   }

  //   if (e.target.checked) return setVehChecked((prev) => [...prev, veh]);

  //   setVehChecked((prev) => prev.filter((p) => p.VehicleID !== veh.VehicleID));
  // };

  const filteredTreeData = useMemo(() => {
    return vehData.filter((item) => {
      const filterDisplayName = item?.DisplayName?.replace(/\s/g, "")
        .toLowerCase()
        .includes(treeFilter.replace(/\s/g, "").toLowerCase());
      const filterSerialNumber =
        item.SerialNumber?.includes(treeFilter) ||
        item.Serial?.includes(treeFilter);
      return filterDisplayName || filterSerialNumber;
    });
  }, [vehData, treeFilter]);

  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={open}
      onHide={() => setOpen(false)}
    >
      {/* Header */}
      <Modal.Header
        closeButton
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          borderBottomColor: UseDarkmode("#151824", "#DDD"),
        }}
      >
        <div
          className={`d-flex justify-content-center align-items-center ${style.bxTitleIcon}`}
        >
          <span className="text-center fs-6 w-50">{t("Vehicles")}</span>
        </div>
      </Modal.Header>

      <Modal.Body
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          overflow: "hidden",
        }}
      >
        <Row>
          <CustomInput
            ClassN="col"
            Type="text"
            Placeholder={t("displayName_or_serialNumber_key")}
            handleChange={(e) => setTreeFilter(e.target.value)}
          />

          {vehiclesError && (
            <span className="text-danger fs-6">{vehiclesError}</span>
          )}

          {/* <div>
            <Form.Check
              key="All"
              type="checkbox"
              label="All"
              id="All"
              checked={vehChecked?.length === treeData?.length}
              onChange={(e) => handleChangeInput(e, "All")}
            />
            <FixedSizeList
              height={200} // Specify the height of the list
              itemCount={treeData.length}
              itemSize={23} // Specify the height of each item
            >
              {({ index, style }) => {
                const vehicle = treeData[index];
                const isChecked = vehChecked?.some(
                  (veh) => veh.VehicleID === vehicle.VehicleID
                );
                return (
                  <Form.Check
                    key={vehicle.VehicleID}
                    type="checkbox"
                    checked={isChecked}
                    disabled={
                      disabled || vehChecked?.length === treeData?.length
                    }
                    label={vehicle.DisplayName}
                    id={vehicle.VehicleID}
                    onChange={(e) => handleChangeInput(e, vehicle)}
                    style={style} // Apply the style provided by react-window
                  />
                );
              }}
            </FixedSizeList>
          </div> */}
          <MenuTreeReports
            setVehiclesError={setVehiclesError}
            treeFilter={treeFilter}
            vehData={filteredTreeData}
            vehicleIds={vehicleIds}
            vehChecked={vehChecked}
            setVehChecked={setVehChecked}
          />
        </Row>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          borderTopColor: UseDarkmode("#151824", "#DDD"),
        }}
      >
        <Button
          className="my-0 mx-auto  py-2 px-5"
          onClick={() => {
            vehChecked?.length > 0
              ? setOpen(false)
              : setVehiclesError("Please Select At Least one Vehicle");
          }}
        >
          {t("Select Vehicles")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VehiclesPopup;
