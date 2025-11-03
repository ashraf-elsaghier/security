import React, { useState } from "react";
import {
  faCheck,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function DeleteModal({ data }) {
  const { t } = useTranslation("main");
  const [show, setshow] = useState(false);
  const [loading, setloading] = useState();
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const Dark = darkMode ? "bg-dark" : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setloading(true);
    setTimeout(() => {
      setloading(false);
      setshow(false);
    }, 1000);
  };
  return (
    <>
      <Button className="text-center me-1" onClick={() => setshow(true)}>
        <FontAwesomeIcon className="mx-1" icon={faTrash} size="sm" />
        {t("delete")}
      </Button>

      <Modal show={show} size="md" onHide={() => setshow(false)}>
        <Modal.Header closeButton className={`${Dark}`}>
          <Modal.Title as="h5">Delete: {data}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${Dark}`}>
          <p>Are you sure you want to delete?</p>
        </Modal.Body>
        <Modal.Footer className={`d-flex justify-content-center ${Dark}`}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-2 ms-3"
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
            Yes
          </Button>
          <Button
            className="px-3 py-2 ms-3"
            onClick={(e) => {
              e.preventDefault();
              setshow(false);
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
