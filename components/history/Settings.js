import CheckBoxes from "./CheckBoxes";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import RangeDraw from "./RangeDraw";
import { useSelector } from "react-redux";
import ReactSelect from "components/Select";
import { BsFillArrowUpCircleFill, BsArrowUpSquareFill } from "react-icons/bs";
import {
  FaArrowAltCircleUp,
  FaLocationArrow,
  FaMapMarker,
  FaMapMarkerAlt,
  FaMapSigns,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { GoArrowUp } from "react-icons/go";
import { MdDoubleArrow } from "react-icons/md";
import {
  RiArrowUpFill,
  RiMapPinAddFill,
  RiMapPinFill,
  RiMapPinRangeFill,
  RiRoadMapFill,
  RiMapPin4Fill,
  RiMapPin5Fill,
} from "react-icons/ri";
import { TiArrowUpThick } from "react-icons/ti";
import { TbArrowBigUpLines } from "react-icons/tb";
import { InputGroup, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@mui/material";
import Styles from "styles/Settings.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

const Settings = ({
  setShowDatePicker,
  handleSaveSettings,
  setGetAllLocations,
  getAllLocations,
  MinDistance,
  MaxMarkers,
  MaxGuides,
  allMarkers,
  colorOfMarkers,
  colorOfGuides,
  markerIcon,
  guidesIcon,
  setMinDistance,
  setMaxMarkers,
  setMaxGuides,
  setAllMarkers,
  setColorOfMarkers,
  setColorOfGuides,
  setMarkerIcon,
  setGuidesIcon,

  chartModal,
  setchartModal,
  geofences,
  setGeofences,
  L,
  isToggleConfigOpen,
  setisToggleConfigOpen,
  t,
  landMarks,
  setLandMarks,
  rangeDraw,

  pathSteps,

  setRangeDraw,

  fullPathGroup,
  rangeError,
  setRangeError,
  workstep,
  locInfo,
  isFromState,
  drawOptions,
  drawselectedsteps,
  isLandMarkChecked,
  setIsLandMarkChecked,
  isGeofencesChecked,
  setIsGeofencesChecked,
}) => {
  const darkmode = useSelector((state) => state.config.darkMode);

  const handleIconMarker = (value) => setMarkerIcon(value);
  const handleIconGuides = (value) => setGuidesIcon(value);

  const { locale } = useRouter();

  const markerOptions = [
    {
      label: t("map_pin_add_fill_key"),
      value: "RiMapPinAddFill",
      icon: <RiMapPinAddFill />,
    },
    {
      label: t("map_pin_fill_key"),
      value: "RiMapPinFill",
      icon: <RiMapPinFill />,
    },
    {
      label: t("map_pin_range_fill_key"),
      value: "RiMapPinRangeFill",
      icon: <RiMapPinRangeFill />,
    },
    {
      label: t("road_map_fill_key"),
      value: "RiRoadMapFill",
      icon: <RiRoadMapFill />,
    },
    {
      label: t("map_pin_4_fill_key"),
      value: "RiMapPin4Fill",
      icon: <RiMapPin4Fill />,
    },
    {
      label: t("map_pin_5_fill_key"),
      value: "RiMapPin5Fill",
      icon: <RiMapPin5Fill />,
    },
    {
      label: t("map_marker_key"),
      value: "FaMapMarker",
      icon: <FaMapMarker />,
    },
    {
      label: t("map_marker_alt_key"),
      value: "FaMapMarkerAlt",
      icon: <FaMapMarkerAlt />,
    },
    { label: t("map_signs_key"), value: "FaMapSigns", icon: <FaMapSigns /> },
    {
      label: t("map_marked_alt_key"),
      value: "FaMapMarkedAlt",
      icon: <FaMapMarkedAlt />,
    },
  ];

  const guidesOptions = [
    {
      label: t("location_arrow_key"),
      value: "FaLocationArrow",
      icon: <FaLocationArrow />,
    },
    {
      label: t("fill_arrow_up_circle_fill_key"),
      value: "BsFillArrowUpCircleFill",
      icon: <BsFillArrowUpCircleFill />,
    },
    {
      label: t("arrow_up_square_fill_key"),
      value: "BsArrowUpSquareFill",
      icon: <BsArrowUpSquareFill />,
    },
    {
      label: t("arrow_alt_circle_up_key"),
      value: "FaArrowAltCircleUp",
      icon: <FaArrowAltCircleUp />,
    },
    { label: t("arrow_up_key"), value: "GoArrowUp", icon: <GoArrowUp /> },
    {
      label: t("double_arrow_key"),
      value: "MdDoubleArrow",
      icon: <MdDoubleArrow />,
    },
    {
      label: t("arrow_up_fill_key"),
      value: "RiArrowUpFill",
      icon: <RiArrowUpFill />,
    },
    {
      label: t("arrow_big_up_lines_key"),
      value: "TbArrowBigUpLines",
      icon: <TbArrowBigUpLines />,
    },
    {
      label: t("arrow_up_thick_key"),
      value: "TiArrowUpThick",
      icon: <TiArrowUpThick />,
    },
  ];

  return (
    <div
      className={`${darkmode ? "bg-dark" : "bg-white"}`}
      style={{
        position: "absolute",
        top: "-40px",
        zIndex: "2000000",
      }}
    >
      {isToggleConfigOpen && (
        <>
          <Button
            onClick={() => {
              setisToggleConfigOpen((prev) => !prev);
            }}
            className={`${Styles.config_btn2_close} ${
              darkmode && Styles.config_btn2_dark
            }`}
            style={{
              left: locale === "ar" ? "0" : "",
              right: !(locale === "ar") ? "0" : "",
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
          <h4 className={`${Styles.title} pt-2 ms-3`}>{t("config_key")}</h4>
          <div className={`pt-3  ${Styles.config_main}`} data-scroll="1">
            <div className={`${Styles.nav__item} ${Styles.active}`}>
              <div
                className="container "
                style={{
                  height: "70vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  margin: "0px !important",
                }}
              >
                {pathSteps?.length > 100 && (
                  <RangeDraw
                    label={rangeDraw.label}
                    min={0}
                    max={pathSteps?.length - 1}
                    step={rangeDraw.step}
                    value={rangeDraw.value}
                    setRangeDraw={setRangeDraw}
                    pathSteps={pathSteps}
                    fullPathGroup={fullPathGroup}
                    workstep={workstep}
                    locInfo={locInfo}
                    isFromState={isFromState}
                    drawOptions={drawOptions}
                    drawselectedsteps={drawselectedsteps}
                  />
                )}

                <div className="d-flex  align-items-center mb-2">
                  <Switch
                    onClick={() => {
                      setGetAllLocations((prev) => !prev);
                      if (rangeError) {
                        setRangeError(false);
                      }
                    }}
                    style={{
                      color: getAllLocations ? "#0E6395" : "#fff",
                    }}
                    checked={getAllLocations}
                    value={getAllLocations}
                  />
                  <div className="lead">{t("show_all_locations_key")}</div>
                </div>

                <ReactSelect
                  onSelectChange={handleIconMarker}
                  options={markerOptions}
                  defaultValue={markerOptions.find(
                    (option) => option.value == markerIcon
                  )}
                  label={t("select_icon_marker_key")}
                  className="mb-3"
                  formatOptionLabel={(guide) => (
                    <div className={`d-flex align-items-center`}>
                      {guide.icon}
                      <span className="ms-2 text-capitalize">
                        {guide.label}
                      </span>
                    </div>
                  )}
                />
                <ReactSelect
                  onSelectChange={handleIconGuides}
                  options={guidesOptions}
                  defaultValue={guidesOptions.find(
                    (option) => option.value == guidesIcon
                  )}
                  label={t("select_icon_guides_key")}
                  className="mb-3"
                  formatOptionLabel={(guide) => (
                    <div className={`d-flex align-items-center`}>
                      {guide.icon}
                      <span className="ms-2 text-capitalize">
                        {guide.label}
                      </span>
                    </div>
                  )}
                />

                <InputGroup className="mb-3">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="border-primary fw-bold w-75"
                  >
                    {t("color_of_markers_key")}
                  </InputGroup.Text>
                  <Form.Control
                    type="color"
                    id="favcolorMarkers"
                    name="favcolorMarkers"
                    className="border-primary fw-bold w-25"
                    placeholder="20 as default"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon1"
                    value={colorOfMarkers}
                    onChange={(e) => setColorOfMarkers(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text
                    id="basic-addon2"
                    className="fw-bold w-75 border-primary"
                  >
                    {t("color_of_guides_key")}
                  </InputGroup.Text>
                  <Form.Control
                    type="color"
                    id="favcolorGuides"
                    name="favcolorGuides"
                    className="border-primary fw-bold w-25"
                    placeholder="20 as default"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={colorOfGuides}
                    onChange={(e) => setColorOfGuides(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text
                    id="basic-addon2"
                    className="fw-bold w-75 border-primary"
                  >
                    {t("optimize_distance_key")}
                  </InputGroup.Text>
                  <Form.Control
                    className="border-primary fw-bold w-25"
                    placeholder="20"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={MinDistance}
                    onChange={(e) => setMinDistance(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text
                    id="basic-addon2"
                    className="fw-bold w-75 border-primary"
                  >
                    {t("points_on_the_map_key")}
                  </InputGroup.Text>
                  <Form.Control
                    className="border-primary fw-bold w-25"
                    placeholder="500"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={MaxMarkers}
                    onChange={(e) => setMaxMarkers(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="mb-4">
                  <InputGroup.Text
                    id="basic-addon2"
                    className="fw-bold w-75 border-primary"
                  >
                    {t("guides_between_points_key")}
                  </InputGroup.Text>
                  <Form.Control
                    className="border-primary fw-bold w-25"
                    placeholder="500"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={MaxGuides}
                    onChange={(e) => setMaxGuides(e.target.value)}
                  />
                </InputGroup>

                <CheckBoxes
                  geofences={geofences}
                  setGeofences={setGeofences}
                  chartModal={chartModal}
                  setchartModal={setchartModal}
                  L={L}
                  setAllMarkers={setAllMarkers}
                  allMarkers={allMarkers}
                  landMarks={landMarks}
                  setLandMarks={setLandMarks}
                  isGeofencesChecked={isGeofencesChecked}
                  isLandMarkChecked={isLandMarkChecked}
                  setIsGeofencesChecked={setIsGeofencesChecked}
                  setIsLandMarkChecked={setIsLandMarkChecked}
                />

                <div className="my-3">
                  <Button
                    onClick={handleSaveSettings}
                    className="btn btn-primary w-75 d-block px-4 py-2 mx-auto mb-4"
                  >
                    {t("save_changes_key")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
