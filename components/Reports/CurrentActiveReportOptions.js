import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import dateFormat from "dateformat";
import style from "styles/ReportsOptions.module.scss";
import "rsuite/dist/rsuite.min.css";
import { DateRangePicker, DatePicker } from "rsuite";
import { useTranslation } from "next-i18next";
import UseDarkmode from "hooks/UseDarkmode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { CustomInput } from "../CustomInput";
import MenuTreeReports from "components/tree/MenuTreeReports";
import usePredefinedBottomRanges from "components/history/usePredefinedBottomRanges";
import { useSelector } from "react-redux";
import Select from "react-select";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import useReverseTranslate from "hooks/useReverseTrans";
import { FixedSizeList } from "react-window";
const { afterToday } = DateRangePicker;

const CurrentActiveReportOptions = (props) => {
  const { t } = useTranslation(["reports", "main", "Table"]);

  const [treeFilter, setTreeFilter] = useState("");
  const [dateStatusCurrent, setDateStatusCurrent] = useState("");
  const [treeData, setTreeData] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const vehicleIds = useSelector((state) => state?.vehicleIds);

  const [accounts, setAccounts] = useState(
    JSON.parse(localStorage.getItem("accounts") ?? "[]") ?? []
  );
  const filterAccounts = useMemo(
    () =>
      accounts.filter((acc) =>
        acc.AccountName.toLowerCase().includes(treeFilter.toLowerCase())
      ),
    [accounts, treeFilter]
  );
  useEffect(() => {
    setDateStatusCurrent(props.reportsDataSelected.dateStatus);
  }, [props.reportsDataSelected]);

  useEffect(() => {
    if (props.treeData?.length) {
      setTreeData(props.treeData)
    }
  }, [props.treeData]);

  useEffect(() => {
    if (props.activeIndex !== -1) {
      props.setFullSelectedReportData((prev) => {
        const old = prev;
        old.data[props.activeIndex]?.vehChecked = props.vehChecked;
        return old;
      });
    }
  }, [props.vehChecked.length]);

  const handleDateOneInput = (e) => {
    const dateformat = e.toString()?.split("GMT");
    const endFormat = [dateFormat(dateformat[0], "isoDateTime")?.split("+")[0]];

    const replacedEndFormat = [
      endFormat.join("").replace(/T\d\d:\d\d:\d\d/, "T23:59:59"),
    ];

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: "",
      endDate: replacedEndFormat,
    }));

    props.reportsDataSelected.endDate = replacedEndFormat;
  };

  const handleDateTwoInput = (value) => {
    const dateformat = value?.map((x) => x.toString()?.split(" GMT")[0]);
    const updateFormat = dateformat?.map((x) => dateFormat(x, "isoDateTime"));
    const endFormat = updateFormat?.map((x) => x?.split("+")[0]);

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: endFormat[0],
      endDate: endFormat[1],
    }));

    props.reportsDataSelected.startDate = endFormat[0];
    props.reportsDataSelected.endDate = endFormat[1];
  };

  const handleAdvancedOptions = (e) => {
    props.setFullSelectedReportData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilter = (e) => {
    const search = e?.target?.value;
    if (props.reportsDataSelected.data) {
      const filteredVeh = props.reportsDataSelected.data.filter(
        (e) =>
          e.DisplayName.replace(/\s/g, "").toLocaleLowerCase() ==
          search.replace(/\s/g, "").toLocaleLowerCase() ||
          e.SerialNumber.toLocaleLowerCase() == search.toLocaleLowerCase()
      );

      if (!filteredVeh) {
        return;
      } else {
        props.setVehChecked(filteredVeh);
      }
    }
    // setTreeFilter(e.target.value.toLocaleLowerCase());
    e.target.value
      ? setTreeData(
        props.treeData.filter((item) => {
          const filterDisplayName = item.DisplayName?.toString()
            .toLocaleLowerCase()
            .replaceAll(" ", "")
            .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
          const filterSerialNumber =
            item.SerialNumber?.replaceAll(" ", "")?.includes(
              e.target.value.toLocaleLowerCase().replaceAll(" ", "")
            ) ||
            item.Serial?.replaceAll(" ", "")?.includes(
              e.target.value.toLocaleLowerCase().replaceAll(" ", "")
            );
          return filterDisplayName || filterSerialNumber;
        })) : setTreeData(props.treeData);
  };

  const handleSelectedVecs = () => props.setShow((prev) => !prev);

  const predefinedBottomRanges = usePredefinedBottomRanges();

  const handleDatePickerValue = (date) => getFullDate(date);

  const getFullDate = (date) => {
    let getYear = date?.split("T")[0]?.split("-")[0];
    let getMonth = +date?.split("T")[0]?.split("-")[1];
    let getDay = date?.split("T")[0]?.split("-")[2];
    let getHour = date?.split("T")[1]?.split(":")[0];
    let getMinute = date?.split("T")[1]?.split(":")[1];
    let getSecond = date?.split("T")[1]?.split(":")[2];

    let dateNow = new Date();
    dateNow.setFullYear(getYear);
    dateNow.setMonth(getMonth - 1);
    dateNow.setDate(getDay);

    dateNow.setHours(getHour);
    dateNow.setMinutes(getMinute);
    dateNow.setSeconds(getSecond);

    return dateNow;
  };

  const handleDateRangePickerValue = (strDate, endDate) => [
    getFullDate(strDate),
    getFullDate(endDate),
  ];

  const handleMenuFilter = (e) => {
    setTreeFilter(e.target.value.toLocaleLowerCase());
    e.target.value
      ? setTreeData(
        [
          props.treeData.filter((item) => {
            const filterDisplayName = item.DisplayName?.toString()
              .toLocaleLowerCase()
              .replaceAll(" ", "")
              .includes(e.target.value.toLocaleLowerCase().replaceAll(" ", ""));
            const filterSerialNumber =
              item.SerialNumber?.replaceAll(" ", "")?.includes(
                e.target.value.toLocaleLowerCase().replaceAll(" ", "")
              ) ||
              item.Serial?.replaceAll(" ", "")?.includes(
                e.target.value.toLocaleLowerCase().replaceAll(" ", "")
              );
            return filterDisplayName || filterSerialNumber;
          }),
        ].flat()
      )
      : setTreeData(props.treeData);
  };

  const handleChangeInput = (e, account) => {
    if (e.target.id === "All" && e.target.checked) {
      setDisabled(true);
      return props.setAccounts(filterAccounts);
    } else if (e.target.id === "All" && !e.target.checked) {
      setDisabled(false);

      return props.setAccounts([]);
    }

    if (e.target.checked)
      return props.setAccounts((prev) => [...prev, account]);

    props.setAccounts((prev) =>
      prev.filter((p) => p.AccountID !== account.AccountID)
    );
  };

  // Realted to custom report
  const handleChangeCol = (e) => {
    if (e.length < 1) {
      props.setCheckedCol(
        props.filterColumns.map((f) => ({
          value: f.field,
          label: t(`Table:${useReverseTranslate(f.headerName)}`),
        }))
      );
      props.setFilterListDCurr(props.filterColumns);
    } else {
      props.setCheckedCol(e);

      props.setFilterListDCurr(
        e.map((el) =>
          props.filterColumns.find((col) => col.field === el?.value)
        )
      );
    }

    localStorage.setItem(
      props.reportsDataSelected.name,
      JSON.stringify(
        e.map((obj) => ({ ...obj, label: useReverseTranslate(obj.label) }))
      )
    );
  };

  // This options that appears in custom report
  const options = useMemo(
    () =>
      props?.filterColumns.map((filter) => ({
        value: filter.field,
        label: t(`Table:${useReverseTranslate(filter.headerName)}`),
      })),
    [props.filterColumns]
  );

  // This to set Accounts in fullSelectedReport
  useEffect(() => {
    props.setFullSelectedReportData((prev) => ({
      ...prev,

      accounts: props?.accounts,
    }));
  }, [props?.accounts?.length]);

  const { darkMode } = useSelector((state) => state.config);

  const light = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : undefined;
  };
  const dark = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : "#151824";
  };

  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: darkMode
          ? "#222738"
          : isDisabled
            ? "#e9ecef"
            : "#FFFFFF",
        borderColor: "#0E6395",
        boxShadow: "none",
        "&:hover": {
          ...styles["&:hover"],
          borderColor: "#0E6395",
        },
        ...(isDisabled
          ? {
            pointerEvents: "auto",
            cursor: "not-allowed",
          }
          : {
            pointerEvents: "auto",
            cursor: "pointer",
          }),
      };
    },
    option: (styles, { isDisabled, isSelected, isFocused }) => {
      return {
        ...styles,
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor: darkMode
          ? dark(isSelected, isFocused)
          : light(isSelected, isFocused),
        color: isSelected ? "#fff" : isFocused ? "#fff" : "inhert",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#0E6395"
              : "#259CDF"
            : undefined,
        },
      };
    },
    singleValue: (styles) => {
      return { ...styles, color: darkMode ? "#fff" : "inhert" };
    },
    menu: (styles) => {
      return { ...styles, backgroundColor: darkMode ? "#151824" : "#fff" };
    },
    input: (styles) => {
      return {
        ...styles,
        color: darkMode ? "#fff" : "#151824",
      };
    },
  };

  const paginationHandleChange = (e) => {
    props.gridApi.paginationSetPageSize(e.value);
    props.setPaginationSize(e.value)
  }
  const paginationsOptions = useMemo(() => [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 30, label: 30 },
    { value: 40, label: 40 },
    { value: 50, label: 50 }
  ],
    [props.paginationSize]
  );

  return (
    <>
      <Row className="align-items-center">
        {/* =====| select date |===== */}
        <Col md="3" className="mb-2" id="ReportDateRange">
          {dateStatusCurrent === "two" ? (
            <>
              <Form.Group
                className="mb-3 d-flex flex-column"
                controlId="exampleForm.ControlInput1"
              >
                <DateRangePicker
                  cleanable={false}
                  onChange={(e) => handleDateTwoInput(e)}
                  format="yyyy-MM-dd HH:mm:ss"
                  className="order-2 w-100 bg-transparent"
                  onOk={(e) => handleDateTwoInput(e)}
                  value={
                    props.reportsDataSelected.startDate &&
                      props.reportsDataSelected.endDate
                      ? handleDateRangePickerValue(
                        props.reportsDataSelected.startDate,
                        props.reportsDataSelected.endDate
                      )
                      : [
                        new Date(
                          new Date(
                            new Date(new Date().setSeconds("00")).setMinutes(
                              "00"
                            )
                          ).setHours("00")
                        ),
                        new Date(),
                      ]
                  }
                  placeholder={t("Select_Date_Range_key")}
                  shouldDisableDate={afterToday()}
                  ranges={predefinedBottomRanges}
                  defaultValue={
                    props.fullSelectedReportData.startDate &&
                      props.fullSelectedReportData.endDate
                      ? handleDateRangePickerValue(
                        props.fullSelectedReportData.startDate,
                        props.fullSelectedReportData.endDate
                      )
                      : [
                        new Date(
                          new Date(
                            new Date(new Date().setSeconds("00")).setMinutes(
                              "00"
                            )
                          ).setHours("00")
                        ),
                        new Date(),
                      ]
                  }
                  locale={{
                    sunday: t("Su"),
                    monday: t("Mo"),
                    tuesday: t("Tu"),
                    wednesday: t("We"),
                    thursday: t("Th"),
                    friday: t("Fr"),
                    saturday: t("Sa"),
                    ok: t("OK"),
                    today: t("Today"),
                    yesterday: t("Yesterday"),
                    hours: t("Hours"),
                    minutes: t("Minutes"),
                    seconds: t("Seconds"),
                    last7Days: t("last7Days"),
                    January: t("January"),
                    February: t("February"),
                    March: t("March"),
                    April: t("April"),
                    May: t("May"),
                    June: t("June"),
                    July: t("July"),
                    August: t("August"),
                    September: t("September"),
                    October: t("October"),
                    november: t("nov"),
                    december: t("De"),
                  }}
                />

                <Form.Label className="order-1">
                  {t("Select_Date_Range_key")}
                </Form.Label>
              </Form.Group>
            </>
          ) : dateStatusCurrent === "one" ? (
            <Form.Group
              className="mb-3 d-flex flex-column"
              controlId="exampleForm.ControlInput1"
            >
              <DatePicker
                className="order-2 w-100 bg-transparent"
                onOk={(e) => handleDateOneInput(e)}
                value={
                  Array.isArray(props?.reportsDataSelected?.endDate)
                    ? handleDatePickerValue(
                      props.reportsDataSelected.endDate[0]
                    )
                    : new Date(
                      new Date(
                        new Date(new Date().setSeconds("00")).setMinutes("00")
                      ).setHours("00")
                    )
                }
                onChangeCalendarDate={(e) => {
                  handleDateOneInput(e);
                }}
                placeholder={t("Select_Date_key")}
                shouldDisableDate={afterToday()}
                defaultValue={
                  Array.isArray(props?.fullSelectedReportData?.endDate)
                    ? handleDatePickerValue(
                      props.fullSelectedReportData.endDate[0]
                    )
                    : new Date(
                      new Date(
                        new Date(new Date().setSeconds("00")).setMinutes("00")
                      ).setHours("00")
                    )
                }
                locale={{
                  sunday: t("Su"),
                  monday: t("Mo"),
                  tuesday: t("Tu"),
                  wednesday: t("We"),
                  thursday: t("Th"),
                  friday: t("Fr"),
                  saturday: t("Sa"),
                  ok: t("OK"),
                  today: t("Today"),
                  yesterday: t("Yesterday"),
                  hours: t("Hours"),
                  minutes: t("Minutes"),
                  seconds: t("Seconds"),
                  last7Days: t("last7Days"),
                  January: t("January"),
                  February: t("February"),
                  March: t("March"),
                  April: t("April"),
                  May: t("May"),
                  June: t("June"),
                  July: t("July"),
                  August: t("August"),
                  September: t("September"),
                  October: t("October"),
                  november: t("nov"),
                  december: t("De"),
                }}
              />
              <Form.Label className="order-1">
                {t("Select_Date_key")}
              </Form.Label>
            </Form.Group>
          ) : null}
        </Col>
        <Col md="4" style={{ marginTop: "8px" }}>
          <Select
            value={
              localStorage.getItem(props.reportsDataSelected.name) &&
              JSON.parse(
                localStorage.getItem(props.reportsDataSelected.name)
              ).map((obj) => ({ ...obj, label: t(`Table:${obj.label}`) }))
            }
            isMulti
            placeholder={t("select_your_columns")}
            name="columns"
            options={options}
            onChange={handleChangeCol}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={colorStyles}
          />
        </Col>
        <Col className="d-flex gap-1 align-items-center">
          <Form.Group
            className="mb-3 d-flex flex-column w-100"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label className="order-1">
              {t("Rows_per_Page")}
            </Form.Label>
          <Select
            defaultValue={props.paginationSize}
              placeholder={props.paginationSize}
            name="paginationSize"
            options={paginationsOptions}
            onChange={paginationHandleChange}
            isSearchable={false}
            classNamePrefix="select"
              className="order-2 w-100"
            styles={colorStyles}
          />
          </Form.Group>
        </Col>

        {/* =====| select date |===== */}
        {t(props.reportsDataSelected.name) === t("Fuel_Summary_Report_key") && (
          <CustomInput
            ClassN="col-md-3"
            Type="number"
            Label={t("Fuel_Price_(RS)_key")}
            Placeholder={t("Fuel_Price_(RS)_key")}
            handleChange={handleAdvancedOptions}
            Name="fuelData"
            value={props.fullSelectedReportData.fuelData}
          />
        )}

        <Col
          md={3}
          className={`${style["action-buttons"]} mb-2`}
          style={{ marginTop: "15px" }}
        >
          <Button
            variant="primary"
            className=" px-4 py-2 my-1 rounded text-nowrap d-flex align-items-center gap-2"
            onClick={handleSelectedVecs}
          >
            <FontAwesomeIcon icon={faFilter} size="sm" />
            {props?.reportsDataSelected.name === "Active_Devices_Summary_Key"
              ? t("Select Account")
              : t("Select_Vichales")}
          </Button>
          <Button
            onClick={() =>
              props.onHide(
                "updateCurrentActiveReportOptions",
                props.reportsDataSelected.name,
                props.fullSelectedReportData
              )
            }
            variant="primary"
            className=" px-4 py-2 my-1 rounded text-nowrap d-flex align-items-center gap-2"
            disabled={
              props.loadingShowCurrentReport == props.reportsDataSelected.id
            }
          >
            <FontAwesomeIcon icon={faSearch} size="sm" />
            {props.loadingShowCurrentReport == props.reportsDataSelected.id
              ? t("Loading_key")
              : t("Show_Reports_key")}
          </Button>
        </Col>
      </Row>

      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: UseDarkmode("#222738", "#FFFFFF"),
            borderBottomColor: UseDarkmode("#151824", "#DDD"),
          }}
        >
          <div
            className={`d-flex justify-content-center align-items-center ${style.bxTitleIcon}`}
          >
            <span>
              <FontAwesomeIcon
                icon={faFileAlt}
                className={`${style.icon} text-${UseDarkmode(
                  "light",
                  "primary"
                )}`}
              />
            </span>
            <span className="text-center fs-6 w-50">
              {t(props.reportsDataSelected.name)}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            background: UseDarkmode("#222738", "#FFFFFF"),
            overflow: "hidden",
          }}
        >
          {props.reportsDataSelected.name !== "Active_Devices_Summary_Key" && (
            <CustomInput
              ClassN="col-12"
              Type="text"
              // value={treeFilter}
              Label={t("displayName_or_serialNumber_key")}
              Placeholder={t("displayName_or_serialNumber_key")}
              handleChange={handleMenuFilter}
            />
          )}

          {props.vehiclesError && (
            <span className="text-danger fs-6">{props.vehiclesError}</span>
          )}

          {props.reportsDataSelected.name === "Active_Devices_Summary_Key" && (
            <CustomInput
              ClassN="col"
              Type="text"
              value={treeFilter}
              Placeholder={t("Search By Account Name")}
              handleChange={(e) => setTreeFilter(e.target.value)}
            />
          )}
          {props.reportsDataSelected.name !== "Active_Devices_Summary_Key" ? (
            <MenuTreeReports
              setVehiclesError={props.setVehiclesError}
              treeFilter={treeFilter}
              vehData={treeData}
              vehicleIds={vehicleIds}
              vehChecked={props.vehChecked}
              setVehChecked={props.setVehChecked}
            />
          ) : (
            <>
              <span className="d-block mb-2">Select Accounts</span>
              <div>
                <Form.Check
                  key="All"
                  type="checkbox"
                  label="All"
                  id="All"
                  onChange={(e) => handleChangeInput(e, "All")}
                />
                <FixedSizeList
                  height={200} // Specify the height of the list
                  itemCount={filterAccounts?.length}
                  itemSize={23} // Specify the height of each item
                >
                  {({ index, style }) => {
                    const account = filterAccounts[index];
                    const isChecked = props?.accounts?.some(
                      (ac) => ac.AccountID === account.AccountID
                    );

                    return (
                      <Form.Check
                        key={account.AccountID}
                        type="checkbox"
                        checked={isChecked}
                        disabled={disabled}
                        label={account.AccountName}
                        id={account.AccountID}
                        onChange={(e) => handleChangeInput(e, account)}
                        style={style} // Apply the style provided by react-window
                      />
                    );
                  }}
                </FixedSizeList>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            background: UseDarkmode("#222738", "#FFFFFF"),
            borderTopColor: UseDarkmode("#151824", "#DDD"),
          }}
        >
          <Button
            className="my-0 mx-auto  py-2 px-5"
            onClick={() => props.setShow(false)}
          >
            {t("Save_key")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrentActiveReportOptions;
