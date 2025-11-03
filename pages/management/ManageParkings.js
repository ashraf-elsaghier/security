import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggle as tourToggle, disableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import {
  getParkingVehicles,
  deleteParking,
  getAllParkings,
  getUnAssignedVehicles,
  updateParkingVehicles,
} from "services/management/ManageParkings";
import EditParkingModal from "components/management/ManageParkings/EditParkingModal";
import DeleteModal from "components/Modals/DeleteModal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddParkingModal from "components/management/ManageParkings/AddParkingModal";
import { toast } from "react-toastify";
import ReactSelect from "components/Select";
import EditIcon from "components/icons/EditIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import MenuTreeReports from "components/tree/MenuTreeReports";
import { CustomInput } from "components/CustomInput";
import { getSession } from "next-auth/client";
const ManageGroupsVehicles = () => {
  const { t } = useTranslation(["Management", "Tour"]);
  const dispatch = useDispatch();
  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["groupManagement"],
  });

  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [allGroups, setAllGroups] = useState([]);
  const [dataOptions, setDataOptions] = useState([]);
  const [unAssignedVehicles, setUnAssignedVehicles] = useState([]);
  const [filteredUnAssignedVehicles, setFilteredUnAssignedVehicles] = useState(
    []
  );
  const [parkingVehicles, setParkingVehicles] = useState([]);
  const [filteredParkingVehicles, setFilteredParkingVehicles] = useState([]);
  const [vehiclesToAssign, setVehiclesToAssign] = useState([]);
  const [vehiclesToUnAssign, setVehiclesToUnAssign] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [treeFilter, setTreeFilter] = useState("");

  const getParkings = async () => {
    const parkings = await getAllParkings();
    try {
      const parkingOptions = parkings.result.map((items) => ({
        label: items.parkingGroupName,
        value: items.parkingGroupID,
      }));
      setDataOptions(parkingOptions);
      setAllGroups(parkings?.result);
    } catch (e) {
      console.log("Error fetching Parkings!");
    }
  };

  const getAllUnAssignedVehicles = async () => {
    const Vehicles = await getUnAssignedVehicles();
    setUnAssignedVehicles(Vehicles ?? []);
    setFilteredUnAssignedVehicles(Vehicles);
  };
  useEffect(() => {
    getParkings();
    getAllUnAssignedVehicles();
  }, []);

  const handleDeleteParking = async () => {
    try {
      setLoadingUpdate(true);
      const response = await deleteParking(selectedParking.parkingGroupID);
      setLoadingUpdate(false);
      if (response.status == 200) {
        toast.success(
          `${selectedParking.parkingGroupName} deleted successfully`
        );
        setDataOptions(
          dataOptions.filter((p) => p.value !== selectedParking.parkingGroupID)
        );
        setAllGroups(
          allGroups.filter(
            (p) => p.parkingGroupID !== selectedParking.parkingGroupID
          )
        );
        setUnAssignedVehicles((prev) => [...prev, ...parkingVehicles]);
        setFilteredUnAssignedVehicles((prev) => [...prev, ...parkingVehicles]);
        setSelectedParking(null);
        setParkingVehicles([]);
        setFilteredParkingVehicles([]);
        setDeleteModalShow(false);
      }
    } catch (e) {
      setLoadingUpdate(false);
      toast.error(`${e.response.data.message || "Something went wrong!"} `);
    }
  };

  const handleSelectGroup = async (value) => {
    try {
      setLoading(true);
      setSelectedParking(
        allGroups.filter((p) => p.parkingGroupID === value)[0]
      );
      setVehiclesToUnAssign([]);
      if (value) {
        const vehicles = await getParkingVehicles(value);
        setParkingVehicles(vehicles);
        setFilteredParkingVehicles(vehicles);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("error", e);
    }
  };

  const handleAssignVehicles = async () => {
    setLoadingUpdate(true);
    try {
      const method = "assign";
      const vehicleIds = vehiclesToAssign.map((v) => v.VehicleID);
      const response = await updateParkingVehicles(
        selectedParking.parkingGroupID,
        vehicleIds,
        method
      );
      setUnAssignedVehicles((prev) =>
        prev.filter((v) => !vehicleIds.includes(v.VehicleID))
      );
      setFilteredUnAssignedVehicles((prev) =>
        prev.filter((v) => !vehicleIds.includes(v.VehicleID))
      );
      setParkingVehicles((prev) => [...vehiclesToAssign, ...prev]);
      setFilteredParkingVehicles((prev) => [...vehiclesToAssign, ...prev]);
      setVehiclesToAssign([]);
      setLoadingUpdate(false);
      toast.success("vehicles is Assigned Successfully");
    } catch (error) {
      setLoadingUpdate(false);
      toast.error("Something went wrong");
    }
  };

  const handleUnassignVehicles = async () => {
    setLoadingUpdate(true);
    try {
      const method = "unassign";
      const unAssignedIDs = vehiclesToUnAssign.map((v) => v.VehicleID);
      const response = await updateParkingVehicles(
        selectedParking.parkingGroupID,
        unAssignedIDs,
        method
      );
      const newVeh = parkingVehicles.filter((v) =>
        unAssignedIDs.includes(v.VehicleID)
      );
      setParkingVehicles((prev) => {
        let tempArr = prev;
        tempArr = tempArr.filter((v) => !unAssignedIDs.includes(v.VehicleID));
        return tempArr;
      });
      setFilteredParkingVehicles((prev) => {
        let tempArr = prev;
        tempArr = tempArr.filter((v) => !unAssignedIDs.includes(v.VehicleID));
        return tempArr;
      });
      setUnAssignedVehicles((prev) => {
        return [...newVeh, ...prev];
      });
      setFilteredUnAssignedVehicles((prev) => {
        return [...newVeh, ...prev];
      });
      setVehiclesToUnAssign([]);
      setLoadingUpdate(false);
      toast.success("vehicles are Assigned Successfully");
    } catch (error) {
      toast.error("Something went wrong");
      setLoadingUpdate(false);
    }
  };
  const handleFilter = (e) => {
    setTreeFilter(e.target.value);
    e.target.value
      ? setFilteredUnAssignedVehicles(
          unAssignedVehicles.filter((item) => {
            const filterDisplayName = item.DisplayName?.toString()
              .toLocaleLowerCase()
              .replaceAll(" ", "")
              .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
            const filterPlateNumber = item.PlateNumber?.toString()
              .toLocaleLowerCase()
              .replaceAll(" ", "")
              .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
            return filterDisplayName || filterPlateNumber;
          })
        )
      : setFilteredUnAssignedVehicles(unAssignedVehicles);
  };
  const handleFilterParkingVehicles = (e) => {
    setTreeFilter(e.target.value);
    e.target.value
      ? setFilteredParkingVehicles(
          parkingVehicles.filter((item) => {
            const filterDisplayName = item.DisplayName?.toString()
              .toLocaleLowerCase()
              .replaceAll(" ", "")
              .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
            const filterPlateNumber = item.PlateNumber?.toString()
              .toLocaleLowerCase()
              .replaceAll(" ", "")
              .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
            return filterDisplayName || filterPlateNumber;
          })
        )
      : setFilteredParkingVehicles(parkingVehicles);
  };

  return (
    <>
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Card className="management group-management">
        <Card.Body>
          <Row>
            <Col lg="5">
              <h4 className="mb-3">{t("Parkings")}</h4>
              <ReactSelect
                options={dataOptions}
                onSelectChange={handleSelectGroup}
                value={
                  !!selectedParking && {
                    label: selectedParking?.parkingGroupName,
                    value: selectedParking?.parkingGroupID,
                  }
                }
                placeholder={t("please Select parking...")}
              />
            </Col>

            <Col lg="12">
              <Button
                type="Button"
                className="btn btn-primary  px-3 py-2 me-2 add-group"
                onClick={() => setAddModalShow(true)}
              >
                <FontAwesomeIcon className="me-2" icon={faPlus} size="sm" />
                {t("Add Parking")}
              </Button>
              <Button
                type="Button"
                className="btn btn-primary  px-3 py-2 m-2  edit-group"
                onClick={() => setEditModalShow(true)}
                disabled={!selectedParking}
              >
                <EditIcon />
                {t("Edit Parking")}
              </Button>
              <Button
                type="Button"
                disabled={!selectedParking}
                className="btn btn-primary  px-3 py-2 m-2 delete-group"
                onClick={() => setDeleteModalShow(true)}
              >
                <DeleteIcon />
                {t("Delete Parking")}
              </Button>
            </Col>
          </Row>
          <Row className="d-flex justify-content-between mt-3">
            <Col lg="5" className="mb-3">
              <h4 className="mb-3">{t("Parking Vehicles")}</h4>
              <Col lg="12">
                <div className="items-parking-parent ">
                  <CustomInput
                    ClassN="col"
                    Type="text"
                    className="mt-0"
                    Placeholder={t("displayName_or_PlateNumber_key")}
                    handleChange={handleFilterParkingVehicles}
                  />
                  {filteredParkingVehicles?.length > 0 && (
                    <MenuTreeReports
                      vehData={filteredParkingVehicles}
                      vehChecked={vehiclesToUnAssign}
                      setVehChecked={setVehiclesToUnAssign}
                      treeFilter={treeFilter}
                    />
                  )}
                </div>
              </Col>
            </Col>

            <Col
              lg="2"
              className="flex-column justify-content-center d-flex align-items-center "
            >
              <button
                disabled={
                  !vehiclesToAssign.length || !selectedParking || loadingUpdate
                }
                onClick={handleAssignVehicles}
                style={{ width: "160px" }}
                className="btn  btn-primary text-white py-2 px-4 fs-5 d-flex justify-content-center gap-3 align-items-center"
              >
                <AiOutlineLeft className="d-inline-block" />
                <span className="d-inline-block">{t("Assign")}</span>
              </button>

              <button
                disabled={
                  !vehiclesToUnAssign.length ||
                  !selectedParking ||
                  loadingUpdate
                }
                onClick={handleUnassignVehicles}
                style={{ width: "160px" }}
                className="btn btn-danger btn text-white mt-3 py-2 px-4 fs-5 d-flex justify-content-center  gap-3 align-items-center"
              >
                <span className="d-inline-block">{t("Un Assign")}</span>
                <AiOutlineRight />
              </button>
            </Col>

            <Col lg="5" className="">
              <h4 className="mb-3">{t("Out of park")}</h4>
              <div className="items-parking-parent">
                <CustomInput
                  ClassN="col"
                  Type="text"
                  className="mt-0"
                  Placeholder={t("displayName_or_PlateNumber_key")}
                  handleChange={handleFilter}
                />
                {filteredUnAssignedVehicles?.length > 0 && (
                  <MenuTreeReports
                    vehData={filteredUnAssignedVehicles}
                    vehChecked={vehiclesToAssign}
                    setVehChecked={setVehiclesToAssign}
                    treeFilter={treeFilter}
                  />
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <AddParkingModal
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        getParkings={getParkings}
      />
      <EditParkingModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        selectedParking={selectedParking}
        getParkings={getParkings}
        setSelectedParking={setSelectedParking}
      />
      <DeleteModal
        show={deleteModalShow}
        loading={loadingUpdate}
        title={t("Delete_Parking")}
        description={t("Are_you_sure_you_want_to_delete_this_Parking")}
        confirmText={t("Yes_delete_it")}
        cancelText={t("No_cancel")}
        onConfirm={handleDeleteParking}
        onCancel={() => {
          setDeleteModalShow(false);
        }}
      />
    </>
  );
};

export default ManageGroupsVehicles;

// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";

  if (!session || isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "Management",
        "main",
        "Tour",
      ])),
    },
  };
}
