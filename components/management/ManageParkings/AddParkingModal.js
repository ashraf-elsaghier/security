import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addParking } from "services/management/ManageParkings";

const AddParkingModal = React.memo((props) => {
  const darkMode = useSelector((state) => state.config.darkMode);
  const Dark = darkMode ? "bg-dark" : "";
  const { t } = useTranslation(["Management", "Tour"]);
  const [loading, setLoading] = useState(false);

  const SubmitParking = async (values) => {
    setLoading(true);
    try {
      const response = await addParking(values);
      setLoading(false);
      toast.success(t("Parking is added successfully"));
      props.onHide();
      props.getParkings();
    } catch (e) {
      setLoading(false);
      toast.error(e.response?.data.message || "something went wrong!");
    }
  };
  return (
    <Modal {...props} size="md" centered>
      <Modal.Header
        closeButton
        className={`${Dark}  d-flex justify-content-between align-items-center`}
      >
        <h5 className="text-center mt-3 mb-0 w-100">
          {t("Adding new Parking")}
        </h5>
      </Modal.Header>
      <Modal.Body className={`${Dark} px-3 `}>
        <Formik
          initialValues={{ groupName: "", maxDays: null }}
          validate={(values) => {
            const errors = {};
            if (!values.groupName) {
              errors.groupName = "Parking Name is Required";
            }
            if (!values.maxDays) {
              errors.maxDays =
                "Parking Max Days is Required and has range from 1 to 365";
            }
            return errors;
          }}
          onSubmit={(values) => {
            SubmitParking(values);
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
              <Row className="p-3">
                <Col lg="12">
                  <Form.Group>
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
                      placeholder="Enter parking name."
                    />
                    <p className="my-3 text-danger">
                      {errors.groupName &&
                        touched.groupName &&
                        errors.groupName}
                    </p>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="maxDays">
                      {t("Number of Days")}
                    </Form.Label>
                    <Form.Control
                      name="maxDays"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.maxDays}
                      type="number"
                      required
                      min={1}
                      max={365}
                      placeholder="Enter number of days."
                    />
                    <p className="my-3 text-danger">
                      {errors.maxDays && touched.maxDays && errors.maxDays}
                    </p>
                  </Form.Group>
                </Col>
                <Modal.Footer>
                  <div className="mt-3 w-100">
                    <button
                      className="btn btn-primary py-2 w-100"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? t("loading..") : `${t("Add_Parking")}`}
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
});
export default AddParkingModal;
