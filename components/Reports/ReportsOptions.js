import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import dateFormat from "dateformat";
import style from "styles/ReportsOptions.module.scss";
import "rsuite/dist/rsuite.min.css";
import { DateRangePicker, DatePicker } from "rsuite";
import { useTranslation } from "next-i18next";
import UseDarkmode from "hooks/UseDarkmode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { CustomInput } from "../CustomInput";
import { encryptName } from "helpers/encryptions";
import MenuTreeReports from "components/tree/MenuTreeReports";
import usePredefinedBottomRanges from "components/history/usePredefinedBottomRanges";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
const { afterToday } = DateRangePicker;
import { FixedSizeList } from "react-window";
import Select from "react-select";
import StreamHelper from "helpers/streamHelper";

const ReportsOptions = (props) => {
  const { t } = useTranslation("reports");
  const [treeFilter, setTreeFilter] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehData, setVehData] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const {CalcVstatus} = StreamHelper()

  const vehicleIds = useSelector((state) => state?.vehicleIds);
  const allVehicles = useSelector((state) => state.streamData.allVehicles);



  useEffect(() => {
    if (props.treeData) {
      const fulVeh = props.treeData?.map(v => ({...v , VehicleStatus: CalcVstatus(v)}))

      setVehData(fulVeh)
    }
  } , [props.treeData])
  // useEffect(() => {
  //   if (allVehicles.length > 0) {
  //     setTreeData([...allVehicles]);
  //     setVehData([...allVehicles]);
  //   } else {
  //     const { vehData } =
  //       JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") || [];
  //     setVehData(vehData);
  //     setTreeData(vehData);
  //   }
  // }, []);

  const [value, setValue] = useState([]);

  const handleDateOneInput = (date) => {
    const dateformat = date.toString()?.split("GMT");
    const endFormat = [dateFormat(dateformat[0], "isoDateTime")?.split("+")[0]];
    const replacedEndFormat = [
      endFormat.join("").replace(/T\d\d:\d\d:\d\d/, "T23:59:59"),
    ];

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: "",
      endDate: replacedEndFormat,
      accounts: props.accounts,
    }));
  };

  const handleDateTwoInput = (e) => {
    const dateformat = e?.map((x) => x.toString()?.split(" GMT")[0]);
    const updateFormat = dateformat?.map((x) => dateFormat(x, "isoDateTime"));
    const endFormat = updateFormat?.map((x) => x?.split("+")[0]);

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: endFormat[0],
      endDate: endFormat[1],
    }));
  };

  const handleAdvancedOptions = (e) => {
    props.setFullSelectedReportData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilter = (e) => {
    setTreeFilter(e.target.value.toLocaleLowerCase());

    e.target.value
      ? setVehData(
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
          })
        )
      : setVehData(props.treeData);
  };

  // This to make a search works in delete
  const accountOptionsFilter = useMemo(() => {
    return accountOptions.filter((acc) =>
      acc.AccountName.toLocaleLowerCase().includes(treeFilter.toLowerCase())
    );
  }, [accountOptions, treeFilter]);

  const predefinedBottomRanges = usePredefinedBottomRanges();

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      if (localStorage.getItem("accounts")) {
        setAccountOptions(JSON.parse(localStorage.getItem("accounts")));
        setLoading(false);
      } else {
        try {
          const res = await axios.get("support/allAccountsForReports");

          setAccountOptions(res.data.result);
          localStorage.setItem("accounts", JSON.stringify(res?.data.result));

          setLoading(false);
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setLoading(false);
        }
      }
    };
    if (props.reportsTitleSelected === "Active_Devices_Summary_Key") {
      fetchAccounts();
    }
  }, [props.reportsTitleSelected === "Active_Devices_Summary_Key"]);

  const handleChangeInput = (e, account) => {
    if (e.target.id === "All" && e.target.checked) {
      setDisabled(true);
      return props.setAccounts(accountOptions);
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

  const onChangeSelect = (e, actionMeta) => {
    const isRemoveValueAction = actionMeta.action === "remove-value";
    const isClearAction = actionMeta.action === "clear";

    if ((isRemoveValueAction && value.length === 1) || isClearAction) {
      setValue([]);
    }

    e.forEach((ele) => {
      if (ele.label === "All") {
        setValue(e.filter((el) => el.label === "All"));

        props.setFullSelectedReportData((prev) => ({
          ...prev,
          geoId: e.filter((el) => el.label === "All").map((ele) => ele.value),
        }));
      } else {
        setValue(e.filter((ele) => ele.label !== "All"));
        props.setFullSelectedReportData((prev) => ({
          ...prev,
          geoId: e
            .filter((el) => el.label !== "All")
            .map((ele) => ele.value)
            .join(","),
        }));
      }
    });
  };

  return (
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
            {t(props.reportsTitleSelected)}
          </span>
        </div>
      </Modal.Header>

      <Modal.Body
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          overflow: "hidden",
        }}
      >
        <Row>
          {/* =====| select date |===== */}
          <Col md="12">
            {props.dateStatus === "two" ? (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>{t("Select_Date_Range_key")}</Form.Label>
                  <DateRangePicker
                    className="w-100 bg-transparent"
                    cleanable={false}
                    onChange={(e) => handleDateTwoInput(e)}
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder={t("Select_Date_Range_key")}
                    shouldDisableDate={afterToday()}
                    ranges={predefinedBottomRanges}
                    defaultValue={[
                      new Date(
                        new Date(
                          new Date(new Date().setSeconds("00")).setMinutes("00")
                        ).setHours("00")
                      ),
                      new Date(
                        new Date(
                          new Date(new Date().setSeconds("59")).setMinutes("59")
                        ).setHours("23")
                      ),
                    ]}
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
                </Form.Group>
              </>
            ) : props.dateStatus === "one" ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>{t("Select_Date_key")}</Form.Label>
                <DatePicker
                  className="w-100 bg-transparent"
                  onOk={(e) => handleDateOneInput(e)}
                  onChange={(e) => handleDateOneInput(e)}
                  placeholder={t("Select_Date_key")}
                  shouldDisableDate={afterToday()}
                  showMeridian
                  defaultValue={
                    new Date(
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
              </Form.Group>
            ) : null}
          </Col>

          <Col md="12">
            {props?.reportsTitleSelected === "Geofences_Log_key" && (
              <Select
                isMulti
                name="colors"
                // closeMenuOnSelect={false}
                // value={value}
                options={props?.geofencesOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Geofences"
                onChange={(e) => {
                  props.setFullSelectedReportData((prev) => ({
                    ...prev,
                    geoId: e.map((ele) => ele.value).join(","),
                  }));
                }}
                // onChange={onChangeSelect}
              />
            )}
          </Col>

          {/* =====| select date |===== */}
          {t(props.reportsTitleSelected) === t("Fuel_Summary_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="number"
              Placeholder={t("Fuel_Price_RS_key")}
              handleChange={handleAdvancedOptions}
              Name="fuelData"
              value={props.fullSelectedReportData.fuelData}
            />
          )}

          {/* =====| select date |===== */}

          {/* {t(props.reportsTitleSelected) === t("Over_Speed_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="number"
              Placeholder={t("Minimum_Speed_KMH_key")}
              handleChange={handleAdvancedOptions}
              Name="overSpeed"
            />
          )} */}

          {t(props.reportsTitleSelected) ===
            t("Speed_Over_Duration_Report_key") && (
            <>
              {/* <CustomInput
                ClassN="col-6"
                Type="number"
                Placeholder={t("Minimum_Speed_KMH_key")}
                handleChange={handleAdvancedOptions}
                Name="minimumSpeed"
              /> */}

              {/* <CustomInput
                ClassN="col-6"
                Type="number"
                Placeholder={t("Duration_Seconds_key")}
                handleChange={handleAdvancedOptions}
                Name="speedDurationOver"
              /> */}
            </>
          )}

          {props.dateStatus === "two" && (
            <CustomInput
              ClassN="col"
              Type="text"
              Placeholder={t("displayName_or_serialNumber_key")}
              handleChange={handleFilter}
            />
          )}
          
          {props.dateStatus === "one" &&
            props.reportsTitleSelected !== "Active_Devices_Summary_Key" && (
              <CustomInput
                ClassN="col"
                Type="text"
                Placeholder={t("displayName_or_serialNumber_key")}
                handleChange={handleFilter}
              />
            )}

          {props.reportsTitleSelected === "Active_Devices_Summary_Key" && (
            <CustomInput
              ClassN="col"
              Type="text"
              value={treeFilter}
              Placeholder={t("Search By Account Name")}
              handleChange={(e) => setTreeFilter(e.target.value)}
            />
          )}

          {/* {t(props.reportsTitleSelected) === t("Trip_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="text"
              Placeholder={t("Duration_Seconds_key")}
              handleChange={handleAdvancedOptions}
              Name="tripDuration"
            />
          )} */}
          {/* <div className="d-flex"> */}
          {/* <p style={{ marginRight: ".5rem" }}> */}
          {/* Calculate As Version 5 */}
          {/* {t("Calculate_As")} */}
          {/* </p> */}
          {/* <input
              type="checkBox"
              onClick={() => dispatch(dateVersionToggle())}
              checked={version5}
            /> */}
          {/* </div> */}

          {props.dateStatus !== "two" && props.dateStatus !== "one" ? (
            <>
              <CustomInput
                ClassN="col"
                Type="text"
                // Label={t("Select_Vehicles_key")}
                Placeholder={t("displayName_or_serialNumber_key")}
                handleChange={handleFilter}
              />
            </>
          ) : (
            props.reportsTitleSelected !== "Active_Devices_Summary_Key" && (
              <span className={`text-secondary d-block mt-4 mb-4`}>
                {t("Select_Vichales")}
                {/* Select Vehicles */}
              </span>
            )
          )}
          {props.vehiclesError && (
            <span className="text-danger fs-6">{props.vehiclesError}</span>
          )}

          {props.reportsTitleSelected !== "Active_Devices_Summary_Key" ? (
            <MenuTreeReports
              setVehiclesError={props.setVehiclesError}
              treeFilter={treeFilter}
              vehData={vehData}
              
              vechLoading={props.vechLoading}
              vehicleIds={vehicleIds}
              vehChecked={props.vehChecked}
              setVehChecked={props.setVehChecked}
            />
          ) : (
            <div>
              <span className="d-block mb-2">Select Accounts</span>
              <div>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <>
                    <Form.Check
                      key="All"
                      type="checkbox"
                      label="All"
                      id="All"
                      onChange={(e) => handleChangeInput(e, "All")}
                    />
                    <FixedSizeList
                      height={200} // Specify the height of the list
                      itemCount={accountOptionsFilter.length}
                      itemSize={23} // Specify the height of each item
                    >
                      {({ index, style }) => {
                        const account = accountOptionsFilter[index];
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
                  </>
                )}
              </div>
            </div>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          borderTopColor: UseDarkmode("#151824", "#DDD"),
        }}
      >
        <Button
          className="my-0 mx-auto  py-2 px-5"
          onClick={() => {
            props.onHide(
              "Show",
              props.reportsTitleSelected,
              props.fullSelectedReportData
            );
            
          }}
          disabled={props.loadingShowReport}
        >
          {props.loadingShowReport ? t("Loading_key") : t("Show_Reports_key")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportsOptions;
