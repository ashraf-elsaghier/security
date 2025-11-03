import React, { useEffect, useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { userConfigImg } from "../lib/slices/config";
import { setSystemConfig } from "../lib/slices/SystemConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/client";
import { FileImageDimensionsHandler } from "helpers/helpers";

const Setting = () => {
  const { t } = useTranslation("setting");
  const dispatch = useDispatch();
  const session = useSession();
  const userRole = session[0]?.user?.user?.role;
  const [disableBtn, setDisableBtn] = useState(false);
  const [dimensionsErr, setDimensionsErr] = useState("");

  // use Form
  // const { register, handleSubmit } = useForm();
  // upload image to server
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [check, setCheck] = useState(false);

  const [logo, setLogo] = useState(null);
  const [logo2, setLogo2] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [logoCheck, setLogoCheck] = useState(false);

  const handleFileChange = (event) => {
    FileImageDimensionsHandler(event, setDimensionsErr, t);
    setImage(event.target.files[0]);
    setImage2(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmitImage = async (event) => {
    setCheck(true);
    event.preventDefault();
    event.persist();

    let formData = new FormData();
    formData.append("image", image);

    try {
      if (!dimensionsErr) {
        await axios
          .put("config", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            dispatch(userConfigImg(response?.data?.updateUser?.image));
            toast.success("Image Uploaded Successfully");
            setCheck(false);
            // dispatch(getUserImage(response?.data?.updateUser?.image))
          });
      } else {
        setCheck(false);
      }
    } catch (error) {
      toast.error("please upload image type JPG OR JPEG OR PNG !");
      setCheck(false);
    }
  };

  useEffect(() => {
    const getImage = async () => {
      const res = await axios("config");
      dispatch(userConfigImg(res?.data?.configs?.image));
      setImageUrl(res.data.configs.image);
    };

    getImage();
  }, [imageUrl]);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
    setLogoUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    e.persist();
    setLogoCheck(true);
    setDisableBtn(true);

    let formData = new FormData();
    formData.append("title", title);
    formData.append("image", logo);

    axios
      .post("/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Logo & Title Uploaded Successfully");
        setLogoCheck(false);
        setDisableBtn(false);
        dispatch(
          setSystemConfig({
            logo: response?.data?.setting?.icon,
            title: response?.data?.setting?.title,
          })
        );
      })
      .catch((error) => {
        toast.error("please upload image type JPG OR JPEG OR PNG !");
        setLogoCheck(false);
        setDisableBtn(false);
      });
  };

  return (
    <>
      <Card>
        <Card.Body className="py-4">
          <h3 className="mb-4 ">{t("Change_Image")}</h3>
          <Form id="form" className="text-center mt-3 mx-auto">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="position-relative mb-2">
                <input
                  id="upload"
                  accept="image/jpeg, image/png, image/jpg"
                  type="file"
                  className="d-none"
                  onChange={handleFileChange}
                />
                <div className="show-user-image ">
                  {imageUrl && <img src={image2 || imageUrl} alt="user" />}
                </div>

                <label
                  htmlFor="upload"
                  style={{ cursor: "pointer" }}
                  className="btn btn-primary text-white next  shadow-none position-absolute pos-icon"
                >
                  <FiUpload color="white" size={"1.2rem"} />
                </label>
              </div>
              {dimensionsErr && (
                <span
                  className="text-danger d-inline-block mb-3"
                  style={{ fontSize: "12px" }}
                >
                  {" "}
                  {dimensionsErr}{" "}
                </span>
              )}
            </div>

            <Button
              type="button"
              name="next"
              className="btn btn-primary next action-button  px-4 py-2 shadow-none"
              value="submit"
              onClick={handleSubmitImage}
            >
              {" "}
              {check ? t("loading") : t("Change_Image")}{" "}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {userRole === "support" && (
        <Card>
          <Card.Body className="py-4">
            <h3 className="mb-4 ">System Settings</h3>
            <Form id="form2" className="text-center mt-3 mx-auto">
              <div className="d-flex  justify-content-center gap-5 align-items-center mb-5">
                <div className="position-relative ">
                  <input
                    id="upload2"
                    accept="image/*"
                    type="file"
                    className="d-none"
                    onChange={handleLogoChange}
                  />
                  <div
                    className="show-user-image "
                    style={{
                      border: "1px solid rgb(82 131 123)",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    {logoUrl ? (
                      <img src={logo2 || logoUrl} alt="logo" />
                    ) : (
                      // <p>hello</p>
                      <svg
                        width="50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 30 30"
                      >
                        <defs>
                          <linearGradient
                            id="linear-gradient"
                            x1="5.72"
                            y1="31.07"
                            x2="24.28"
                            y2="-1.07"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0" stopColor="#0994b8" />
                            <stop offset="0.27" stopColor="#0d97b9" />
                            <stop offset="0.53" stopColor="#189fbe" />
                            <stop offset="0.78" stopColor="#2bacc5" />
                            <stop offset="1" stopColor="#42bccd" />
                          </linearGradient>
                        </defs>
                        <rect
                          className="cls-1"
                          fill="url(#linear-gradient)"
                          width="30"
                          height="30"
                          rx="5.29"
                        />
                        <path
                          className="cls-2"
                          fill="#fff"
                          d="M21.27,11.13c.54,0,1,0,1.27,0l0,.22-1.21,6.3c-.75,3.89-4.93,6.71-8.89,6.71-2.49,0-5.26-1.79-5.7-4.06,9,0,15-4.55,13.9-6a4,4,0,0,0-1.63-1c-.55-.22-1.12-.4-1.56-.55l-.24-.09c-.66-.27-.9-.61-.2-.93A11.65,11.65,0,0,1,21.27,11.13Zm.59-5.53H10.35A1.45,1.45,0,0,0,8.93,6.77L7,16.7v0c7.39.6,9.06-1.74,7.65-2.19-.42-.14-.79-.27-1.11-.41-2.06-.85-2.07-1.7.46-2.64,2.75-1,7.63-1,8.65-1l.61-3.19A1.45,1.45,0,0,0,21.86,5.6Z"
                        />
                      </svg>
                    )}
                  </div>

                  <label
                    htmlFor="upload2"
                    style={{
                      cursor: "pointer",
                      width: "25px ",
                      height: "25px",
                    }}
                    className="btn btn-primary  text-white next  shadow-none position-absolute pos-icon"
                  >
                    <FiUpload color="white" size={".8rem"} />
                  </label>
                </div>

                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "30ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="filled-basic"
                    label={title || "Saferoad"}
                    variant="filled"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
              </div>

              <Button
                disabled={disableBtn}
                type="button"
                name="next"
                className="btn btn-primary next action-button  px-5 py-2 shadow-none"
                value="submit"
                onClick={handleSubmitData}
              >
                {logoCheck ? "Loading..." : "Submit"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default Setting;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["setting", "main"])),
    },
  };
}
// translation ##################################
