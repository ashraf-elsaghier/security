import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  Modal,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/client";
import jwt_decode from "jwt-decode";
import { useRef } from "react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { FaLock } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

const Signin = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // const [qrContent, setQrContent] = useState("");
  const handleVerificationCodeChange = (e, i) => {
    const { value } = e.target;
    const newData = [...verificationCode];
    newData[i] = value;
    setVerificationCode(newData);
  };

  const handleKeyDown = (e, i) => {
    if (
      (e.key === "Backspace" && verificationCode[i] === "") ||
      (e.key === "Delete" && verificationCode[i] === "")
    ) {
      e.preventDefault();
      // If Backspace is pressed and the current cell is empty,
      // prevent default behavior (deleting the previous cell) and focus on the current cell
      inputRefs.current[i - 1]?.focus();
      const newData = [...verificationCode];
      newData[i - 1] = "";
      setVerificationCode(newData);
    }
  };

  const inputRefs = useRef([]);

  const [isToken, setisToken] = useState(false);
  const signInBtnRef = useRef();
  const router = useRouter();
  const { nw } = router.query;
  const [respObj, setRespObj] = useState({
    new_token: null,
    user: null,
    roles:
      "The SELECT permission was denied on the object 'AspNetUserRoles', database 'userreports', schema 'dbo'.",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
    // axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    if (nw !== undefined) {
      setisToken(true);
      const userobj = jwt_decode(nw);
      setRespObj((prev) => ({
        ...prev,
        new_token: nw,
        user: userobj,
      }));

      setTimeout(() => {
        signInBtnRef.current.click();
      }, 0);
    }
  }, [nw]);

  const loginSchema = yup.object(
    isToken
      ? {
          username: yup.string(),
          password: yup.string(),
        }
      : {
          username: yup.string().required("Required"),
          password: yup.string().required("Required"),
        }
  );

  const initialValues = {
    username: "",
    password: "",
    remember_me: false,
  };
  const checkQRCode = async () => {
    try {
      const res = await axios.post("verify-2fa", {
        username: username,
        token: verificationCode.join(""),
      });
      if (nw !== undefined) {
        setisToken(true);
        const userobj = jwt_decode(nw);
        setRespObj((prev) => ({
          ...prev,
          new_token: nw,
          user: res.data.user,
        }));

        setTimeout(() => {
          signInBtnRef.current.click();
        }, 0);
      }
      localStorage.clear();
      signIn("credentials", {
        user: JSON.stringify({
          ...respObj,
          new_token: res.data.token,
          user: res.data.user,
        }),
      });
    } catch (error) {
      setVerificationCode(["", "", "", "", "", ""]);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  useEffect(() => {
    if (verificationCode.includes("")) {
      const firstEmptyIndex = verificationCode?.findIndex(
        (code) => code === ""
      );
      inputRefs.current[firstEmptyIndex]?.focus();
    } else {
      // All fields are filled, send verification code
      checkQRCode();
    }
  }, [verificationCode]);
  const handleSubmit = async (
    { username, password, remember_me },
    { setSubmitting }
  ) => {
    if (isToken) {
      localStorage.clear();
      signIn("credentials", {
        user: JSON.stringify(respObj),
      });
    } else {
      try {
        const res = await axios(`login`, {
          method: "POST",
          data: { username, password },
        });
        if (res.data.TwoFactorEnabled) {
          // const res = await axios.post("register-2fa", {
          //   username: username,
          // });
          // setQrContent(res.data.qrcodeData);
          setUsername(username);
          setShowPopup(true);
          inputRefs.current[0].focus();
        } else {
          if (nw !== undefined) {
            setisToken(true);
            const userobj = jwt_decode(nw);
            setRespObj((prev) => ({
              ...prev,
              new_token: nw,
              user: res.data.user,
            }));

            setTimeout(() => {
              signInBtnRef.current.click();
            }, 0);
          }
          localStorage.clear();
          signIn("credentials", {
            user: JSON.stringify({
              ...respObj,
              new_token: res.data.token,
              user: res.data.user,
            }),
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "something went wrong");
      } finally {
        setSubmitting(false);
      }
    }
  };
  const handleClose = () => setShowPopup(!showPopup);
  return (
    <>
      <section className="login-content">
        <Modal centered show={showPopup} onHide={handleClose}>
          <Modal.Header
            closeButton
            className={`d-flex justify-content-between align-items-center`}
          >
            <h5 className="text-center mt-3 mb-0 w-100">
              Setup 2-factor Authentication
            </h5>
          </Modal.Header>
          <Modal.Body>
            {/* <p className="text-center fs-5">
              Scan the image below with the two factor authentication app on
              your phone. <br />
              if you can’t a enter this text code instead.
            </p> */}
            <div>
              {/* {qrContent?.length > 0 && (
                <div className="d-flex justify-content-center">
                  <img src={qrContent} alt="QR Code" />
                </div>
              )} */}
              <p className="text-center fs-5 fw-bold mb-3">
                Enter The{" "}
                <span className="text-primary mb-3">Six Digit code</span> from
                the application
              </p>
              {/* <p className="text-center fs-5 mb-2">
                After scanning the barcode image, the app will display a
                six-digit code that you can enter below.
              </p> */}
              <div className="d-flex justify-content-center">
                {[...Array(6)].map((_, index) => (
                  <div key={index}>
                    <input
                      className="mx-1 text-center"
                      type="text"
                      maxLength={1}
                      value={verificationCode[index]}
                      onChange={(e) => handleVerificationCodeChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      style={{ maxWidth: 40, height: 40, fontSize: 30 }}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Row className="m-0  bg-white ">
          <Col
            xl="5"
            lg="6"
            md="6"
            style={{ height: "100vh" }}
            className="  position-relative d-flex justify-content-center align-items-center"
          >
            <Row className="justify-content-center   d-flex align-align-items-center ">
              <Col md="10">
                <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card px-md-0">
                  <Card.Body>
                    <div className="navbar-brand d-flex align-items-center  ">
                      <div className="navbar-brand signin-header-logo d-flex align-items-center  justify-content-center w-100">
                        <img
                          src="/small-logo-header.png"
                          // width="225"
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    <h2 className="mb-4 text-center signin-title">
                      Welcome to Mobily
                    </h2>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={loginSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        touched,
                        isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit} noValidate>
                          <Row>
                            <Col lg="12">
                              <Form.Group className="form-group">
                                <FormLabel htmlFor="username" className="">
                                  Username
                                </FormLabel>
                                <InputGroup className="mb-3">
                                  <InputGroup.Text className="sign-icon">
                                    <FaUserAlt size={20} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={isToken ? " " : values.username}
                                    aria-describedby="username"
                                    isInvalid={
                                      errors.username && touched.username
                                    }
                                    placeholder="Enter Your Username"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.username && touched.username}
                                  </Form.Control.Feedback>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col lg="12">
                              <Form.Group className="form-group">
                                <FormLabel htmlFor="password" className="label">
                                  Password
                                </FormLabel>
                                <InputGroup className="mb-3">
                                  <InputGroup.Text className="sign-icon">
                                    <FaLock size={20} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={isToken ? "*" : values.password}
                                    aria-describedby="password"
                                    isInvalid={
                                      errors.password && touched.password
                                    }
                                    placeholder="Enter Your Password "
                                    className="sign-field"
                                  />
                                  <InputGroup.Text
                                    className="sign-eyeIcon border-0 position-absolute   bg-white "
                                    onClick={handleShowPassword}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: 44,
                                      top: "2px",
                                      right: "1px",
                                    }}
                                  >
                                    {showPassword ? (
                                      <FaRegEye size={20} />
                                    ) : (
                                      <FaRegEyeSlash size={20} />
                                    )}
                                  </InputGroup.Text>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col
                              lg="12"
                              className="d-flex justify-content-between"
                            >
                              <Form.Check className="form-check mb-3">
                                <Form.Check.Input
                                  type="checkbox"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.password}
                                  name="remember_me"
                                  id="customCheck1"
                                />
                                <Form.Check.Label
                                  htmlFor="customCheck1"
                                  className="text-primary"
                                >
                                  Remember Me
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-center">
                            <Button
                              ref={signInBtnRef}
                              type="submit"
                              disabled={isSubmitting}
                              variant="d-flex justify-content-center align-items-end btn btn-primary px-4 py-2 mt-4 w-100"
                            >
                              <span>Sign In</span>
                              {isSubmitting && (
                                <Spinner
                                  as="span"
                                  role="status"
                                  style={{ verticalAlign: "sub" }}
                                  className="mx-1"
                                  aria-hidden="true"
                                  size="sm"
                                  animation="border"
                                />
                              )}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col
            xl="7"
            lg="6"
            md="6"
            className="d-md-flex align-items-center justify-content-center d-none p-2 p-lg-3 p-xl-5  overflow-hidden position-relative"
          >
            <div
              className="  d-flex justify-content-center align-items-center signIn-bg h-100"
              style={{ width: "95%" }}
            >
              <img
                src="/mobily-logo-large.png"
                objectFit="cover"
                alt="sign in background"
                draggable={false}
              />
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
