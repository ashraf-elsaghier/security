import { useState, useEffect } from "react";
import Select from "react-select";
import { fetchAllReportsTypes } from "services/scheduledReports";
import { useSelector } from "react-redux";
import { DatePicker } from "rsuite";
import { useTranslation } from "next-i18next";
import moment from "moment";
import { useRouter } from "next/router";

const Report = ({
  setHourValue,
  setDayValue,
  setKeyValue,
  setMonthDay,
  hourValue,
  dayValue,
  setReports,
  reportData,
  reports,
  monthDay,
  setStartHour,
  setEndHour,
}) => {
  const { t } = useTranslation(["scheduledReports", "common", "main"]);

  const [reportsType, setReportsType] = useState([]);
  const [disapledReport, setDisapledReport] = useState([]);
  const [avilableReport, setAvilableReport] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Daily");
  const { darkMode } = useSelector((state) => state.config);
  const router = useRouter();
  const options = [
    { value: "Daily", label: t("daily") },
    { value: "Weekly", label: t("weekly") },
    { value: "Monthly", label: t("monthly") },
  ];

  const ScheduleFrequency = {
    daily: 0,
    weekly: 1,
    monthly: 2,
  };

  const days = [
    { value: "saturday", label: t("saturday") },
    { value: "sunday", label: t("sunday") },
    { value: "monday", label: t("monday") },
    { value: "tuesday", label: t("tuesday") },
    { value: "wednesday", label: t("wednesday") },
    { value: "thursday", label: t("thursday") },
    { value: "friday", label: t("friday") },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: darkMode ? "rgb(21,24,36)" : "",
      border: darkMode ? "1px solid #30384f" : "",
      "&:hover": {
        border: darkMode ? "1px solid #30384f" : "",
      },
      color: darkMode ? "#fff" : "",
    }),

    option: (providing, state) => ({
      ...providing,
      backgroundColor: darkMode ? "rgb(21,24,36)" : "",
      color: darkMode ? "#fff" : "",
      color: state.isDisabled && "#c8c8c8",
    }),

    placeholder: (based) => ({
      ...based,
      color: darkMode ? "#fff" : "",
    }),
    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      color: darkMode ? "#fff" : "",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? "rgb(21,24,36)" : "#fff",
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      background: darkMode ? "#222738" : "",
      color: darkMode ? "#fff" : "",
      borderRadius: "0",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: darkMode ? "#fff" : "",
      backgroundColor: darkMode ? "#222738" : "",
      borderRadius: "0",
    }),
  };

  useEffect(() => {
    const hourPlaceholder = document.querySelectorAll(
      ".rs-picker-toggle-placeholder"
    );
    hourPlaceholder.forEach((s) => (s.textContent = t(s.textContent)));
  });
  const getLocalHourFromUTC = (utcHour) => {
    const now = new Date();
    const userOffset = now.getTimezoneOffset() / 60;
    const adjustedStartHour = utcHour - userOffset;
    return adjustedStartHour;
  };
  useEffect(() => {
    if (reportData) {
      const weekdays = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      setSelectedOption(reportData?.data?.FrequencyTitle);
      if (router.pathname.includes("edit")) {
        setHourValue(new Date(reportData?.nextRunAt).getUTCHours());
        setStartHour(getLocalHourFromUTC(reportData?.data?.fromHour));
        setEndHour(getLocalHourFromUTC(reportData?.data?.toHour));
        setMonthDay(new Date(reportData?.nextRunAt).getDate());
        setDayValue(
          weekdays[new Date(reportData?.nextRunAt).getDay()].substring(0, 3)
        );
        setSelectedOption(reportData.data.FrequencyTitle);
      }
      setReports(reportData?.data?.reportName);
    }
  }, [reportData?.data?.FrequencyTitle]);

  useEffect(async () => {
    if (reportsType.length === 0) {
      const reporstOption = await fetchAllReportsTypes();

      reporstOption.map((report) => {
        if (report.AvailabilityStatus) {
          avilableReport.push({
            value: report.ReportTitle,
            label: t(report.ReportName),
            id: report.ReportId,
          });
        }
        setReportsType([
          {
            label: t("Available_Report"),
            options: avilableReport,
          },
          {
            label: t("Coming_Soon"),
            options: disapledReport,
          },
        ]);
      });
    }
  }, []);

  const handleChange = (e) => {
    setSelectedOption(e.value);
  };

  const handleSelectHour = (e) => {
    setHourValue(new Date(e).getUTCHours());
  };

  const handleSelectDay = (e) => {
    setDayValue(e.value.substring(0, 3));
    setMonthDay("");
  };

  const handleMonthDay = (e) => {
    setMonthDay(e.value);
    setDayValue("");
  };

  const handleSelectReport = (e) => {
    setReports(e);
  };

  const handleStartHour = (e) => {
    const selectedDate = new Date(e);
    const localHour = selectedDate.getHours();
    const userOffset = selectedDate.getTimezoneOffset() / 60;
    const adjustedStartHour = localHour + userOffset;
    setStartHour(adjustedStartHour);
  };
  const handleEndHour = (e) => {
    const selectedDate = new Date(e);
    const localHour = selectedDate.getHours();
    const userOffset = selectedDate.getTimezoneOffset() / 60;
    const adjustedEndHour = localHour + userOffset;
    setEndHour(adjustedEndHour);
  };
  const today = new Date();
  const renderSwitch = (param) => {
    setKeyValue(param);
    switch (param) {
      case "Daily":
        return (
          <>
            <p className="mb-1">{t("hour")}</p>
            <DatePicker
              className="w-100"
              format="HH"
              editable={false}
              onChange={handleSelectHour}
              defaultValue={
                router.pathname.includes("edit")
                  ? new Date(reportData?.nextRunAt)
                  : null
              }
              locale={{
                ok: t("OK"),
                hours: t("Hours"),
              }}
            />
            <p className="mb-1  mt-3">{t("start_hour")}</p>
            <DatePicker
              className="w-100"
              format="HH"
              editable={false}
              onChange={handleStartHour}
              defaultValue={
                router.pathname.includes("edit") && reportData?.data?.fromHour
                  ? today.setHours(
                      getLocalHourFromUTC(reportData?.data?.fromHour),
                      0,
                      0,
                      0
                    )
                  : null
              }
              locale={{
                ok: t("OK"),
                hours: t("Hours"),
              }}
            />
            <p className="mb-1  mt-3">{t("end_hour")}</p>
            <DatePicker
              className="w-100"
              format="HH"
              editable={false}
              onChange={handleEndHour}
              defaultValue={
                router.pathname.includes("edit") && reportData?.data?.toHour
                  ? today.setHours(
                      getLocalHourFromUTC(reportData?.data?.toHour),
                      0,
                      0,
                      0
                    )
                  : null
              }
              locale={{
                ok: t("OK"),
                hours: t("Hours"),
              }}
            />
          </>
        );
      case "Weekly":
        return (
          <div className="d-flex align-items-center gap-5">
            <div className="w-50">
              <p className="mb-1">{t("day")}</p>
              <Select
                styles={customStyles}
                onChange={handleSelectDay}
                placeholder={dayValue || t("Please_Choose_A_Day")}
                defaultValue={dayValue || ""}
                value={dayValue}
                options={days}
              />
            </div>
            <div className="w-50">
              <p className="mb-1">{t("hour")}</p>
              <DatePicker
                className="w-100"
                format="HH"
                editable={false}
                onChange={handleSelectHour}
                defaultValue={
                  router.pathname.includes("edit")
                    ? new Date(reportData?.nextRunAt)
                    : null
                }
                locale={{
                  ok: t("OK"),
                  hours: t("Hours"),
                }}
              />
            </div>
          </div>
        );
      case "Monthly":
        return (
          <div className="d-flex align-items-center gap-5">
            <div className="w-50">
              <p className="mb-1">{t("day")}</p>
              <Select
                styles={customStyles}
                onChange={handleMonthDay}
                value={monthDay}
                placeholder={monthDay || t("Please_Choose_A_Day")}
                options={Array.from(
                  { length: moment().daysInMonth() },
                  (_, i) => ({
                    value: i + 1,
                    label: i + 1,
                  })
                )}
              />
            </div>
            <div className="w-50">
              <p className="mb-1">{t("hour")}</p>
              <DatePicker
                className="w-100"
                format="HH"
                editable={false}
                onChange={handleSelectHour}
                defaultValue={
                  router.pathname.includes("edit")
                    ? new Date(reportData?.nextRunAt)
                    : null
                }
                placeholder={""}
                locale={{
                  ok: t("OK"),
                  hours: t("Hours"),
                }}
              />
            </div>
          </div>
        );
      default:
        return (
          <>
            <p className="mb-1">{t("hour")}</p>
            <DatePicker
              className="w-100"
              format="HH"
              editable={false}
              defaultValue={
                router.pathname.includes("edit")
                  ? new Date(reportData?.nextRunAt)
                  : null
              }
              onChange={handleSelectHour}
            />
          </>
        );
    }
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <div className=" d-flex w-100 align-items-center gap-5 justify-content-center mb-5">
        <h3
          style={{
            width: "fit-content",
          }}
        >
          {t("Report_Included")}
        </h3>
        <Select
          styles={customStyles}
          className="w-50 scheduledReport_select"
          options={reportsType}
          isMulti
          onChange={handleSelectReport}
          isDisabled={reportData && true}
          placeholder={reportData?.data?.reportName || t("select")}
          defaultValue={reportData?.data?.reportName || ""}
        />
      </div>

      <div className="d-flex  w-100  align-items-center gap-5 justify-content-center ">
        <h3
          style={{
            alignSelf: "flex-start",
            width: "fit-content",
          }}
        >
          {t("Report_Frequency")}
        </h3>

        <div className="w-50">
          <div className="mb-3">
            <p className="mb-1">{t("Schedule_Frequency")}</p>
            <Select
              styles={customStyles}
              onChange={handleChange}
              placeholder={
                router.pathname.includes("edit")
                  ? t(reportData.data.FrequencyTitle)
                  : t("daily")
              }
              options={options}
              defaultValue={
                router.pathname.includes("edit")
                  ? reportData?.data?.FrequencyTitle
                  : options[0]
              }
            />
          </div>

          <div className="mb-5">{renderSwitch(selectedOption)}</div>
        </div>
      </div>
    </div>
  );
};

export default Report;
