import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
function ReactSelect({
  className,
  onSelectChange,
  options,
  isSearchable,
  placeholder,
  defaultValue,
  ariaLabel,
  label,
  error,
  errorMsg,
  isMulti,
  isDisabled,
  formatOptionLabel,
  menuPlacement,
  cuStyles,
  value,
}) {
  const [selectedInput, setSelectedInput] = useState(defaultValue);
  const { darkMode } = useSelector((state) => state.config);

  useEffect(() => {
    onSelectChange(isMulti ? selectedInput : selectedInput?.value);
  }, [selectedInput?.value, selectedInput, isMulti]);

  const light = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : undefined;
  };
  const dark = (isSelected, isFocused) => {
    return isSelected ? "#0E6395" : isFocused ? "#259CDF" : "#151824";
  };

  // style
  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        ...cuStyles,
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
              ? "#259CDF"
              : "#0E6395"
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
      return { ...styles, color: darkMode ? "#fff" : "#151824" };
    },
  };

  return (
    <Form.Group className={`${className} border-primary`} controlId={label}>
      {label && <Form.Label>{label}</Form.Label>}
      <Select
        aria-labelledby={ariaLabel}
        defaultValue={selectedInput}
        onChange={setSelectedInput}
        value={value}
        placeholder={placeholder}
        inputId="select-client"
        isSearchable={isSearchable}
        options={options}
        isMulti={isMulti}
        isDisabled={isDisabled}
        styles={colorStyles}
        formatOptionLabel={formatOptionLabel}
        menuPlacement={menuPlacement || "bottom"}
      />
      {error && (
        <span style={{ fontSize: "12px" }} className="text-danger mt-2">
          {errorMsg}
        </span>
      )}
    </Form.Group>
  );
}

export default ReactSelect;
