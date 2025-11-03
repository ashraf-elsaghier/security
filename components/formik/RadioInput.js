import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { Form } from "react-bootstrap";

function RadioInput(props) {
  const { label, name, options, className, ...rest } = props;
  return (
    <div className={`${className}`}>
      <label className="mb-1">{label}</label>
      <Field name={name}>
        {({ field }) => {
          return options.map((option) => {
            return (
              <Form.Check
                key={option.value}
                type="radio"
                id={option.value}
                {...field}
                {...rest}
                label={option.key}
                value={option.value}
                checked={field.value.includes(option.value)}
              />
            );
          });
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default RadioInput;
