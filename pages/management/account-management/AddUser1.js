import { useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, Card, FormCheck } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import axios from "axios";
import ReactSelect from "components/Select";
import { validateEmail } from "helpers/helpers";

const AddUser1 = () => {
  const { t } = useTranslation("Management");
  const router = useRouter();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [validated, setValidated] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
  const [IsIdleLogout, setIsIdleLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [IdleTime, setIdleTime] = useState(null);
  const [Is2FA, setIs2FA] = useState(false);

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRole = (value) => {
    setSelectedRole(value);
  };
  const RolesOptions = [
    { value: "1", label: "Admin" },
    { value: "2", label: "AccountManager" },
    { value: "3", label: "User" },
    { value: "11", label: "Basic User" },
    { value: "8", label: "Fleet" },
    { value: "10", label: "support representative" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      FirstName &&
      LastName &&
      UserName &&
      PhoneNumber &&
      Password &&
      selectedRole &&
      validateEmail(Email)
    ) {
      try {
        setLoading(true);
        setUserNameErrorMessage("");
        const newUserData = {
          UserName: UserName,
          Email: Email,
          FirstName: FirstName,
          LastName: LastName,
          Password: Password,
          RoleId: selectedRole,
          IsIdleLogout: +IsIdleLogout,
          IdleTime: parseInt(IdleTime),
          EmailConfirmed: 1,
          PhoneNumber: PhoneNumber,
          PhoneNumberConfirmed: 1,
          LockoutEnabled: 0,
          AccessFailedCount: 0,
          TwoFactorEnabled: +Is2FA,
        };
        if (!IsIdleLogout) delete newUserData.IdleTime;
        if (
          IsIdleLogout &&
          (newUserData.IdleTime > 60 || newUserData.IdleTime < 1)
        ) {
          throw new Error("Idle Time should be between 1 and 60 minutes");
        }
        const res = await axios.post("dashboard/management/users", newUserData);
        if (res?.status === 201) {
          toast.success(res.message || "User Added Successfully");
          router.push("/management/account-management/manageUsers");
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setValidated(true);
        if (
          err.response?.data?.message ==
          "user name already taken, choose another one"
        ) {
          setUserNameErrorMessage("Username is already taken");
          toast.error(err.response?.data?.message || "Something went Wrong");
          setUserName("");
        } else {
          toast.error(
            err.message || err.response?.data?.message || "Something went Wrong"
          );
        }
      }
    }
    setValidated(true);
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body>
          <Row className=" d-flex justify-content-center mb-5">
            <Col lg="8">
              <Form
                className="mt-5"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <Row className="p-3 mb-3">
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="firstName">
                        {t("First_Name")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="firstName"
                        placeholder={t("First_Name")}
                        defaultValue={FirstName}
                        onChange={handleFirstName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid First Name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="lastName">
                        {t("Last_Name")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="lastName"
                        placeholder={t("Last_Name")}
                        defaultValue={LastName}
                        onChange={handleLastName}
                        required
                        autocomplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Last Name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="12">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="userNameField">
                        {t("User_Name")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="userNameField"
                        placeholder={t("User_Name")}
                        value={UserName}
                        onChange={handleUserName}
                        required
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {userNameErrorMessage ||
                          "Please provide a valid User Name."}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="email">{t("E-mail")}</Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        placeholder={t("Email")}
                        defaultValue={Email}
                        onChange={handleEmail}
                        isInvalid={!validateEmail(Email) && Email.trim() !== ""}
                        required
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="phoneNumber">
                        {t("Phone_Number")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t("Phone_Number")}
                        type="number"
                        defaultValue={PhoneNumber}
                        id="phoneNumber"
                        onChange={handlePhoneNumber}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Phone Number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>{" "}
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="passwordField">
                        {t("Password")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t("Password")}
                        type="password"
                        defaultValue={Password}
                        id="passwordField"
                        onChange={handlePassword}
                        required
                        autoComplete="off"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="role">{t("User Role")}</Form.Label>
                      <ReactSelect
                        options={RolesOptions}
                        placeholder="Select User Role"
                        name="role"
                        isSearchable={true}
                        onSelectChange={handleRole}
                        defaultValue={selectedRole}
                      />
                      <Form.Control
                        type="string"
                        value={selectedRole}
                        id="role"
                        required
                        className="d-none"
                      />
                      <Form.Control.Feedback type="invalid">
                        Role is required
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <label>{t("Enable 2FA")}</label>
                    <Form.Check
                      type="switch"
                      className="mb-3 mt-2"
                      checked={Is2FA}
                      onChange={(e) => setIs2FA(e.target.checked)}
                      name="is2FA"
                    />
                  </Col>
                  <Col md="6">
                    <label>{t("Enable Idle Feature")}</label>
                    <Form.Check
                      type="switch"
                      className="mb-3 mt-2"
                      checked={IsIdleLogout}
                      onChange={(e) => setIsIdleLogout(e.target.checked)}
                      name="idleFeature"
                    />
                  </Col>
                  {IsIdleLogout && (
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="allowedNumber">
                          {t("Allowed Idle Time in minutes")}
                        </Form.Label>
                        <Form.Control
                          placeholder={t("Allowed Idle Time in minutes")}
                          id="allowedNumber"
                          name="IdleTime"
                          type="number"
                          onChange={(e) => setIdleTime(e.target.value)}
                          className={"mb-3"}
                          min={1}
                          max={60}
                          required={IsIdleLogout}
                        />
                        <Form.Control.Feedback type="invalid">
                          Allowed Time must between 1 to 60 minutes
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}
                  <div className="mt-5 d-flex justify-content-end">
                    <Link
                      href="/management/account-management/manageUsers"
                      passHref
                    >
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 ms-3"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faTimes}
                          size="sm"
                        />
                        {t("Cancel")}
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary px-3 py-2 ms-3"
                      disabled={loading}
                    >
                      {/* <FontAwesomeIcon
                        className="me-2"
                        icon={faArrowRight}
                        size="sm"
                      /> */}
                      {t("Add_User")}
                    </button>
                  </div>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddUser1;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}
// translation ##################################
