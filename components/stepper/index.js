import { useCallback, useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Stack from "@mui/material/Stack";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Report from "./Report";
import Cars from "./Cars";
import AdditionalData from "./AdditionalData";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNewReport, updateReport } from "../../services/scheduledReports";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/client";

// get steps
const steps = ["", "", ""];

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const { t } = useTranslation(["scheduledReports", "common", "main"]);

  const { darkMode } = useSelector((state) => state.config);
  const ColorlibStepIconRoot = styled("div")(({ ownerState }) => ({
    textAlign: "center",
    padding: 20,
    fontSize: 18,
    width: 160,
    ...(ownerState.active && {
      background: darkMode ? "#222738" : "#0E639533",
      borderRadius: "10px",
    }),
  }));
  const icons = {
    1: (
      <small
        style={{
          fontSize: "14px",
        }}
      >
        {t("Report_Configuration")}
      </small>
    ),
    2: (
      <small
        style={{
          fontSize: "14px",
        }}
      >
        {t("Vehicle_Selection")}
      </small>
    ),
    3: (
      <small
        style={{
          fontSize: "14px",
        }}
      >
        {t("Additional_Options")}
      </small>
    ),
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {!completed ? icons[String(props.icon)] : null}
      {completed ? (
        <div>
          <p className="opacity-25">{icons[String(props.icon)]}</p>
          <FontAwesomeIcon
            icon={faCheck}
            className="position-absolute start-50 top-50 translate-middle"
          />
        </div>
      ) : null}
    </ColorlibStepIconRoot>
  );
}

export default function CustomizedSteppers({ reportData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [hourValue, setHourValue] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [dayValue, setDayValue] = useState("");
  const [keyValue, setKeyValue] = useState("Daily");
  const [submittedKey, setSubmittedKey] = useState([]);
  const [carsId, setCarsId] = useState([]);
  const [monthDay, setMonthDay] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [emailsValues, setEmailsValues] = useState([]);
  const [additionalNumbers, setAdditionalNumbers] = useState([]);
  const [description, setDescription] = useState("");
  const [usersId, setUsersID] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({});
  const { darkMode } = useSelector((state) => state.config);

  const [disableBtn, setDisableBtn] = useState(false);

  const { t } = useTranslation(["scheduledReports", "common", "main"]);
  const [showError, setShowError] = useState(false);
  const session = useSession();
  useEffect(() => {
    setCurrentUserData(session[0]?.user?.user);
  }, []);

  // get step content
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Report
            setKeyValue={setKeyValue}
            setHourValue={setHourValue}
            setStartHour={setStartHour}
            setEndHour={setEndHour}
            setDayValue={setDayValue}
            setMonthDay={setMonthDay}
            hourValue={hourValue}
            dayValue={dayValue}
            monthDay={monthDay}
            keyValue={keyValue}
            setReports={setReports}
            reports={reports}
            reportData={reportData}
          />
        );
      case 1:
        return <Cars setCarsId={setCarsId} carsId={reportData?.data?.vehID} />;
      case 2:
        return (
          <AdditionalData
            additionalEmails={additionalEmails}
            emailsValues={emailsValues}
            additionalNumbers={additionalNumbers}
            setDescription={setDescription}
            setAdditionalEmails={setAdditionalEmails}
            setAdditionalNumbers={setAdditionalNumbers}
            currentUserData={currentUserData}
            reportData={reportData}
            setUsersID={setUsersID}
            setEmailsValues={setEmailsValues}
            showError={showError}
            setShowError={setShowError}
          />
        );
      default:
        return "Unknown step";
    }
  }

  const handleNext = async () => {
    let newSkipped = skipped;

    // the first step validation
    if (activeStep === 0) {
      if ((reports?.length > 0 || reportData) && hourValue) {
        if (keyValue === "Daily" && hourValue) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
          const submittedData = [{ key: "hour", value: hourValue }];

          if (startHour !== null && startHour !== undefined) {
            submittedData.push({ key: "fromHour", value: startHour });
          }

          if (endHour !== null && endHour !== undefined) {
            submittedData.push({ key: "toHour", value: endHour });
          }
          setSubmittedKey(submittedData);
        } else if (keyValue === "Weekly") {
          if (dayValue.length) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
            setSubmittedKey([
              { key: "weeklyday", value: dayValue },
              { key: "hour", value: hourValue },
            ]);
          } else {
            toast.error(t("Please_Choose_All_Field"), {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        } else if (keyValue === "Monthly") {
          if (monthDay > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
            setSubmittedKey([
              { key: "day", value: +monthDay },
              { key: "hour", value: hourValue },
            ]);
          } else {
            toast.error(t("Please_Choose_All_Field"), {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
      } else {
        toast.error(t("Please_Choose_All_Field"), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      // second step validation and push data to redux
    } else if (activeStep === 1 && carsId.length > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    } else if (carsId.length === 0) {
      toast.error(t("Please_Choose_A_Vehicle"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    // last step and send data to endpoint
    else if (activeStep === 2) {
      if (reportData) {
        const updatedData = {
          Description: description || reportData?.Description,
          ScheduleVehicleIds: carsId,
          AdditionalEmails: Array.from(
            new Set([...emailsValues, ...additionalEmails])
          ),
          AdditionalNumbers: additionalNumbers,
          ScheduleUserIds: usersId,
          FrequencyTitle: keyValue,
          keys: submittedKey,
          emails: Array.from(new Set([...emailsValues, ...additionalEmails])),
          reportName: reportData.reportName,
          ScheduleReportId: reportData.ScheduleReportId,
          accountId: currentUserData.accountId,
          profileId: currentUserData.ProfileID,
        };

        await updateData(reportData._id, updatedData);
      } else {
        const data = [];
        reports.forEach((report) => {
          data.push({
            Description: description,
            ScheduleVehicleIds: carsId,
            // AdditionalEmails: emailsValues,
            AdditionalNumbers: additionalNumbers,
            FrequencyTitle: keyValue,
            keys: submittedKey,
            emails: Array.from(new Set([...emailsValues, ...additionalEmails])),
            reportName: report.value,
            ScheduleReportId: report.id,
            ScheduleUserIds: usersId,
            accountId: currentUserData.accountId,
            profileId: currentUserData.ProfileID,
            zoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        });

        postData(data);
      }
    }
  };

  const updateData = useCallback(
    async (id, data) => {
      try {
        if (data.emails.length && !showError) {
          setDisableBtn(true);
          const updateData = await updateReport(id, data);
          toast.success(t("Report_Updated_Successfully"), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          router.push("/scheduledReports");
        } else {
          toast.error(t("Please_Select_an_email"));
        }
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    },
    [reportData, router, showError]
  );
  const postData = useCallback(
    async (data) => {
      try {
        if (data[0].emails.length && !showError) {
          setDisableBtn(true);
          const res = await addNewReport(data);
          if (res.status === 200) {
            router.push("/scheduledReports");
            toast.success(t("Report_Added_Successfully"), {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        } else {
          toast.error(t("Please_Select_an_email"));
        }
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    },
    [router, showError]
  );

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    if (activeStep === 0) {
    }
  };

  const handleCancel = () => {
    router.push("/scheduledReports");
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0}
        justifyContent="center"
        className="my-5"
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          className="my-4 stepperContainer"
          style={{
            width: "475px",
            background: darkMode ? "#343949" : "",
          }}
        >
          {steps.map((label, i) => {
            return (
              <Step
                className={`${
                  darkMode ? "dark stepperItem" : "stepperItem"
                } w-25 `}
                key={i}
              >
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Stack>

      {getStepContent(activeStep)}

      <div className="d-flex align-items-center justify-content-end ">
        <Button
          variant=" px-3 py-1 fs-5"
          className="m-1 bg-soft-primary"
          onClick={handleCancel}
        >
          {t("Cancel")}
        </Button>

        <Button
          variant="primary px-3 py-1 fs-5"
          className="m-1"
          onClick={handleNext}
          disabled={disableBtn}

          // type="submit"
        >
          {activeStep === steps.length - 1 ? t("Save") : t("Continue")}
        </Button>
      </div>
    </>
  );
}
