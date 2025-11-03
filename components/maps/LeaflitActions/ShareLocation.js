import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Col, Form, Modal, Row } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function EditInfo({ show, setShow }) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");

  const [loading, setloading] = useState(false);
  const [Data, setData] = useState({
    Email: "",
    ExpiresInMinuts: "",
  });

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  const handleRq = async (e) => {
    e.preventDefault();
    e.persist();
    setloading(true);
    const id = document
      .getElementById("ShareLocationBtn")
      .getAttribute("data-id");
    try {
      const getLocation = await axios.get(
        `vehicles/public/track?vehicleid=${id}&expiresIn=${!Data.ExpiresInMinuts ? 5 : Data.ExpiresInMinuts
        }`
      );
      if (getLocation.status === 200) {
        const emailInfo = {
          firstname: "",
          lastname: "",
          from: "info@saferoad.com.sa",
          to: Data.Email,
          cc: "",
          bcc: "",
          html: `<h1>${getLocation?.data?.url}</h1>`,
        };

        const sendEmail = await axios.post("general/mail", emailInfo);
        if (sendEmail.status === 200) {
          toast.success("Location is sent successfully");
        }
      }
    } catch (err) {
      toast.error("Location did not sends");
    } finally {
      setloading(false);
      setShow(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={`${Dark}`}>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("share_location_key")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Body className={`${Dark}`}>
          <Row className="p-3 mb-3">
            <Col lg="12">
              <Form.Group className="form-group">
                <Form.Label htmlFor="Email">{t("email_key")}</Form.Label>
                <Form.Control
                  name="Email"
                  type="email"
                  id="Email"
                  placeholder="john@smith.com"
                  value={Data.Email}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      Email: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="12">
              <Form.Group className="form-group">
                <Form.Label htmlFor="ExpiresInMinuts">
                  {t("expires_in_minuts_key")}
                </Form.Label>
                <Form.Control
                  name="ExpiresInMinuts"
                  type="tel"
                  id="ExpiresInMinuts"
                  placeholder={t("expires_in_minuts_key")}
                  value={Data.ExpiresInMinuts}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      ExpiresInMinuts: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className={`${Dark}`}>
          <div className="d-flex justify-content-around">
            <button
              disabled={loading}
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
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
              {t("share_key")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel_key")}
            </button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
