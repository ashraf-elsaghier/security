import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, FormCheck, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { add, empty } from "../../../lib/slices/accountInfo";
import { Formik } from "formik";
import { addFormData } from "../../../lib/slices/addForm";
import { useSession } from "next-auth/client";
import { toast } from "react-toastify";
import axios from "axios";

const CreateAdminUser = () => {
  const { t } = useTranslation("Management");
  const dispatch = useDispatch();

  const [session] = useSession();
  const id = session?.user?.id || session?.user?.user?.id;

  const router = useRouter();
  // dataredux
  const dataRedux = useSelector((item) => item.addFormDatas.data);

  // function handle prev buttons
  const handlePrev = () => {
    router.push("/management/account-management/AccountWizard");
  };

  // function handle data redux
  const handledata = async (data) => {
    dispatch(addFormData({ adminUser: data }));
    // setCheck(true);
    if (!dataRedux?.account?.AccountName) {
      router.push("/management/account-management/AccountWizard");
      toast.error("please Fill Account Name ");
    } else {
      const payload = {
        adminUser: data,
      };
      dispatch(addFormData(payload));
      try {
        const response = await axios({
          method: "post",
          url: "dashboard/management/accounts",
          data: { ...dataRedux, ...payload },
        });
        // setCheck(false);
        dispatch(addFormData({ clear: true }));
        localStorage.removeItem("formData");
        toast.success(`${response.data.message}`);
        router.push(`/management/account-management/${id}`);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        if (
          error?.response?.data?.message ===
          "user name already taken, choose another one"
        ) {
          router.back();
        }

        // setCheck(false);
      }
    }

    // router.push("/management/account-management/SubScription");
  };

  useEffect(() => {
    if (!dataRedux?.account?.AccountName) {
      router.push(`/management/account-management/${id}`);
    }
  }, []);

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(addFormData({ clear: true }));
    localStorage.removeItem("formData");
    router.push(`/management/account-management/${id}`);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Row className=" d-flex justify-content-center mb-5">
            <Col lg="8">
              <Formik
                initialValues={{
                  FirstName: dataRedux?.adminUser?.FirstName || "",
                  LastName: dataRedux?.adminUser?.LastName || "",
                  UserName: dataRedux?.adminUser?.UserName || "",
                  Email: dataRedux?.adminUser?.Email || "",
                  PhoneNumber: dataRedux?.adminUser?.PhoneNumber || "",
                  // password: dataRedux?.adminUser?.password || "",
                  // confirmPassword: dataRedux?.adminUser?.confirmPassword || "",
                  EmailConfirmed: 1,
                  PhoneNumberConfirmed: 1,
                  TwoFactorEnabled: 1,
                  LockoutEnabled: 0,
                  AccessFailedCount: 0,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.FirstName) {
                    errors.FirstName = "firstName is Required";
                  }
                  if (!values.LastName) {
                    errors.LastName = "lastName is Required";
                  }
                  if (!values.UserName) {
                    errors.UserName = "userName is Required";
                  }
                  if (!values.PhoneNumber) {
                    errors.PhoneNumber = "phonenumber is Required";
                  }
                  // if (!values.password) {
                  //   errors.password = "password is Required";
                  // } else if (
                  //   values.password &&
                  //   values.password !== values.confirmPassword
                  // ) {
                  //   errors.confirmPassword =
                  //     "confirm passwords isn,t matche with  password  ";
                  // }

                  return errors;
                }}
                onSubmit={(values, errors) => {
                  handledata(values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <>
                    <Form className="mt-5" onSubmit={handleSubmit}>
                      <Row className="p-3 mb-3">
                        {/* first name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="firstName">
                              {t("First_Name")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="firstName"
                              value={values.FirstName}
                              onChange={handleChange}
                              name="FirstName"
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.FirstName &&
                              touched.FirstName &&
                              errors.FirstName}{" "}
                          </p>
                        </Col>
                        {/* last name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="lastName">
                              {t("Last_Name")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="lastName"
                              value={values.LastName}
                              onChange={handleChange}
                              name="LastName"
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.LastName &&
                              touched.LastName &&
                              errors.LastName}{" "}
                          </p>
                        </Col>
                        {/* user name */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="userName">
                              {t("User_Name")}
                            </Form.Label>
                            <Form.Control
                              name="UserName"
                              value={values.UserName}
                              onChange={handleChange}
                              type="text"
                              id="userName"
                              required
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.UseName &&
                              touched.UseName &&
                              errors.UseName}{" "}
                          </p>
                        </Col>
                        {/* email  */}
                        <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email">
                              {t("Email")}
                            </Form.Label>
                            <Form.Control
                              name="Email"
                              value={values.Email}
                              onChange={handleChange}
                              type="email"
                              id="email"
                            />
                          </Form.Group>
                        </Col>
                        {/* phone number */}
                        <Col md="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="phoneNumber">
                              {t("Phone_Number")}
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="PhoneNumber"
                              value={values.PhoneNumber}
                              onChange={handleChange}
                              id="phoneNumber"
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.PhoneNumber &&
                              touched.PhoneNumber &&
                              errors.PhoneNumber}{" "}
                          </p>
                        </Col>
                        {/* password */}
                        {/* <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="fPass">
                              {t("setting:Password")}
                            </Form.Label>
                            <Form.Control
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              type="password"
                              id="fPass"
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.password &&
                              touched.password &&
                              errors.password}{" "}
                          </p>
                        </Col> */}
                        {/* confirm password */}
                        {/* <Col md="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="lPass">
                              {t("setting:Confirm_Password")}
                            </Form.Label>
                            <Form.Control
                              name="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              type="password"
                              id="lPass"
                            />
                          </Form.Group>
                          <p className="text-danger mb-3">
                            {errors.confirmPassword &&
                              touched.confirmPassword &&
                              errors.confirmPassword}{" "}
                          </p>
                        </Col> */}
                        <Col sm="12">
                          <div className="mt-5 d-flex justify-content-end">
                            {/* <button
                        className="btn btn-primary px-3 py-2 ms-3"
                        type="submit"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faArrowRight}
                          size="sm"
                        />
                        {t("Next")}
                      </button> */}
                            <Button
                              type="button"
                              className="btn btn-primary px-3 py-2 ms-3"
                              onClick={handlePrev}
                            >
                              {" "}
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowLeft}
                                size="sm"
                              />
                              {t("Prev")}
                            </Button>
                            <Button
                              type="submit"
                              className="btn btn-primary px-3 py-2 ms-3"
                            >
                              {" "}
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowRight}
                                size="sm"
                              />
                              {t("Finish")}
                            </Button>
                            {/*<button className="btn btn-primary px-3 py-2 ms-3">
                  <FontAwesomeIcon
                    className="me-2"
                    icon={faArrowLeft}
                    size="sm"
                  />

                  {t("Back")}
                </button>
                <button className="btn btn-primary px-3 py-2 ms-3">
                  <FontAwesomeIcon className="me-2" icon={faCheck} size="sm" />
                  {t("Finish")}
                </button>*/}
                            <button
                              type="button"
                              className="btn btn-primary px-3 py-2 ms-3 "
                              onClick={() =>
                                handleDeleteAllDataWithGoToMainPage()
                              }
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faTimes}
                                size="sm"
                              />
                              {t("Cancel")}
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </Formik>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default CreateAdminUser;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "Management",
        "setting",
        "main",
      ])),
    },
  };
}
// translation ##################################
