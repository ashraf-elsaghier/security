import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, FormCheck } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import { FixedSizeList as List } from "react-window";

const model = [
  { value: 1, label: "General" },
  { value: 2, label: "Rental" },
  { value: 3, label: "E Rent" },
  { value: 4, label: "TGA" },
  { value: 5, label: "FMS" },
  { value: 6, label: "SFDA" },
  { value: 7, label: "Cold Chain" },
  { value: 10, label: "SPECIALITY TRANSPORT" },
  { value: 11, label: "BUS RENTAL" },
  { value: 12, label: "EDUCATIONAL TRANSPORT" },
];

// bussiness type options
const bussiness = [
  { value: 1, label: "Corporate" },

  { value: 2, label: "Individual" },
];

// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchData } from "../../../helpers/helpers";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";

import { addFormData } from "../../../lib/slices/addForm";
import { useSession } from "next-auth/client";
const AccountWizard = () => {
  const { t } = useTranslation("Management");
  const dispatch = useDispatch();
  const [session] = useSession();

  const id = session?.user?.id || session?.user?.user?.id;
  const router = useRouter();

  const [parentAccounts, setParentAccounts] = useState([]);

  const [loading, setLoading] = useState(false);

  // chceck to show bussiness Type
  const [checkbussiness, setCheckbussinsess] = useState(false);
  const { darkMode } = useSelector((state) => state.config);

  const dataRedux = useSelector((item) => item.addFormDatas.data);

  useEffect(() => {
    parentAccounts?.length === 0 &&
      fetchData(
        setLoading,
        setParentAccounts,
        `dashboard/management/accounts/parents`
      );
  }, [parentAccounts]);

  // billing periodic
  const billing = [
    { value: 1, label: t("Yearly") },
    { value: 2, label: t("Quarterly") },
    { value: 3, label: t("Monthly") },
  ];

  // function add data to redux and push to next page
  const Handledata = (values) => {
    dispatch(
      addFormData({
        account: {
          ...values,
          ParentAccountID: +values.ParentAccountID,
          IsDistributor: values.IsDistributor ? 1 : 0,
        },
      })
    );
    router.push("/management/account-management/CreateAdminUser");
  };

  // function handle cancel buttons
  const handleCancel = () => {
    dispatch(addFormData({ clear: true }));
    localStorage.removeItem("formData");
    router.push(`/management/account-management/${id}`);
  };
  const parentAccountsOptions = parentAccounts.map(
    ({ AccountID, AccountName }) => {
      return {
        value: AccountID,
        label: AccountName,
      };
    }
  );
  const MenuList = (props) => {
    const { options, children, maxHeight } = props;
    return (
      <List
        height={maxHeight}
        itemCount={options.length}
        itemSize={35} // Adjust based on item height
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };
  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <Row className=" d-flex justify-content-center">
              <Col md="8">
                <Formik
                  initialValues={{
                    AccountName: dataRedux?.account?.AccountName || "",
                    MainCR: dataRedux?.account?.MainCR || "",
                    IsDistributor:
                      (dataRedux?.account?.IsDistributor ? 1 : 0) || "",
                    StatusID: 6,
                    AccountTypeID:
                      dataRedux?.account?.AccountTypeID || model[0].value,
                    BillingPeriod: dataRedux?.account?.BillingPeriod
                      ? billing.filter(
                          (bil) =>
                            bil.label === dataRedux?.account?.BillingPeriod
                        )[0]?.value
                      : "",
                    BillingStarted: dataRedux?.account?.BillingStarted || "",
                    NextBillingDate: dataRedux?.account?.NextBillingDate || "",
                    DatabaseConnectionString:
                      dataRedux?.account?.DatabaseConnectionString || "",
                    ThemeName: dataRedux?.account?.ThemeName || "",
                    AccountTags: dataRedux?.account?.AccountTags || "",
                    IdentityNumber: dataRedux?.account?.IdentityNumber || "",
                    CommercialRecordNumber:
                      dataRedux?.account?.CommercialRecordNumber || "",
                    CommercialRecordIssueDateHijri:
                      dataRedux?.account?.CommercialRecordIssueDateHijri || "",
                    phoneNumber: dataRedux?.account?.phoneNumber || "",
                    extensionNumber: dataRedux?.account?.extensionNumber || "",
                    emailAddress: dataRedux?.account?.emailAddress || "",
                    ParentAccountID: dataRedux?.account?.ParentAccountID || "",
                    dateOfBirthHijri:
                      dataRedux?.account?.dateOfBirthHijri || "",
                    managerName: dataRedux?.account?.managerName || "",
                    managerPhoneNumber:
                      dataRedux?.account?.managerPhoneNumber || "",
                    managerMobileNumber:
                      dataRedux?.account?.managerMobileNumber || "",
                    BusinessType:
                      dataRedux?.account?.BusinessType || "Corporate",
                    referencKey: dataRedux?.account?.referencKey || "",
                    // CompanyID: dataRedux?.account?.CompanyID || 5,
                    Accounting_Id: dataRedux?.account?.Accounting_Id || "",
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.AccountName) {
                      errors.AccountName = "Account Name is Required";
                    }
                    if (!values.ParentAccountID) {
                      errors.ParentAccountID = "Parent Account ID is Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, errors) => {
                    Handledata(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    setFieldValue,
                    handleSubmit,
                  }) => (
                    <>
                      <form onSubmit={handleSubmit}>
                        <Row className="p-3 mb-3">
                          {/* Account Name */}
                          <Col lg="6">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="AccountName">
                                {t("Account_Name")}
                              </Form.Label>
                              <Form.Control
                                name="AccountName"
                                onChange={handleChange}
                                type="text"
                                value={values.AccountName}
                              />
                            </Form.Group>
                            <p className="text-danger">
                              {errors.AccountName &&
                                touched.AccountName &&
                                errors.AccountName}
                            </p>
                          </Col>

                          {/* parent id */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <ReactSelect
                                  label={t("Parent_Account")}
                                  style={{
                                    backgroundColor: darkMode ? "#222738" : "",
                                  }}
                                  onChange={(selectedOption) => {
                                    setFieldValue(
                                      "ParentAccountID",
                                      selectedOption.value
                                    );
                                  }}
                                  name="ParentAccountID"
                                  components={{ MenuList }}
                                  options={parentAccountsOptions}
                                />
                              </Form.Group>
                            </div>
                          </Col>

                          {/* billing  started on  */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="billingDate">
                                  {t("Billing_Started_On")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="BillingStarted"
                                  id="billingDate"
                                  defaultValue="2021-10-17"
                                  value={values.BillingStarted}
                                  onChange={handleChange}
                                  style={{ letterSpacing: "1.5px" }}
                                />
                              </Form.Group>
                            </div>
                          </Col>

                          {/* next billing date  */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="NextBillingDate">
                                  {t("Next_Billing_Date")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="NextBillingDate"
                                  defaultValue="2021-10-17"
                                  value={values.NextBillingDate}
                                  min={values?.BillingStarted}
                                  onChange={handleChange}
                                  style={{ letterSpacing: "1.5px" }}
                                />
                              </Form.Group>
                            </div>
                          </Col>

                          {/* Account Type */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <Form.Label>{t("Account_Type")}</Form.Label>
                                <ReactSelect
                                  defaultValue={model[0]}
                                  onChange={(selectedOption) => {
                                    setFieldValue(
                                      "AccountTypeID",
                                      selectedOption.value
                                    );
                                    if (selectedOption.label == "TGA") {
                                      setCheckbussinsess(true);
                                    } else {
                                      setCheckbussinsess(false);
                                    }
                                  }}
                                  name="AccountTypeID"
                                  options={model}
                                />
                              </Form.Group>
                            </div>
                          </Col>

                          {/* Billing periodic  */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <Form.Label>{t("Billing_Period")}</Form.Label>
                                <ReactSelect
                                  // BillingPeriod
                                  style={{
                                    backgroundColor: darkMode ? "#222738" : "",
                                  }}
                                  defaultValue={billing[0]}
                                  onChange={(selectedOption) =>
                                    setFieldValue(
                                      "BillingPeriod",
                                      selectedOption.label
                                    )
                                  }
                                  name="BillingPeriod"
                                  options={billing}
                                />
                              </Form.Group>
                            </div>
                          </Col>

                          {/*is distriputor */}
                          <Col lg="6">
                            <div className="mb-3">
                              <Form.Group className="form-group">
                                <Form.Check className=" form-check-inline d-flex align-items-center gap-2">
                                  <FormCheck.Input
                                    id="IsDistributor"
                                    name="IsDistributor"
                                    // value=""
                                    defaultChecked={
                                      dataRedux?.account?.IsDistributor ? 1 : 0
                                    }
                                    // checked={
                                    //   dataRedux?.account?.IsDistributor
                                    //     ? true
                                    //     : false
                                    // }
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={handleChange}
                                  />
                                  <FormCheck.Label
                                    className="form-check-label"
                                    style={{
                                      fontSize: "17px",
                                      userSelect: "none",
                                    }}
                                    htmlFor="IsDistributor"
                                  >
                                    {t("Reseller")}
                                  </FormCheck.Label>
                                </Form.Check>
                              </Form.Group>
                            </div>
                          </Col>

                          {/* bussiness Type */}
                          {checkbussiness && (
                            <Col lg="6">
                              <div className="mb-3">
                                <Form.Group className="form-group">
                                  <Form.Label>{t("Bussinsee_Type")}</Form.Label>
                                  <ReactSelect
                                    onChange={(selectedOption) => {
                                      setFieldValue(
                                        "BusinessType",
                                        selectedOption.label
                                      );
                                    }}
                                    name="BusinessType"
                                    options={bussiness}
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                          )}

                          {/* MainCR */}

                          <Col lg="6">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="MainCR">
                                {t("MainCR")}
                              </Form.Label>
                              <Form.Control
                                name="MainCR"
                                onChange={handleChange}
                                required
                                type="text"
                                value={values.MainCR}
                              />
                            </Form.Group>
                            <p className="text-danger">
                              {errors.MainCR && touched.MainCR && errors.MainCR}
                            </p>
                          </Col>

                          {/****************************************************Optionalssssss***************************/}
                          <hr />
                          <Row className="p-3 mb-3">
                            <h4 className="card-title mb-5 mt-3">
                              {t("WASL_Integration_(Optional)")}
                            </h4>

                            {/* identify number */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="identity">
                                  {t("Identity_Number")}
                                </Form.Label>
                                <Form.Control
                                  value={values.IdentityNumber}
                                  onChange={handleChange}
                                  name="IdentityNumber"
                                  type="number"
                                  id="identity"
                                />
                              </Form.Group>
                            </Col>

                            {/* CommercialRecordNumber */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="Commercial">
                                  {t("Commercial_Record_Number")}
                                </Form.Label>
                                <Form.Control
                                  value={values.CommercialRecordNumber}
                                  name="CommercialRecordNumber"
                                  onChange={handleChange}
                                  type="number"
                                  id="Commercial"
                                />
                              </Form.Group>
                            </Col>

                            {/* CommercialRecordIssueDateHijri */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="HijriDate">
                                  {t("Record_Issue_Date_Hijri")}
                                </Form.Label>
                                <Form.Control
                                  name="CommercialRecordIssueDateHijri"
                                  value={values.CommercialRecordIssueDateHijri}
                                  onChange={handleChange}
                                  type="text"
                                  id="HijriDate"
                                />
                              </Form.Group>
                            </Col>

                            {/* phone number */}

                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="phoneNum">
                                  {t("Phone_Number")}
                                </Form.Label>
                                <Form.Control
                                  value={values.phoneNumber}
                                  onChange={handleChange}
                                  type="number"
                                  name="phoneNumber"
                                  id="phoneNum"
                                />
                              </Form.Group>
                            </Col>

                            {/* extension number  */}

                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="extensionNum">
                                  {t("Extension_Number")}
                                </Form.Label>
                                <Form.Control
                                  name="extensionNumber"
                                  value={values.extensionNumber}
                                  onChange={handleChange}
                                  type="number"
                                  id="extensionNum"
                                />
                              </Form.Group>
                            </Col>

                            {/* email  */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="emailAddress">
                                  {t("Email_Address")}
                                </Form.Label>
                                <Form.Control
                                  value={values.emailAddress}
                                  onChange={handleChange}
                                  type="email"
                                  name="emailAddress"
                                  id="emailAddress"
                                />
                              </Form.Group>
                            </Col>

                            {/* manage name */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="managerName">
                                  {t("Manager_Name")}
                                </Form.Label>
                                <Form.Control
                                  value={values.managerName}
                                  name="managerName"
                                  onChange={handleChange}
                                  type="text"
                                  id="managerName"
                                />
                              </Form.Group>
                            </Col>
                            {/* manager phone number  */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="managerPhoneNum">
                                  {t("Manager_Phone_Number")}
                                </Form.Label>
                                <Form.Control
                                  value={values.managerPhoneNumber}
                                  name="managerPhoneNumber"
                                  onChange={handleChange}
                                  type="number"
                                  id="managerPhoneNum"
                                />
                              </Form.Group>
                            </Col>

                            {/* manager Mobile number  */}
                            <Col lg="6">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="managerPhoneNum">
                                  {t("Manager_Mobile_Number")}
                                </Form.Label>
                                <Form.Control
                                  value={values.managerMobileNumber}
                                  name="managerMobileNumber"
                                  onChange={handleChange}
                                  type="number"
                                  id="managerMobileNum"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <div className="mt-5 d-flex justify-content-end">
                            <button
                              type="submit"
                              className="btn btn-primary px-3 py-2 ms-3"
                              disabled={errors.AccountName}
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowRight}
                                size="sm"
                              />
                              {t("Next")}
                            </button>

                            <button
                              type="reset"
                              className="btn btn-primary px-3 py-2 ms-3"
                              onClick={handleCancel}
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faTimes}
                                size="sm"
                              />
                              {t("Cancel")}
                            </button>
                          </div>
                          {/* <button className='btn btn-danger' type='submit'>Next</button> */}
                        </Row>
                      </form>
                    </>
                  )}
                </Formik>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};
export default AccountWizard;

// translation ##################################
export async function getStaticProps({ locale }) {
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
// translation ##################################
