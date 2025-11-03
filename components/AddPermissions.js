import { Col, Form, Row } from "react-bootstrap";

const AddPermissions = ({
  formCheckStyle,
  title,
  FormGroupBxStyle,
  titleBx,
  textName,
  valName,
  textUser,
  UserVal,
  textEmail,
  FormGroupInputStyle,
  valEmail,
  textStatus,
  valStatus,
}) => {
  return (
    <div className={`${formCheckStyle} w-100`}>
      <h2
        className={`fs-2 bg-primary w-100 p-2 text-center text-white fst-italic`}
      >
        {title}
      </h2>
      <fieldset
        className={`${FormGroupBxStyle} border border-dark rounded mt-3`}
      >
        <legend className="text-center mt-3">{titleBx}</legend>
        <Form.Group
          as={Row}
          className={`mb-3 mt-3 p-5 pt-4`}
          controlId="FormGroup"
        >
          <Form.Label column sm="2">
            {textName}
          </Form.Label>
          <Col sm="4">
            <Form.Control
              className={`${FormGroupInputStyle} mb-5`}
              type="text"
              disabled
              value={valName}
            />
          </Col>

          <Form.Label column sm="2">
            {textUser}
          </Form.Label>
          <Col sm="4">
            <Form.Control
              className={`${FormGroupInputStyle} mb-5`}
              type="text"
              disabled
              value={UserVal}
            />
          </Col>

          <Form.Label column sm="2">
            {textEmail}
          </Form.Label>
          <Col sm="4">
            <Form.Control
              className={`${FormGroupInputStyle}`}
              type="email"
              disabled
              value={valEmail}
            />
          </Col>

          <Form.Label column sm="2">
            {textStatus}
          </Form.Label>
          <Col sm="4">
            <Form.Control
              className={`${FormGroupInputStyle}`}
              type="text"
              disabled
              value={valStatus}
            />
          </Col>
        </Form.Group>
      </fieldset>
    </div>
  );
};

export default AddPermissions;
