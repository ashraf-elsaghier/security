import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";
import Input from "components/formik/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSession } from "next-auth/client";
import ReactSelect from "components/Select";
import { userValidation } from "helpers/yup-validations/management/VehicleManagement";

const EditUser = ({
  id,
  handleModel,
  editModel,
  GetAssignUsers,
  rolesOptions,
}) => {
  const { t } = useTranslation("Management");
  const [data, setData] = useState({});
  const [aspID, setAspId] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [defaultRole, setDefaultRole] = useState("");
  const [IsIdleLogout, setIsIdleLogout] = useState(false);
  const [Is2FA, setIs2FA] = useState(false);
  const [qrContent, setQrContent] = useState("");
  const session = useSession();
  const userRole = session[0]?.user?.user?.role.toLowerCase();
  const fetchData = async () => {
    try {
      const respond = await axios.get(`dashboard/management/users/data/${id}`);
      setData(respond.data?.user);
      setIsIdleLogout(respond.data?.user?.IsIdleLogout);
      setAspId(respond?.data?.user?.ASPNetUserID);
      setDefaultRole(respond.data?.user?.Role);
      setLoadingPage(false);
      setIs2FA(respond.data?.user?.TwoFactorEnabled);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (defaultRole) {
      const role = rolesOptions.find((role) => role.name == defaultRole);
      setSelectedRole(role || {});
    }
  }, [defaultRole]);
  const initialValues = {
    FirstName: data?.FirstName || "",
    LastName: data?.LastName || "",
    UserName: data?.UserName || "",
    Email: data?.Email || "",
    PhoneNumber: data?.PhoneNumber || "",
    Password: "",
    IdleTime: data?.IdleTime || "",
  };

  const handleChange = (value) => {
    setSelectedRole(value);
  };

  const onSubmit = async (data) => {
    let submitData;
    submitData = {
      ...data,
      RoleID: selectedRole,
      IsIdleLogout: +IsIdleLogout,
      TwoFactorEnabled: +Is2FA,
    };
    if (!IsIdleLogout) {
      delete submitData.IdleTime;
    }
    if (!data.Password) delete submitData.Password;
    if (
      submitData.FirstName &&
      submitData.LastName &&
      submitData.Email &&
      submitData.UserName &&
      submitData.PhoneNumber
    ) {
      setLoading(true);
      try {
        const respond = await axios.put(
          `dashboard/management/users/data/${aspID}`,
          submitData
        );
        toast.success(respond?.data?.message);
        GetAssignUsers();
        setLoading(false);
        if (editModel) {
          handleModel();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something Went Wrong");
        setLoading(false);
      }
    } else {
      toast.error("please fill all fields");
    }
  };

  const getQRCodeImg = async () => {
    try {
      const res = await axios.post("register-2fa", {
        username: data.UserName,
      });
      setQrContent(res.data.qrcodeData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Is2FA && !qrContent.length && data.TwoFactorEnabled) {
      getQRCodeImg();
    }
  }, [Is2FA]);

  return (
    <div className="container-fluid">
      {loadingPage && <h3 className="text-center pt-5 pb-5">loading...</h3>}
      {!loadingPage && (
        <Card>
          {!editModel && (
            <Card.Header className="h3">
              {t("Update_User_Information")}
            </Card.Header>
          )}
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={userValidation}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md="12" lg="6">
                        <Input
                          placeholder={t("First_Name")}
                          label={t("First_Name")}
                          name="FirstName"
                          type="text"
                          className={"mb-3"}
                        />
                      </Col>
                      <Col md="12" lg="6">
                        <Input
                          placeholder={t("Last_Name")}
                          label={t("Last_Name")}
                          name="LastName"
                          type="text"
                          className={"mb-3"}
                        />
                      </Col>
                      <Col md="12" lg="6">
                        <Input
                          placeholder={t("User_Name")}
                          label={t("User_Name")}
                          name="UserName"
                          type="text"
                          className={"mb-3"}
                        />
                      </Col>
                      <Col md="12" lg="6">
                        <Input
                          placeholder={t("Email")}
                          label={t("Email")}
                          name="Email"
                          type="email"
                          className={" mb-3"}
                        />
                      </Col>
                      <Col md="12" lg="6">
                        <Input
                          placeholder={t("Phone_Number")}
                          label={t("Phone_Number")}
                          name="PhoneNumber"
                          type="text"
                          className={"mb-3"}
                        />
                      </Col>
                      <Col md="12" lg="6">
                        <Input
                          id={"pwd"}
                          placeholder={t("Password")}
                          label={t("Password")}
                          name="Password"
                          type="password"
                          className={"mb-3"}
                        />
                      </Col>
                      {(userRole === "support" || userRole === "admin") && (
                        <>
                          <Col md="12" lg="6">
                            <label>{t("User_Role")}</label>
                            <ReactSelect
                              defaultValue={selectedRole}
                              onSelectChange={handleChange}
                              options={rolesOptions}
                              placeholder={t("Select User Role")}
                              Style={{ marginLeft: "0.7rem" }}
                              className="mb-3  mt-1"
                              cuStyles={{
                                minHeight: "30px",
                              }}
                            />
                          </Col>
                          <Col md="12" lg="6">
                            <label>{t("Enable 2FA")}</label>
                            <Form.Check
                              type="switch"
                              className="mb-3 mt-2"
                              checked={Is2FA}
                              onChange={(e) => setIs2FA(e.target.checked)}
                              name="is2FA"
                            />
                          </Col>

                          <Col md="12" lg="6">
                            <label>{t("Enable Idle Feature")}</label>
                            <Form.Check
                              type="switch"
                              className="mb-3 mt-2"
                              checked={IsIdleLogout}
                              onChange={(e) =>
                                setIsIdleLogout(e.target.checked)
                              }
                              name="IdleLogout"
                            />
                          </Col>
                          {IsIdleLogout && (
                            <Col md="12" lg="6">
                              <Input
                                placeholder={t("Allowed Idle Time in minutes")}
                                label={t("Allowed Idle Time in minutes")}
                                name="IdleTime"
                                type="number"
                                className={"mb-3"}
                                min={1}
                                max={60}
                              />
                            </Col>
                          )}
                          <Col md="12">
                            {qrContent?.length > 0 && Is2FA && (
                              <>
                                <p className="text-center fs-5">
                                  Scan the image below with the two factor
                                  authentication app on your phone.
                                </p>
                                <div className="d-flex justify-content-center">
                                  <img src={qrContent} alt="QR Code" />
                                </div>
                              </>
                            )}
                          </Col>
                        </>
                      )}
                    </Row>

                    <div className="w-100 d-flex flex-wrap flex-md-nowrap">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-2 text-nowrap me-3 ms-0  mb-2 mb-md-0"
                      >
                        {!loading ? (
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faCheck}
                            size="sm"
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="mx-2 fa-spin"
                            icon={faSpinner}
                            size="sm"
                          />
                        )}
                        {t("Save")}
                      </Button>
                      <Button
                        type="button"
                        className="px-3 py-2 text-nowrap me-3 ms-0  mb-2 mb-md-0"
                        onClick={() => {
                          handleModel();
                        }}
                      >
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faTimes}
                          size="sm"
                        />
                        {t("cancel")}
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
export default EditUser;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}
// translation ##################################
