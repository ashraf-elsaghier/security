import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { CustomInput } from "../../../CustomInput";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

const AddModalLandMarks = ({
  setData_table,
  showAddMarkModal,
  setShowViewMarkModal,
  setShowAddMarkModal,
}) => {
  const L = require("leaflet");
  const { myMap } = useSelector((state) => state.mainMap);
  const { darkMode } = useSelector((state) => state.config);

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation("Table");
  const [Name, setName] = useState("");
  const [Longitude, setLongitude] = useState("");
  const [Latitude, setLatitude] = useState("");
  const [iconMarker, setIconMarker] = useState("Bank.png");

  const [loading, setLoading] = useState(false);
  const [LatitudeMsg, setLatitudeMsg] = useState("");
  const [LongitudeMsg, setLongitudeMsg] = useState("");

  let drawer = new L.Draw.Marker(myMap, {
    icon: L.icon({
      shadowUrl: null,
      iconAnchor: new L.Point(12, 12),
      iconSize: new L.Point(24, 24),
      iconUrl: `/assets/images/landmarks/${iconMarker}`,
    }),
  });

  const postDrawLayer = async (layer, idx = 0) => {
    try {
      let drawObject = {
        POIName: Name + (idx ? idx : ""),
        Longitude: layer.length ? layer?.getLatLng().lng : +Longitude,
        Latitude: layer.length ? layer?.getLatLng().lat : +Latitude,
        Icon: iconMarker,
        IsAccountVisible: true,
      };

      const resp = await axios.post(`landmarks`, { ...drawObject });

      if (resp.status === 201) {
        toast.success("LandMarks Added Successfully.");
        return {
          id: L.stamp(layer),
          drawObject: {
            ...drawObject,
            ID: resp?.data?.newLandMark[0]?.ID,
          },
        };
      } else {
        toast.error(`Error: Can Not Add LandMarks `);
        return { id: 0 };
      }
    } catch (e) {
      toast.error(`Error: Can Not Add LandMarks `);
    }
    return { id: 0 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const layers = myMap.groups.markerGroup.getLayers();
    // if (!layers.length) {
    //   toast.error(`Please Draw LandMarks on the map first..`);
    //   return;
    // }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);

    let promises = [];
    layers?.forEach((layer, idx) => {
      const promise = postDrawLayer(layer, idx);
      promises.push(promise);
    });
    if (!layers.length) {
      const promise = postDrawLayer([], 0);
      promises.push(promise);
    }

    // await Promise.all(promises);
    (await Promise.all(promises)).forEach((resp) => {
      if (resp.id) {
        // setLandMarkss((prev) => [...prev, resp.drawObject]);
        myMap.groups.markerGroup.removeLayer(resp.id);
        setData_table((prev) => [...prev, resp.drawObject]);
      }
    });

    if (!myMap.groups.markerGroup.getLayers().length) {
      setShowAddMarkModal(false);
      setShowViewMarkModal(true);
      setValidated(false);
    }
    setLoading(false);
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleOnKeyPress = (e, setMsg) => {
    if (checkIfNumber(e)) {
      e.preventDefault();

      setMsg("Please Enter Number Only! ");
    } else {
      setMsg("");
    }
  };

  const handleOnLongitudeKeyPress = (e) => handleOnKeyPress(e, setLongitudeMsg);

  const handleOnLatitudeKeyPress = (e) => handleOnKeyPress(e, setLatitudeMsg);

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "Name" && setName(value);
    name === "Longitude" && setLongitude(value);
    name === "Latitude" && setLatitude(value);
  };

  const IconMarkerOptions = useMemo(() => [
    {
      label: `sedan_key`,
      img: "/assets/images/landmarks/Bank.png",
      name: "Bank.png",
    },
    {
      label: `minivan_key`,
      img: "/assets/images/landmarks/Building.png",
      name: "Building.png",
    },
    {
      label: `sedan_key`,
      img: "/assets/images/landmarks/Home.png",
      name: "Home.png",
    },
    {
      label: `pickup_key`,
      img: "/assets/images/landmarks/Office-01.png",
      name: "Office-01.png",
    },
    {
      label: `truck_head_key`,
      img: "/assets/images/landmarks/School-01.png",
      name: "School-01.png",
    },
    {
      label: `reefer_truck_key`,
      img: "/assets/images/landmarks/University.png",
      name: "University.png",
    },
  ]);

  useEffect(() => {
    drawer.enable();
    let markerGroupLayers = myMap.groups.markerGroup.getLayers();

    if (showAddMarkModal && !markerGroupLayers.length) {
      myMap.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer;
        layer.options["layerType"] = e.layerType;
        setLongitude(layer.getLatLng().lng);
        setLatitude(layer.getLatLng().lat);
        layer.addTo(myMap.groups.markerGroup);
        myMap.groups.markerGroup.addLayer(layer);
      });
    }
    return () => {
      drawer.disable();
    };
  }, [showAddMarkModal]);

  return (
    <div
      className={` p-3 rounded shadow `}
      style={{
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <CustomInput
            ClassN="col-12 col-md-6 col-lg-4 mb-3"
            required={true}
            value={Name}
            handleChange={handleChange}
            Name="Name"
            Label={t("LandMark_Name")}
          />

          <Form.Group
            className="col-12 col-md-6 col-lg-4 mb-3"
            controlId={t("Latitude")}
          >
            <Form.Label>{t("Latitude")}</Form.Label>
            <Form.Control
              className="border-primary fw-bold"
              name="Latitude"
              value={Latitude}
              onChange={handleChange}
              type="number"
              placeholder={t("Latitude")}
              required={true}
              onKeyPress={handleOnLatitudeKeyPress}
            />
            <Form.Control.Feedback type="invalid">
              {t("Latitude_is_required")}
            </Form.Control.Feedback>

            {LatitudeMsg && <p className="text-danger">{LatitudeMsg}</p>}
          </Form.Group>

          <Form.Group
            className="col-12 col-md-6 col-lg-4 mb-3"
            controlId={t("Longitude")}
          >
            <Form.Label>{t("Longitude")}</Form.Label>
            <Form.Control
              className="border-primary fw-bold"
              name="Longitude"
              value={Longitude}
              onChange={handleChange}
              type="number"
              placeholder={t("Longitude")}
              required={true}
              onKeyPress={handleOnLongitudeKeyPress}
            />
            <Form.Control.Feedback type="invalid">
              {t("Longitude_is_required")}
            </Form.Control.Feedback>

            {LongitudeMsg && <p className="text-danger">{LongitudeMsg}</p>}
          </Form.Group>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <div className="w-100">
              <Button
                variant="primary"
                className="w-25 mb-sm-2 mb-lg-0 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
                type="submit"
                disabled={loading}
              >
                {!loading ? (
                  <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
                ) : (
                  <FontAwesomeIcon
                    className="mx-2 fa-spin"
                    icon={faSpinner}
                    size="sm"
                  />
                )}
                <span>{t("Save")}</span>
              </Button>
              <Button
                variant="primary"
                className="w-25 mb-sm-2 mb-lg-0 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
                onClick={() => {
                  setShowAddMarkModal(false);
                  setShowViewMarkModal(true);
                  setValidated(false);
                  myMap.groups.markerGroup.clearLayers();
                  drawer.disable();
                  setLoading(false);
                }}
              >
                <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                <span>{t("Cancel")}</span>
              </Button>
            </div>
          </Col>

          <Col sm={12}>
            <div className="d-flex justify-content-center gap-4 mt-4">
              {IconMarkerOptions?.map((item, key) => (
                <div
                  key={key}
                  style={{ cursor: "pointer", width: "3rem", height: "3rem" }}
                  onClick={() => {
                    let markerGroupLayers =
                      myMap.groups.markerGroup.getLayers();
                    if (markerGroupLayers.length) {
                      myMap.groups.markerGroup.clearLayers();
                      setIconMarker(item.name);
                      drawer.setOptions({
                        icon: L.icon({
                          shadowUrl: null,
                          iconAnchor: new L.Point(12, 12),
                          iconSize: new L.Point(24, 24),
                          iconUrl: item.img,
                        }),
                      });
                      drawer.enable();
                    }
                  }}
                >
                  <img
                    className="img-thumbnail mh-100"
                    src={item.img}
                    alt={item.label}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddModalLandMarks;
