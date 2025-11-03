import { useMemo, useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const AddModalWarnings = ({ showAddWarningModal, setShowAddWarningModal }) => {

  const { t } = useTranslation('common')

  const dataFormRadio = useMemo(
    () => [
      {
        id: "1",
        name: "Geofence in",
        checked: false,
      },
      {
        id: "2",
        name: "Geofence out",
        checked: false,
      },
      {
        id: "3",
        name: "powerCutOff",
        checked: false,
      },
      {
        id: "4",
        name: "overSpeed",
        checked: false,
      },
      {
        id: "5",
        name: "lowPower",
        checked: false,
      },
      {
        id: "6",
        name: "harshBrake",
        checked: false,
      },
      {
        id: "7",
        name: "rapidAcceleration",
        checked: false,
      },
      {
        id: "8",
        name: "Preventive Maintenance",
        checked: false,
      },
    ],
    []
  );
  const { locale } = useRouter()
  const { darkMode } = useSelector((state) => state.config);

  const [warningConfig, setWarningConfig] = useState([
    ...dataFormRadio,
    { email: "" },
  ]);
  const [selectedWarning, setSelectedWarning] = useState([]);
  const [loading, setLoading] = useState(true);
  const userLastWarningConfig =
    window != undefined && localStorage.getItem("warningConfig") !== "undefined" ? JSON.parse(localStorage.getItem("warningConfig")) : {};

  useEffect(async () => {
    warningConfig.map((el) => {
      if (userLastWarningConfig) {
        el.checked = userLastWarningConfig[el.name];
      }
    });

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  const handleChange = (e) => {
    const { id, checked } = e.target;
    let elementIndex = warningConfig?.find((el) => +el.id === +id);

    setSelectedWarning({
      ...userLastWarningConfig,
      ...selectedWarning,
      [id]: checked,
    });

    setWarningConfig(
      warningConfig.map((el) => {
        if (el.name === +id) {
          el.checked = !el.checked;
          return el;
        } else {
          return el;
        }
      })
    );
  };
  const handleClose = () => setShowAddWarningModal(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const initialValues = {
      "Geofence in": userLastWarningConfig?.["Geofence in"] || false,
      "Geofence out": userLastWarningConfig?.["Geofence out"] || false,
      powerCutOff: userLastWarningConfig?.["powerCutOff"] || false,
      overSpeed: userLastWarningConfig?.["overSpeed"] || false,
      lowPower: userLastWarningConfig?.["lowPower"] || false,
      harshBrake: userLastWarningConfig?.["harshBrake"] || false,
      rapidAcceleration: userLastWarningConfig?.["rapidAcceleration"] || false,
      "Preventive Maintenance":
        userLastWarningConfig?.["Preventive Maintenance"] || false,
      email: userLastWarningConfig?.email || "",
    };
    setShowAddWarningModal(false);

    const response = await axios({
      method: "post",
      url: `/config`,
      data: JSON.stringify({
        warningsModal: { ...initialValues, ...selectedWarning },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.config.warningsModal) {
      localStorage.setItem(
        "warningConfig",
        JSON.stringify(response.data.config.warningsModal)
      );
    }
  };

  return (
    <Modal centered show={showAddWarningModal} onHide={handleClose}>
      <Modal.Header
        style={{ background: darkMode ? "#222738" : "#fff" }}
        closeButton
      >
        <Modal.Title> {t('Add Modal Warnings')} </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: darkMode ? "#151824" : "#fff" }}>
        <Row>
          <Form onSubmit={handleSubmit}>
            <Col className=" d-flex flex-column gap-3 justify-content-center px-5">
              <Row  >
                {loading && (
                  <div className="text-center my-5">
                    <span
                      className="spinner-border spinner-border-lg"
                      role="status"
                    />
                  </div>
                )}
                {!loading &&
                  warningConfig
                    .slice(0, 8)
                    ?.map(({ id, name, checked }, key) => (
                      <Form.Check
                        className={`flex-row-reverse px-0 d-flex justify-content-between`}
                        type="switch"
                        id={name}
                        label={t(name)}
                        // checked={checked}
                        defaultChecked={checked}
                        key={key}
                        onChange={(e) => handleChange(e)}
                      />
                    ))}
                <Form.Label className={`mt-2 px-0  ${locale === "ar" ? "text-start" : ""}  `}> {t('Email Address')} </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="border border-primary"
                  placeholder="name@example.com"
                  defaultValue={userLastWarningConfig?.email || ""}
                  onChange={(e) =>
                    setSelectedWarning({
                      ...selectedWarning,
                      email: e.target.value,
                    })
                  }
                />
              </Row>
              <Row className={`${locale === "ar" ? 'flex-row-reverse' : ""} gap-4 d-flex justify-content-center`}>
                <Button
                  className="col-4"
                  size="lg"
                  variant="secondary"
                  onClick={handleClose}
                >           {t('Close')}

                </Button>
                <Button
                  className="col-4"
                  size="lg"
                  variant="primary"
                  type="submit"
                >
                  {t('Save')}
                </Button>
              </Row>
            </Col>
          </Form>
        </Row>
      </Modal.Body>
    </Modal >
  );
};
export default AddModalWarnings;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [

        "common",
      ])),
    },
  };
}
