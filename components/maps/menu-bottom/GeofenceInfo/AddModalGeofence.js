import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { CustomInput } from "../../../CustomInput";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

const AddModalGeofence = ({
  showAddFencModal,
  setData_table,
  setShowViewFencModal,
  setShowAddFencModal,
}) => {
  const L = require("leaflet");
  const { myMap } = useSelector((state) => state.mainMap);
  const { darkMode } = useSelector((state) => state.config);

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation("Table");
  const [Name, setName] = useState("");
  const [Speed, setSpeed] = useState("");
  // const [Email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [speedMsg, setSpeedMsg] = useState("");

  let options = useMemo(() => {
    return {
      position: "topleft",
      collapsed: false,

      edit: {
        featureGroup: myMap.groups.drawGroup,
        edit: false,
        remove: false,
      },

      draw: {
        marker: false,
        polyline: false,
        circlemarker: false,

        rectangle: {
          shapeOptions: {
            color: "red",
          },
        },
        circle: {
          shapeOptions: {
            color: "red",
          },
        },
        polygon: {
          // allowIntersection: false,

          shapeOptions: {
            color: "red",
          },
        },
      },
    };
  }, [myMap]);

  let drawControl = new L.Control.Draw(options);

  L.drawLocal?.draw?.toolbar?.buttons.polygon = t("Draw_Polygon");
  L.drawLocal?.draw?.toolbar?.buttons.rectangle = t("Draw_Rectangle");
  L.drawLocal?.draw?.toolbar?.buttons.circle = t("Draw_Circle");
  L.drawLocal?.draw?.handlers?.circle.tooltip.start = t("Draw_Circle_Tooltip");
  L.drawLocal?.draw?.handlers?.polygon.tooltip.start = t("Draw_Polygon_Tooltip");
  L.drawLocal?.draw?.handlers?.rectangle.tooltip.start = t("Draw_Rectangle_Tooltip");
  L.drawLocal?.draw?.toolbar?.actions.text = t("Cancel");
  L.drawLocal?.draw?.toolbar?.actions.title = t("Cancel_Drawing");
  L.drawLocal?.draw?.toolbar?.undo.text = t("Delete_Last_Point");
  L.drawLocal?.draw?.toolbar?.undo.title = t("Delete_Last_Point_Drawn");
  L.drawLocal?.draw?.toolbar?.finish.text = t("Finish");
  L.drawLocal?.draw?.toolbar?.finish.title = t("Finish_Drawing");


  const drawer = new L.Draw.Circle(myMap, drawControl.options.draw.circle);

  const postDrawLayer = async (layer, idx = 0) => {

    try {
      let drawObject = {
        GeofenceRadius: null,
        GeofenceName: Name + (idx ? idx : ""),
        Speed,
        // Email,
      };

      let altPath;

      switch (layer.options.layerType) {
        case "polygon":
          altPath = layer.getLatLngs()[0]?.map((x) => [x.lat, x.lng]);
          let result = "";

          for (let i = 0; i < altPath.length; i++) {
            result += `|${altPath[i][0]}, ${altPath[i][1]}`;
          }
          drawObject = {
            ...drawObject,
            GeoFenceType: 2,
            GeofencePath: result,
            Speed: +Speed,
            GeofenceRadius: null,
            GeofenceBounds: null,
            GeofenceCenterPoint: null,
          };

          break;
        case "circle":
          drawObject = {
            ...drawObject,
            GeoFenceType: 1,
            GeofenceCenterPoint:
              "(" +
              [layer.getLatLng().lat, layer.getLatLng().lng].join(",") +
              ")",
            GeofenceRadius: layer.getRadius(),
            Speed: +Speed,
            GeofenceBounds: null,
            GeofencePath: null,
          };

          altPath = [layer.getLatLng().lat, layer.getLatLng().lng];
          break;

        case "rectangle":
          var bounds = layer._latlngs;

          altPath = [
            [bounds[0][0].lat, bounds[0][0].lng],
            [bounds[0][1].lat, bounds[0][1].lng],
            [bounds[0][2].lat, bounds[0][2].lng],
            [bounds[0][3].lat, bounds[0][3].lng],
          ];
          let boundsResult = "";
          for (let i = 0; i < altPath.length; i++) {
            boundsResult += `(${altPath[i][0]},${altPath[i][1]})|`;
          }
          drawObject = {
            ...drawObject,
            Speed: +Speed,
            GeoFenceType: 3,
            GeofenceBounds: boundsResult.substring(0, boundsResult.length - 1),
            GeofenceRadius: null,
            GeofenceCenterPoint: null,
          };
          break;
      }
      const resp = await axios.post(`geofences`, { ...drawObject });
      if (resp.status === 201) {
        toast.success(t("Geofence_Added_Successfully"));
        return {
          id: L.stamp(layer),
          drawObject: {
            ...drawObject,
            GeofencePath: altPath,
            ID: resp?.data?.geoFence.ID,
          },
        };
      }

    } catch (e) {
      toast.error(`Error: Can Not Add Geofence `);
    }
    return { id: 0 };
  };
  const [speedErrorMsg, setSpeedErrorMsg] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();

    const layers = myMap.groups.drawGroup.getLayers();


    if (Speed <= 300) {

      if (layers.length == 0) {
        toast.error(t(`Please_Draw_Geofence_on_the_map_first`));
        return;
      }

      const form = e.currentTarget;

      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      setLoading(true);

      let promises = [];

      layers.forEach((layer, idx) => {
        const promise = postDrawLayer(layer, idx);
        promises.push(promise);
      });
      (await Promise.all(promises)).forEach((resp) => {
        if (resp.id) {
          myMap.groups.drawGroup.removeLayer(resp.id);
          setData_table((prev) => [...prev, resp?.drawObject]);
          setShowAddFencModal(false);
          setShowViewFencModal(true);
        }
      });
      if (myMap.groups.drawGroup.getLayers().length == 0) {
        setShowAddFencModal(false);
        setShowViewFencModal(true);
        setValidated(false);
      }
      setLoading(false);

    } else {
      toast.error(`Speed Must be less than 300`);
    }
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "Name" && setName(value);
    if (name === "Speed") {
      setSpeed(value)
      if (+value <= 300) {
        setSpeedErrorMsg('')
      } else {
        setSpeedErrorMsg('Speed Must Be Less Than 300')
      }
    }
    // name === "Email" && setEmail(value);

  };
  useEffect(() => {
    myMap.groups.drawGroup.clearLayers();
    drawer.enable();
    if (showAddFencModal) {
      myMap.addControl(drawControl);
      myMap.on(L.Draw.Event.DRAWSTART, (e) => {
        myMap.groups.drawGroup.clearLayers();
        drawer.disable();
      });

      myMap.on(L.Draw.Event.CREATED, function (e) {
        drawer.disable();
        var layer = e.layer;
        layer.options["layerType"] = e.layerType;
        layer.addTo(myMap.groups.drawGroup);
        myMap.groups.drawGroup.addLayer(layer);
      });
    }

    return () => {
      myMap.removeControl(drawControl);
      drawer.disable();
    };
  }, [showAddFencModal]);
  return (
    <div
      className={` p-3 rounded shadow `}
      style={{
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <div className="col-12 col-md-4 ">

            <CustomInput
              ClassN="col-12  mb-3"
              required={true}
              value={Name}
              handleChange={handleChange}
              Name="Name"
              Label={t("Geofence_Name")}
            />
          </div>

          <div className="col-12 col-md-4  positon-relative ">
            <CustomInput
              ClassN="col-12  mb-1"
              required={true}
              value={Speed}
              handleChange={handleChange}
              Name="Speed"
              Label={t("Geofence_Speed")}
              Type="number"

            />
            {speedErrorMsg && <span style={{ color: "red", marginBottom: "5px" }} className="mb-1 d-block"> {speedErrorMsg} </span>}
          </div>


        </Row>
        <Row>
          <Col md={12}>
            <div className="w-50">
              <Button
                variant="primary"
                className="w-25 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
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
                className="w-25 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
                onClick={() => {
                  setShowAddFencModal(false);
                  setShowViewFencModal(true);
                  setValidated(false);
                  myMap.groups.drawGroup.clearLayers();
                  drawer.disable();
                  setLoading(false);
                }}
              >
                <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                <span>{t("Cancel")}</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddModalGeofence;
