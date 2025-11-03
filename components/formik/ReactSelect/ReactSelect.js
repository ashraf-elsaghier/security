import React from "react";
import { Field, ErrorMessage } from "formik";
import SelectField from "./SelectField";
import TextError from "../TextError";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";

const ReactSelect = ({
  label,
  name,
  className,
  options,
  isObject = false,
  ...rest
}) => {
  const { darkMode } = useSelector((state) => state.config);

  const light = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : undefined;
  };
  const dark = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : "#151824";
  };

  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: darkMode
          ? "#222738"
          : isDisabled
          ? "#e9ecef"
          : "#FFFFFF",
        borderColor: "#0E6395",
        boxShadow: "none",
        "&:hover": {
          ...styles["&:hover"],
          borderColor: "#0E6395",
        },
        ...(isDisabled
          ? {
              pointerEvents: "auto",
              cursor: "not-allowed",
            }
          : {
              pointerEvents: "auto",
              cursor: "pointer",
            }),
      };
    },
    option: (styles, { isDisabled, isSelected, isFocused }) => {
      return {
        ...styles,
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor: darkMode
          ? dark(isSelected, isFocused)
          : light(isSelected, isFocused),
        color: isSelected ? "#fff" : isFocused ? "#fff" : "inhert",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#0E6395"
              : "#259CDF"
            : undefined,
        },
      };
    },
    singleValue: (styles) => {
      return { ...styles, color: darkMode ? "#fff" : "inhert" };
    },
    menu: (styles) => {
      return { ...styles, backgroundColor: darkMode ? "#151824" : "#fff" };
    },
    input: (styles) => {
      return {
        ...styles,
        color: darkMode ? "#fff" : "#151824",
      };
    },
  };

  return (
    <Form.Group className={`${className}`} controlId={label}>
      <Form.Label>{label}</Form.Label>
      <Field
        component={SelectField}
        options={options}
        id={name}
        name={name}
        isObject={isObject}
        {...rest}
        styles={colorStyles}
      />
      <ErrorMessage name={name} component={TextError} />
    </Form.Group>
  );
};

export default ReactSelect;
