import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "rc-tree/assets/index.css";
import { toast } from "react-toastify";
import { assignVehicles } from "../../../../../services/management/VehicleManagement";
import MenuTreeReports from "components/tree/MenuTreeReports";
import { CustomInput } from "components/CustomInput";
import { useTranslation } from "next-i18next";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const userManages = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [AssignedVehicles, setAssignedVehicles] = useState([]);
  const [UnAssignedVehicles, setUnAssignedVehicles] = useState([]);
  const [checkedAssignedVehicles, setCheckedAssignedVehicles] = useState([]);
  const [filteredAssignedVehicles, setFilteredAssignedVehicles] = useState([]);
  const [checkedUnAssignedVehicles, setCheckedUnAssignedVehicles] = useState(
    []
  );
  const [filteredUnAssignedVehicles, setFilteredUnAssignedVehicles] = useState(
    []
  );
  const [treeFilter, setTreeFilter] = useState("");
  const { t } = useTranslation(["Management", "Tour"]);
  const id = router.query.id;
  const GetUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`dashboard/management/users/data/${id}`);
      const { data } = await axios.get(
        `dashboard/management/users/vehicles/${response?.data?.user?.ASPNetUserID}`
      );
      setAssignedVehicles(data.assignedVehicles);
      setUnAssignedVehicles(data.unAssignedVehicles);
      setFilteredAssignedVehicles(data.assignedVehicles);
      setFilteredUnAssignedVehicles(data.unAssignedVehicles);
      setUser(response?.data?.user);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) GetUser();
  }, [id]);
  async function unAssign() {
    let unAssignObj = {
      Type: "unassign",
      VehicleIDs: [],
    };
    const vIDs = checkedAssignedVehicles.map((v) => v.VehicleID);
    checkedAssignedVehicles.map((el) => {
      unAssignObj.VehicleIDs.push({
        vehilceId: el.VehicleID,
        groupId: el.GroupID,
      });
    });
    try {
      const response = await assignVehicles(unAssignObj, user?.ASPNetUserID);
      toast.success(response?.message);
      setFilteredAssignedVehicles((prev) =>
        prev.filter((v) => !vIDs.includes(v?.VehicleID))
      );
      setAssignedVehicles((prev) =>
        prev.filter((v) => !vIDs.includes(v?.VehicleID))
      );
      setUnAssignedVehicles([
        ...checkedAssignedVehicles,
        ...UnAssignedVehicles,
      ]);
      setFilteredUnAssignedVehicles([
        ...checkedAssignedVehicles,
        ...UnAssignedVehicles,
      ]);
      setCheckedAssignedVehicles([]);
      toast.success(response?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  async function assign() {
    let assignObj = {
      Type: "assign",
      VehicleIDs: [],
    };
    const vIDs = checkedUnAssignedVehicles.map((v) => v.VehicleID);
    checkedUnAssignedVehicles.map((el) => {
      assignObj.VehicleIDs.push({
        vehilceId: el.VehicleID,
        groupId: el.GroupID,
      });
    });
    try {
      const response = await assignVehicles(assignObj, user?.ASPNetUserID);
      setUnAssignedVehicles((prev) =>
        prev.filter((v) => !vIDs.includes(v?.VehicleID))
      );
      setFilteredUnAssignedVehicles((prev) =>
        prev.filter((v) => !vIDs.includes(v?.VehicleID))
      );
      setAssignedVehicles([...checkedUnAssignedVehicles, ...AssignedVehicles]);
      setFilteredAssignedVehicles([
        ...checkedUnAssignedVehicles,
        ...AssignedVehicles,
      ]);
      setCheckedUnAssignedVehicles([]);
      toast.success(response?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  const handleFilter = (e) => {
    setTreeFilter(e.target.value);
    e.target.value
      ? setFilteredUnAssignedVehicles(
          UnAssignedVehicles.filter((item) => {
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
      : setFilteredUnAssignedVehicles(UnAssignedVehicles);
  };
  const handleFilterAssignedVehicles = (e) => {
    setTreeFilter(e.target.value);

    e.target.value
      ? setFilteredAssignedVehicles(
          AssignedVehicles.filter((item) => {
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
      : setFilteredAssignedVehicles(AssignedVehicles);
  };
  return (
    <>
      <Card className="management group-management">
        <Card.Body>
          <div className="d-flex align-items-center">
            <h3>User : </h3>
            <h4 className="mb-0 ms-3 mt-2 " style={{ color: "#2C7BC6" }}>
              {user ? user?.FirstName + " " + user?.LastName : "Loading..."}
            </h4>
          </div>
          <hr />
          <Row className="d-flex justify-content-between mt-3">
            {/* Assign Vehicles */}
            <Col lg="5" className="mb-3">
              <h4 className="mb-3">{t("Assigned Vehicles")}</h4>
              <Col lg="12">
                <div className="items-parking-parent">
                  <CustomInput
                    ClassN="col"
                    Type="text"
                    className="mt-0"
                    Placeholder={t("displayName_or_PlateNumber_key")}
                    handleChange={handleFilterAssignedVehicles}
                  />
                  {filteredAssignedVehicles.length > 0 && (
                    <MenuTreeReports
                      vehData={filteredAssignedVehicles}
                      vehChecked={checkedAssignedVehicles}
                      setVehChecked={setCheckedAssignedVehicles}
                      userId={user?.ASPNetUserID}
                      fromManagment
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
                disabled={!checkedUnAssignedVehicles.length}
                onClick={assign}
                style={{ width: "160px" }}
                className="btn  btn-primary text-white py-2 px-4 fs-5 d-flex justify-content-center gap-3 align-items-center"
              >
                <AiOutlineLeft className="d-inline-block" />
                <span className="d-inline-block">{t("Assign")}</span>
              </button>
              <button
                disabled={!checkedAssignedVehicles.length}
                onClick={unAssign}
                style={{ width: "160px" }}
                className="btn btn-danger btn text-white mt-3 py-2 px-4 fs-5 d-flex justify-content-center  gap-3 align-items-center"
              >
                <span className="d-inline-block">{t("Un Assign")}</span>
                <AiOutlineRight />
              </button>
            </Col>

            <Col lg="5" className="mb-3">
              <h4 className="mb-3">{t("UnAssign Vehicles")}</h4>
              <div className="items-parking-parent">
                <CustomInput
                  ClassN="col"
                  Type="text"
                  className="mt-0"
                  Placeholder={t("displayName_or_PlateNumber_key")}
                  handleChange={handleFilter}
                />
                {filteredUnAssignedVehicles.length > 0 && (
                  <MenuTreeReports
                    vehData={filteredUnAssignedVehicles}
                    vehChecked={checkedUnAssignedVehicles}
                    setVehChecked={setCheckedUnAssignedVehicles}
                    userId={user?.ASPNetUserID}
                    treeFilter={treeFilter}
                    fromManagment
                  />
                )}
              </div>
            </Col>

            {/* two buttons
            <Col md="2">
              <div
                className="d-flex flex-column justify-content-center"
                style={{ minHeight: "70vh", maxWidth: "auto" }}
              >
                <button
                  className="btn btn-info mb-3 py-2  fw-bolder"
                  onClick={assign}
                  disabled={disableAssignBtn}
                >
                  {disableAssignBtn ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ) : (
                    "Assign"
                  )}
                </button>
                <button
                  className="btn btn-success py-2  fw-bolder"
                  onClick={unAssign}
                  disabled={disableUnAssignBtn}
                >
                  {disableUnAssignBtn ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ) : (
                    "UnAssign"
                  )}
                </button>
              </div>
            </Col> */}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "Management",
        "main",
        "common",
      ])),
    },
  };
}
export default userManages;
