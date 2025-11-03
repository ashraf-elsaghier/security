import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { CustomInput } from "../../../CustomInput";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const EditModalGeofence = ({
  ID,
  setData_table,
  Data_table,
  showEditFencModal,
  setShowEditFencModal,
  setShowViewFencModal,
}) => {
  const { t } = useTranslation("Table");
  const [EditModalData, setEditModalData] = useState({
    GeofenceName: "",
    Speed: "",
    // Email: "",
  });
  const L = require("leaflet");
  const { myMap } = useSelector((state) => state.mainMap);

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speedMsg, setSpeedMsg] = useState("");
  const { darkMode } = useSelector((state) => state.config);

  let getGeoData = async () => {
    try {
      const singleGeo = await axios(`/geofences/filter/${ID}`);
      const res = singleGeo.data.geofence;
      setEditModalData(res);
      return res;
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(async () => {
    if (showEditFencModal) {
      let Data_tableFiltered = await getGeoData();
      switch (Data_tableFiltered.GeoFenceType) {
        case 1:
          L.circle(
            [
              Data_tableFiltered.GeofenceCenterPoint.lat,
              Data_tableFiltered.GeofenceCenterPoint.lng,
            ],
            {
              color: "red",
              radius: +Data_tableFiltered.GeofenceRadius,
            }
          ).addTo(myMap.groups.drawGroup);
          break;
        case 2:
          L.polygon(Data_tableFiltered?.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;
        case 3:
          const GeofenceBounds = Data_tableFiltered.GeofenceBounds.map(
            ({ lat, lng }) => [lat, lng]
          );
          const GeoBounds = GeofenceBounds;
          // if (!GeofenceBounds.length < 4) {
          //   return toast.warning(
          //     "There is Something wrong with this geofence Please remove it."
          //   );
          // }

          L.rectangle(GeoBounds, {
            color: "red",
          }).addTo(myMap.groups.drawGroup);
          break;
      }
    }
  }, [ID, showEditFencModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);

    try {
      await axios.put(`geofences/${ID}`, { ...EditModalData });
      Data_table?.map((item) => {
        if (item.ID === ID) {
          item.GeofenceName = EditModalData.GeofenceName;
          item.Speed = EditModalData.Speed;
        }
      });
      setData_table([...Data_table]);
      myMap.groups.drawGroup.clearLayers();
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }

    if (myMap.groups.drawGroup.getLayers().length == 0) {
      setTimeout(() => {
        toast.success("Geofence Updated Successfully.");
        setValidated(false);
        setShowEditFencModal(false);
        setShowViewFencModal(true);
        setLoading(false);
      }, 500);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Speed") {
      if (+value <= 300) {
        setSpeedMsg("");
      } else {
        setSpeedMsg("Speed Must Be Less Than 300");
        return;
      }
    }

    setEditModalData({
      ...EditModalData,
      [name]: value,
    });
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleSpeedOnKeyPress = (e) => {
    if (checkIfNumber(e)) {
      e.preventDefault();

      setSpeedMsg("Please_Enter_Number_Only!");
    } else {
      setSpeedMsg("");
    }
  };

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
            required={true}
            value={EditModalData.GeofenceName}
            handleChange={handleChange}
            Name="GeofenceName"
            Label={t("Geofence_Name")}
          />

          <div className="col-12 col-md-4  positon-relative ">
            <CustomInput
              ClassN="col-12"
              required={true}
              value={EditModalData.Speed}
              handleChange={handleChange}
              Name="Speed"
              Label={t("Geofence_Speed")}
              Type="number"
            />
            {speedMsg && (
              <span
                style={{ color: "red", marginTop: "-10px" }}
                className=" d-block"
              >
                {speedMsg}
              </span>
            )}
          </div>
        </Row>
        <div className="w-50">
          <Button
            className="me-2 px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading || speedMsg}
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
            className="px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
            type="button"
            onClick={() => {
              setShowEditFencModal(false);
              setShowViewFencModal(true);
              setValidated(false);
              setLoading(false);

              myMap.groups.drawGroup.clearLayers();
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditModalGeofence;
