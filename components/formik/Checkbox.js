import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { Form } from "react-bootstrap";

function Checkbox(props) {
  const { label, name, className, option, ...rest } = props;
  return (
    <div className={`${className}`}>
      {label && <label className="mb-1">{label}</label>}
      <Field name={name}>
        {({ field }) => {
          return option.map((option) => {
            return (
              <Form.Check
                key={option.value}
                type="checkbox"
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

export default Checkbox;
