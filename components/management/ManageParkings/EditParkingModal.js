import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateParking } from "services/management/ManageParkings";

export default function EditParkingModal(props) {
  const { selectedParking, getParkings, setSelectedParking } = props;
  const darkMode = useSelector((state) => state.config.darkMode);
  const Dark = darkMode ? "bg-dark" : "";
  const { t } = useTranslation(["Management", "Tour"]);
  const [loading, setLoading] = useState(false);

  const EditGroup = async (value) => {
    setLoading(true);
    try {
      const response = await updateParking(
        selectedParking.parkingGroupID,
        value
      );
      setSelectedParking({
        ...selectedParking,
        parkingGroupName: value.groupName,
        maxAllowedDays: value.maxDays,
      });
      getParkings();
      setLoading(false);
      toast.success(t("Parking is updated successfully"));
      props.onHide();
    } catch (e) {
      setLoading(false);
      toast.error(e.response?.data.message || "something went wrong!");
    }
  };

  return (
    <Modal
      size="md"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      className="justify-content-center align-items-center d-flex"
    >
      <Modal.Header
        closeButton
        className={`${Dark}  d-flex justify-content-between align-items-center`}
      >
        <h5 className="text-center mt-3 mb-0 w-100"> {t("Edit Parking")}</h5>
      </Modal.Header>

      <Modal.Body closeButton className={`${Dark} `}>
        <Formik
          initialValues={{
            groupName: selectedParking?.parkingGroupName || "",
            maxDays: selectedParking?.maxAllowedDays || "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.groupName) {
              errors.groupName = t("Parking Name is Required");
            }
            if (!values.maxDays) {
              errors.maxDays = t(
                "Parking Max Days is Required and has range from 1 to 365"
              );
            }
            return errors;
          }}
          onSubmit={(values) => {
            EditGroup(values);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="p-3 mb-3">
                <Col lg="12">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="groupName">
                      {t("Parking Name")}
                    </Form.Label>
                    <Form.Control
                      name="groupName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.groupName}
                      type="text"
                      required
                      id="groupName"
                    />
                    <p className="my-3 text-danger">
                      {errors.groupName &&
                        touched.groupName &&
                        errors.groupName}
                    </p>
                  </Form.Group>
                </Col>
                <Form.Group className="form-group">
                  <Form.Label htmlFor="maxDays">{t("Max Days")}</Form.Label>
                  <Form.Control
                    name="maxDays"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.maxDays}
                    type="number"
                    required
                    min={1}
                    max={365}
                  />
                  <p className=" text-danger">
                    {errors.maxDays && touched.maxDays && errors.maxDays}
                  </p>
                </Form.Group>
                <Modal.Footer>
                  <div className="w-100">
                    <button
                      disabled={loading}
                      className="btn btn-primary px-3 py-2 w-100"
                      type="submit"
                    >
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faCheck}
                        size="sm"
                      />
                      {loading ? t("loading...") : t("update")}
                    </button>
                  </div>
                </Modal.Footer>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
