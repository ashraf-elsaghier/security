import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/UI/Spinner";

export default function DeleteModal({
  show,
  title = "Users List",
  onCancel,
  users,
  loadingUsers,
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
        {!users.length && loadingUsers ? (
          <Spinner />
        ) : !users.length && !loadingUsers ? (
          <p className="text-center font-bold">Your Users might not exist</p>
        ) : (
          <ul className="list-unstyled">
            {users.map((user) => {
              return (
                <li key={user.ProfileID} className="fs-5 fw-bolder mb-2 ">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  {user.FullName}
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
