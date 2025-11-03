import React, { Fragment } from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

function Input({ label, name, type, className, ...rest }) {
  const { darkMode } = useSelector((state) => state.config);
  return (
    <Fragment>
      <Field name={name}>
        {({ field }) => {
          return (
            <Form.Group className={`${className}`} controlId={label}>
              {""}
              <Form.Label>{label}</Form.Label>
              <Form.Control
                autoComplete="off"
                step="any"
                className={`border-primary ${
                  type === "date"
                    ? darkMode
                      ? "date_input_dark"
                      : "date_input"
                    : ""
                }`}
                type={type}
                {...rest}
                {...field}
              />
              <ErrorMessage component={TextError} name={name} />
            </Form.Group>
          );
        }}
      </Field>
    </Fragment>
  );
}

export default Input;
