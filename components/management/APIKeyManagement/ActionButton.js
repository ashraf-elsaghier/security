import { Button } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";

const ActionButton = ({
  loadingStatus,
  buttonType,
  handleAction,
  icon,
  text = "",
  classes,
  styles,
  disabled,
}) => {
  return (
    <Button
      className={`${classes} ms-2 p-1`}
      onClick={handleAction}
      disabled={disabled}
      style={styles}
    >
      {loadingStatus == buttonType ? (
        <FaSpinner />
      ) : (
        <>
          {icon} {text}
        </>
      )}
    </Button>
  );
};

export default ActionButton;
