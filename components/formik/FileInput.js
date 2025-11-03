import React, { Fragment } from "react";
import TextError from "./TextError";
import { Form } from "react-bootstrap";

function Input({ id, label, name, className, errorMsg, onChange, ...rest }) {
  return (
    <Fragment>
      <Form.Group className={`${className}`} controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          className="border-primary"
          type="file"
          name={name}
          onChange={onChange}
          {...rest}
        />
        <TextError>{errorMsg}</TextError>
      </Form.Group>
    </Fragment>
  );
}

export default Input;
