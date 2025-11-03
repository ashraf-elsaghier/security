import * as Yup from "yup";

const numberValidation = (inputName) => {
  return Yup.number()
    .required(`${inputName} is required`)
    .typeError(`${inputName} must be a number`);
};

const stringValidation = (inputName) => {
  return Yup.string().required(`${inputName} is required`).trim();
};

export const AddSimValidation = Yup.object().shape({
  SimSerialNumber: stringValidation("Serial Number"),
  PhoneNumber: numberValidation("Phone Number").min(
    0,
    "Phone Number must be greater than 0"
  ),
});
