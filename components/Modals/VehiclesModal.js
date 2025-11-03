import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Spinner from "../../components/UI/Spinner";

export default function DeleteModal({
  show,
  title = "Vehicles List",
  onCancel,
  vehicles,
}) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const Dark = darkMode ? "bg-dark" : "";

  return (
    <Modal
      show={show}
      size="md"
      onHide={onCancel}
      className="border-0"
      centered
    >
      <Modal.Header closeButton className={`${Dark} text-secondary`}>
        <Modal.Title className="" as="h4">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={`${Dark}  border-0 d-flex 
			 flex-column gap-3 `}
        style={{ height: "450px", overflowY: "scroll" }}
      >
        {vehicles?.length === 0 ? (
          <h4 class="modal-title d-flex justify-content-center   ">There is no vehicle to show </h4>
        ) : (
          <ul className="list-unstyled">
            {vehicles?.map((vehicle) => {
              return (
                <li key={vehicle?.VehicleID} className="fs-5 fw-bolder mb-2 ">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  {vehicle?.DisplayName}
                </li>
              );
            })}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer className={`d-flex justify-content-center ${Dark}`}>
        <Button
          variant="primary"
          className={`px-4 py-2 ms-3 ${darkMode ? "text-white" : ""}`}
          onClick={onCancel}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
