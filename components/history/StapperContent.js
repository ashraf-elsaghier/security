import moment from "moment";
import { useTranslation } from "next-i18next";
import { SiMicrosoftexcel } from "react-icons/si";
import { Button, Card } from "react-bootstrap";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { convertJsonToExcel } from "helpers/helpers";
import { changeRowDataKeys } from "helpers/histroy/helper";

const StapperContent = ({
  index,
  loading,
  hours,
  item,
  step,
  handleselectedStep,
  minutes,
  handleClose,
  seconds,
  locInfo,
  makePlayBtnDisabled,
}) => {
  const { t } = useTranslation();

  const { darkMode } = useSelector((state) => state.config);

  const handleBackgroundStep = (item) => {
    if (item?.ID === "DummyStep") return "#2E7CB8";
    if (item?.IsIdle) {
      if (item?.StrEvent == "InProgress") {
        return "#2E7CB8";
      } else {
        return "goldenrod";
      }
    } else {
      if (item?.StrEvent == "Trip") {
        return "#2C7BC6";
      } else {
        if (item?.StrEvent == "Parked") {
          return "#737388";
        }
        if (item?.StrEvent == "InProgress") {
          return "#2E7CB8";
        } else {
          return "red";
        }
      }
    }
  };

  const handleExport = (data, name) => {
    const drivers = JSON.parse(localStorage.getItem("drivers"));
    const driverId = item.DriverID;
    const driver = drivers?.find((driver) =>
      driverId ? driver.RFID == driverId : ""
    );
    convertJsonToExcel(
      changeRowDataKeys(
        data.map((v) => ({
          ...v,
          DriverID: driverId,
          DriverName: ` ${
            driver ? driver?.FirstName + " " + driver?.LastName : "N/A"
          }`,
          PlateNumber: locInfo?.PlateNumber,
        }))
      ),
      name
    );
  };

  return (
    <>
      <StepLabel>
        <Button
          id="StepBtn"
          disabled={loading}
          className="py-0 px-3  border-0 w-100 d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: `${handleBackgroundStep(item)}`,
            height: "40px",
            color: "#fff",
            fontSize: "12px",
          }}
          title={item?.IsIdle ? "Idle" : item?.StrEvent}
          onClick={() => handleselectedStep(item, index)}
        >
          <span className="">
            {t("from")} :
            {moment(item?.StrDate).utc().local().format("YYYY-MM-DD hh:mm a")}
          </span>
          {" | "}
          <span className="">
            {t("to")} :{" "}
            {moment(item?.EndDate).utc().local().format("YYYY-MM-DD hh:mm a")}
          </span>
          {step && (
            <p className="lead">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="#fff"
                version="1.1"
                viewBox="0 0 567.123 567.123"
                xmlSpace="preserve"
              >
                <path d="M0 567.119h567.123V.004H0v567.115zm56.818-283.642l43.556-43.568c5.404-5.404 11.812-8.109 19.217-8.109 7.399 0 13.807 2.705 19.217 8.109l90.092 90.105 199.408-199.409c5.404-5.404 11.811-8.121 19.217-8.121 7.398 0 13.807 2.717 19.217 8.121l43.557 43.55c5.402 5.422 8.113 11.824 8.113 19.217 0 7.405-2.711 13.813-8.113 19.217L248.117 474.764c-5.41 5.422-11.818 8.121-19.217 8.121-7.405 0-13.813-2.705-19.217-8.121L56.818 321.91c-5.41-5.404-8.115-11.812-8.115-19.217 0-7.406 2.699-13.812 8.115-19.216z"></path>
              </svg>
            </p>
          )}
        </Button>
      </StepLabel>

      <StepContent>
        <strong
          style={{
            color: "#2C7BC6",
            fontWeight: "900",
          }}
        >
          {t("Address")} :
        </strong>
        <Typography
          style={{
            color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
          }}
        >
          {item?.Address}
        </Typography>
        <strong
          style={{
            color: " #2C7BC6",
            fontWeight: "900",
          }}
        >
          {t("Duration")} :
        </strong>
        <Typography
          style={{
            color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
          }}
        >
          {hours}:{minutes}:{seconds}
        </Typography>
        {item.maxIdleSince ? (
          <>
            <strong
              style={{
                color: " #2C7BC6",
                fontWeight: "900",
              }}
            >
              {t("Max_Idle")} :
            </strong>
            <Typography
              style={
                item.excessiveIdle
                  ? {
                      width: "fit-content",
                      background: "#FA6C51",
                      padding: "1px 8px",
                      borderRadius: "5px",
                      color: "white",
                      fontSize: "0.85rem",
                    }
                  : {
                      color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
                    }
              }
            >
              {item.maxIdleSince} Sec
            </Typography>
          </>
        ) : (
          ""
        )}
        {item?.StrEvent == "Trip" ? (
          <>
            <strong
              style={{
                color: " #2C7BC6",
                fontWeight: "900",
              }}
            >
              {t("Mileage")} :
            </strong>
            <Typography
              style={{
                color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
              }}
            >
              {((item?.EndMil - item?.StrMil) / 1000).toFixed(2)} km
            </Typography>
          </>
        ) : null}
        <strong
          style={{
            color: " #2C7BC6",
            fontWeight: "900",
          }}
        >
          {t("All_Locations")} :
        </strong>
        <Typography
          style={{
            color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
          }}
        >
          <Button
            size="sm"
            className="d-flex align-items-center justify-content-between gap-2 px-2 py-1"
            disabled={makePlayBtnDisabled}
            onClick={() => handleExport(step, "All Locations")}
          >
            <span>{t("Export")}</span> <SiMicrosoftexcel />
          </Button>
        </Typography>

        <strong
          style={{
            color: " #2C7BC6",
            fontWeight: "900",
          }}
        >
          {t("Coordinates")} :
        </strong>
        <Typography
          style={{
            color: !darkMode ? "rgb(34 39 55)" : "rgb(223 233 235)",
          }}
        >
          ({item?.StrLat} , {item?.StrLng})
        </Typography>
        <Card sx={{ mb: 2 }} className="bg-transparent">
          <div>
            <Button
              variant="primary"
              onClick={handleClose}
              style={{
                marginTop: "1rem",
              }}
            >
              {t("Close")}
            </Button>
          </div>
        </Card>
      </StepContent>
    </>
  );
};

export default StapperContent;
