import React from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const CustomInputForm = ({
  ClassN = "col-12 col-md-6 col-lg-4",
  label,
  placeholder,
  type,
  name,
  required,
  min,
  max,
  pattern,
  value,
  errorMsg,
  register,
  errors,
  disabled,
  validate,
  onFocus,
  maxLength,
  customError,
}) => {
  const { darkMode } = useSelector((state) => state.config);
  return (
    <Form.Group className={`${ClassN} mb-3`} controlId={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={`border-primary ${
          type === "date" ? (darkMode ? "date_input_dark" : "date_input") : ""
        }`}
        type={type}
        onFocus={onFocus}
        disabled={disabled}
        placeholder={placeholder}
        {...register(name, {
          required: required,
          min: min,
          max: max,
          pattern: pattern,
          value: value,
          maxLength: maxLength,
          validate:
            validate &&
            ((value) => {
              return !!value?.trim();
            }),
        })}
      />
      {(errors[`${name}`] || customError) && (
        <span style={{ fontSize: "12px" }} className="text-danger mt-2">
          {errorMsg}
        </span>
      )}
    </Form.Group>
  );
};

export default CustomInputForm;
