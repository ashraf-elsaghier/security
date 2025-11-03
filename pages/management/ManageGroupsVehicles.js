import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import {
  faPen,
  faTrash,
  faPlus,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Formik } from "formik";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { toast } from "react-toastify";
import {
  getAllVehicles,
  addGroups,
  updateGroups,
  assigndata,
} from "/services/management/ManageGroups";
import { encryptName } from "../../helpers/encryptions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggle as tourToggle, disableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import { CustomInput } from "components/CustomInput";
import { getSession } from "next-auth/client";
import { addGroup, deleteGroup, editGroup } from "lib/slices/groups";
import { UpdateVehicle } from "lib/slices/StreamData";
const ManageGroupsVehicles = ({ settBtnRef }) => {
  const { t } = useTranslation(["Management", "Tour"]);
  // all groups in shape of label and value of all gropus
  const [dataoptions, setDataoptions] = useState([]);

  const { darkMode } = useSelector((state) => state.config);

  // check if loading or not
  const [load, setLoad] = useState(false);
  const { groups: userGroups } = useSelector((state) => state.groups);
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
  // all groups
  const [allGroups, setAllGroups] = useState([]);
  const [filteredUnGrouppedVehs, setFilteredUnGrouppedVehs] = useState([]);

  // all un groups
  const { VehFullData } = useSelector((state) => state.streamData);
  const [allunGroups, setunAllGroups] = useState([]);

  // all vehicles  og grops
  const [vehicleGroup, setVehicleGroup] = useState([]);
  // check loading or not ?
  const [loading, setLoading] = useState(false);
  // check if chage in select (disabled buttons)
  const [check, setCheck] = useState(true);

  // state to get if when onchange
  const [getid, setGetId] = useState("");

  // variable to fillters when edit
  const editGroups = allGroups.find((items) => items.ID == getid);
  useEffect(() => {
    setunAllGroups(VehFullData?.filter((i) => i.GroupID === null));
    setFilteredUnGrouppedVehs(VehFullData?.filter((i) => i.GroupID === null));
  }, [VehFullData]);
  // use state to put all selects  into arrays1
  const [checkarray, setCheckarray] = useState([]);
  // check inputs of checks  unassign bottons
  const [checkinput, setCheckInput] = useState(null);
  const [checkunasignbtn, setcheckunasignbtn] = useState(false);

  //  asign bottons
  const [checkinputassing, setCheckInputassign] = useState(null);
  const [checkasignbtn, setcheckasignbtn] = useState(false);
  // use state to put all selects  into arrays2
  const [checkarray2, setCheckarray2] = useState([]);

  // control in value of react select
  const [controldefault, setControldefault] = useState({
    label: t("select..."),
    value: "",
  });

  // function to add new Groups
  const AddGroups = async (values) => {
    setLoad(true);
    try {
      setLoad(false);
      const response = await addGroups(values);
      if (response.status == 201) {
        setLoad(false);
        dispatch(addGroup(response.data.data));
        toast.success("you added Group successfully");
      }
    } catch (e) {
      setLoad(false);
    }
  };
  // function to edit name of groups
  const EditGroup = async (value) => {
    try {
      const response = await updateGroups(editGroups.ID, value);
      dispatch(editGroup(response.result));
      setControldefault({ label: value.Name, value: editGroups.ID });
      toast.success(`${value.Name} updated seccessfully`);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  // function to delet group
  const DeletGroup = async (id, hideModel) => {
    localStorage.removeItem("groups");

    try {
      const response = await axios({
        method: "delete",
        url: `/dashboard/management/groups/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        toast.success(`${editGroups?.Name} deleted successfully`);
        dispatch(deleteGroup(id));
        // To transfer vech to unassign
        const newTransferdata = vehicleGroup.map((items) => ({
          VehicleID: items.VehicleId,
          DisplayName: items.Vehicle,
        }));
        setunAllGroups([...allunGroups, ...newTransferdata]);
        setVehicleGroup([]);
        setControldefault({ label: "select...", value: "" });
        hideModel();
      }
    } catch (e) {
      toast.error(`${e.response?.data?.message}`);
      setControldefault({ label: "select...", value: "" });
      setDataoptions(dataoptions.filter((items) => items.value !== id));
      setAllGroups(allGroups.filter((items) => items.ID !== id));
      hideModel();
    }
  };
  function AddGroupModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="justify-content-center align-items-center d-flex group-management"
      >
        <Modal.Header
          closeButton
          style={darkMode ? { backgroundColor: "#222738" } : {}}
        >
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Add Group")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={darkMode ? { backgroundColor: "#222738" } : {}}>
          <Row className="d-flex justify-content-center">
            <Col md="12">
              <Formik
                initialValues={{ Name: "", ParentGroupID: null }}
                validate={(values) => {
                  const errors = {};
                  if (!values.Name) {
                    errors.Name = "Group Name is Required";
                  }
                  return errors;
                }}
                onSubmit={(values) => {
                  AddGroups(values);
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row className="p-3 mb-3">
                      <Col lg="12">
                        <Form.Group
                          className="form-group"
                          controlId="validationCustom01"
                        >
                          <Form.Label htmlFor="groupName">
                            {t("Group Name")}
                          </Form.Label>
                          <Form.Control
                            name="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Name}
                            type="text"
                            required
                          />
                          <p className="my-3 text-danger">
                            {errors.Name && touched.Name && errors.Name}
                          </p>
                        </Form.Group>
                      </Col>
                      <Col lg="12">
                        <div className="mb-3">
                          <Form.Group className="form-group">
                            <ReactSelect
                              options={dataoptions}
                              label={t("ParentGroupID")}
                              placeholder={t("ParentGroupID")}
                              name="ParentGroupID"
                              className={"col-12 mb-3"}
                              isSearchable={true}
                              isObject={false}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Modal.Footer>
                        <div className="mt-5 d-flex justify-content-end">
                          <button
                            className="btn btn-primary px-3 py-2 ms-3"
                            type="submit"
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faCheck}
                              size="sm"
                            />
                            {load ? "loading.." : `${t("submit")}`}
                          </button>
                          <button
                            className="btn btn-primary px-3 py-2 ms-3"
                            onClick={props.onHide}
                            type="button"
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faTimes}
                              size="sm"
                            />
                            {t("cancel")}
                          </button>
                        </div>
                      </Modal.Footer>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  function AddGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          className="btn btn-primary  px-3 py-2 m-2 add-group"
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPlus} size="sm" />
          {t("Add Group")}
        </Button>

        <AddGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }

  //  Modals for Edit Group & Edit Group
  function EditGroupModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="justify-content-center align-items-center d-flex"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Edit Group")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="d-flex justify-content-center">
            <Col md="12">
              <Formik
                initialValues={{ Name: editGroups ? editGroups.Name : "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.Name) {
                    errors.Name = "Group Name is Required";
                  }
                  return errors;
                }}
                onSubmit={(values) => {
                  EditGroup(values);
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row className="p-3 mb-3">
                      <Col lg="12">
                        <Form.Group
                          className="form-group"
                          controlId="validationCustom01"
                        >
                          <Form.Label htmlFor="groupName">
                            {t("Group Name")}
                          </Form.Label>
                          <Form.Control
                            name="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Name}
                            type="text"
                            required
                          />
                          <p className="my-3 text-danger">
                            {errors.Name && touched.Name && errors.Name}
                          </p>
                        </Form.Group>
                      </Col>

                      <Modal.Footer>
                        <div className="mt-5 d-flex justify-content-end">
                          <button
                            className="btn btn-primary px-3 py-2 ms-3"
                            type="submit"
                            onClick={props.onHide}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faCheck}
                              size="sm"
                            />
                            {t("submit")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary px-3 py-2 ms-3"
                            onClick={props.onHide}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faTimes}
                              size="sm"
                            />
                            {t("cancel")}
                          </button>
                        </div>
                      </Modal.Footer>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  function EditGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          disabled={!controldefault?.value}
          className="btn btn-primary  px-3 py-2 m-2  edit-group"
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPen} size="sm" />
          {t("Edit Group")}
        </Button>

        <EditGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }

  //  Modals for Delecte Group
  function DeleteGroupModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="justify-content-center align-items-center d-flex"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("Delete Group")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">
            `{t("Are you sure you want to delete")} {editGroups?.Name} Group?`
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="mt-5 d-flex justify-content-end">
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
              onClick={() => DeletGroup(editGroups?.ID, props.onHide)}
            >
              <FontAwesomeIcon className="mx-2" icon={faTrash} size="sm" />
              {t("Delete")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={props.onHide}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel")}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  function DeleteGroupBtn() {
    const [modalShow, setModalShow] = useState(false);

    return (
      <>
        <Button
          type="Button"
          disabled={!controldefault?.value}
          className="btn btn-primary  px-3 py-2 m-2 delete-group"
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon className="me-2" icon={faTrash} size="sm" />
          {t("Delete Group")}
        </Button>

        <DeleteGroupModal show={modalShow} onHide={() => setModalShow(false)} />
      </>
    );
  }

  // function to get all groups in select
  useEffect(async () => {
    try {
      const selectOpt = userGroups.map((items) => ({
        label: items.Name,
        value: items.ID,
      }));

      setDataoptions(selectOpt);
      setAllGroups(userGroups);
    } catch (e) {
      console.log("error", e);
    }
  }, [userGroups]);
  // function to get all vehicles
  const handleSelectGroup = async (value) => {
    setLoading(true);
    setGetId(value?.value);
    setControldefault(value);
    value !== undefined ? setCheck(false) : setCheck(true);

    try {
      const allvehicles = await getAllVehicles(value?.value);
      const data = allvehicles.vehicles;
      setLoading(false);
      const vehicles = data.map((items) => items);
      setVehicleGroup(vehicles);
      setFilteredGrouppedVehs(vehicles);
      return vehicles;
    } catch (e) {
      console.log("error", e);
    }
  };

  // function un asign group
  const unasign = async () => {
    const data = {
      vehicles: checkarray,
      groupId: null,
    };
    setcheckunasignbtn(true);

    if (vehicleGroup.length > 0 && checkarray.length > 0) {
      try {
        const response = await assigndata(data);
        if (response.status == 200) {
          toast.success("you updated successfully :)");
          const transferdata = vehicleGroup.filter((items) =>
            checkarray.includes(items.VehicleId)
          );
          transferdata.forEach((v) => {
            dispatch(
              UpdateVehicle({
                isPatched: false,
                patch: { VehicleID: v.VehicleId, GroupID: null },
              })
            );
          });
          setCheckarray([]);
          setCheckInput(false);
          setcheckunasignbtn(false);
          handleSelectGroup({ label: editGroups.Name, value: editGroups?.ID });
          localStorage.removeItem(encryptName("userData"));
        }
      } catch (err) {
        setCheckInput(false);
        setcheckunasignbtn(false);
      }
    } else {
      toast.error("no Vehicles available");
      setcheckunasignbtn(false);
    }
  };

  // function assign group
  const assign = async () => {
    setcheckasignbtn(true);
    const data = {
      vehicles: checkarray2,
      groupId: editGroups?.ID,
    };
    if (checkarray2.length < 1) {
      toast.error("No data selected in ungrouped vehicles");
      setcheckasignbtn(false);
    } else if (data.groupId == undefined || null) {
      toast.error("You must choose group to assign ");
      setcheckasignbtn(false);
    } else {
      try {
        const response = await assigndata(data);
        if (response.status == 200) {
          localStorage.removeItem(encryptName("userData"));
          setcheckasignbtn(false);
          toast.success(`${response.data.message}`);
          handleSelectGroup({ label: editGroups.Name, value: editGroups?.ID });
          const transferdata = allunGroups.filter((items) =>
            checkarray2.includes(items.VehicleID)
          );
          transferdata.forEach((v) => {
            dispatch(
              UpdateVehicle({
                isPatched: false,
                patch: { VehicleID: v.VehicleID, GroupID: editGroups?.ID },
              })
            );
          });
          setCheckInputassign(false);
          setCheckarray2([]);
          localStorage.removeItem(encryptName("userData"));
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  // function to get array from checkbox

  const checkboxArray = (value, word, data) => {
    if (word == "unassign") {
      setCheckInput(null);
      // add to list
      if (value) {
        setCheckarray([...checkarray, data]);
      } else {
        // remove from list
        setCheckarray(checkarray.filter((item) => item !== data));
      }
    } else if (word == "assign") {
      setCheckInputassign(null);
      // add to list
      if (value) {
        setCheckarray2([...checkarray2, data]);
      } else {
        // remove from list
        setCheckarray2(checkarray2.filter((item) => item !== data));
      }
    }
  };
  // filtered unGroupped vehs
  const handleFilterUnGrouppedVehs = (e) => {
    const filteredUnGrouppedVehs = allunGroups.filter((item) => {
      const filterDisplayName = item.DisplayName?.toString()
        .toLowerCase()
        .replaceAll(" ", "")
        .includes(e.target.value.toLowerCase().replaceAll(" ", ""));
      const filterPlateNumber = item.PlateNumber?.toString()
        .toLocaleLowerCase()
        .replaceAll(" ", "")
        .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
      return filterDisplayName || filterPlateNumber;
    });
    setFilteredUnGrouppedVehs(
      e.target.value
        ? filteredUnGrouppedVehs
        : VehFullData?.filter((i) => i.GroupID === null)
    );
  };
  // filtered Groupped vehs
  const [filteredGrouppedVehs, setFilteredGrouppedVehs] = useState([]);
  const handleFilteredGrouppedVehs = (e) => {
    const filteredGrouppedVehs = vehicleGroup.filter((item) => {
      const filteredVehicle = item.Vehicle?.toString()
        .toLowerCase()
        .replaceAll(" ", "")
        .includes(e.target.value.toLowerCase().replaceAll(" ", ""));
      return filteredVehicle;
    });
    setFilteredGrouppedVehs(
      e.target.value ? filteredGrouppedVehs : vehicleGroup
    );
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
          <Row className="mb-2">
            <Col lg="5">
              <div>
                <Form.Group className="form-group select-group">
                  <h4 className="mb-3">{t("Select Group")}</h4>
                  <Select
                    options={dataoptions}
                    onChange={handleSelectGroup}
                    value={controldefault}
                  />
                </Form.Group>
              </div>
            </Col>
            <Col lg="12">
              <div>
                <AddGroupBtn />
                <EditGroupBtn />
                <DeleteGroupBtn />
              </div>
            </Col>
          </Row>
          <Row className="d-flex justify-content-between">
            <Col lg="5" className="mb-3 ">
              <Row>
                <Col lg="12">
                  <h4 className="mb-3">{t("Grouped Vehicles")}</h4>
                  <div className=" vehicle-table  management-container">
                    <CustomInput
                      ClassN="col"
                      Type="text"
                      className="mt-0"
                      Placeholder={t("displayName_or_PlateNumber_key")}
                      handleChange={handleFilteredGrouppedVehs}
                    />
                    <ul
                      className={`items-grouped ${
                        !filteredGrouppedVehs.length
                          ? " d-flex align-items-center justify-content-center"
                          : ""
                      }`}
                    >
                      {loading ? (
                        <h2>{t("please wait Data")} ... </h2>
                      ) : filteredGrouppedVehs?.length > 0 ? (
                        filteredGrouppedVehs?.map((items) => (
                          <li key={items.VehicleId}>
                            <label
                              className="  d-flex "
                              style={{ cursor: "pointer" }}
                            >
                              <input
                                checked={checkinput}
                                value={items.VehicleId}
                                onChange={(e) => {
                                  checkboxArray(
                                    e.target.checked,
                                    "unassign",
                                    items?.VehicleId
                                  );
                                }}
                                type="checkbox"
                                name="346"
                              />
                              {items.Vehicle}
                            </label>
                          </li>
                        ))
                      ) : (
                        <h2>{t("No Vehicles in this Group")}</h2>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              lg="2"
              className="flex-column justify-content-center d-flex align-items-center "
            >
              <div className="items-buttons">
                <button
                  disabled={!checkarray2.length}
                  onClick={assign}
                  style={{ backgroundColor: "#0E6395" }}
                  className="btn  text-white w-100 py-1 fs-5 assign-group"
                >
                  <AiOutlineLeft />
                  {t("Assign")}
                </button>
                <button
                  disabled={!checkarray.length}
                  onClick={unasign}
                  className="btn btn-danger w-100 py-1 fs-5 my-4 unassign-group"
                >
                  {" "}
                  {t("Un Assign")}
                  <AiOutlineRight />
                </button>
              </div>
            </Col>

            <Col lg="5" className="mb-3">
              <div className="ungrouped">
                <h4 className="mb-3">{t("Ungrouped Vehicles")}</h4>

                <div className=" management-container">
                  <CustomInput
                    ClassN="col"
                    Type="text"
                    className="mt-0"
                    Placeholder={t("displayName_or_PlateNumber_key")}
                    handleChange={handleFilterUnGrouppedVehs}
                  />
                  <ul
                    className={`items-ungrouped ungrouped-group  ${
                      !filteredUnGrouppedVehs?.length
                        ? " d-flex align-items-center justify-content-center"
                        : ""
                    }`}
                  >
                    {filteredUnGrouppedVehs?.length > 0 ? (
                      filteredUnGrouppedVehs?.map((items) => {
                        return (
                          <li key={items.VehicleID}>
                            <label
                              className="  d-flex "
                              style={{ cursor: "pointer" }}
                            >
                              <input
                                checked={checkinputassing}
                                value={items?.VehicleID}
                                onChange={(e) => {
                                  checkboxArray(
                                    e.target.checked,
                                    "assign",
                                    items?.VehicleID
                                  );
                                }}
                                type="checkbox"
                                name="346"
                                id="60657"
                              />
                              {items.PlateNumber} ({items?.DisplayName})
                            </label>
                          </li>
                        );
                      })
                    ) : (
                      <h2>{t("No Vehicles")}</h2>
                    )}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ManageGroupsVehicles;

// // translation ##################################

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const userRole = session?.user?.user?.role?.toLowerCase();
  if (!session || userRole === "user") {
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
// translation ##################################
