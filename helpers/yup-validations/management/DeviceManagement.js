import * as Yup from "yup";

const numberValidation = (inputName) => {
  return Yup.number()
    .required(`${inputName} is required`)
    .typeError(`${inputName} must be a number`);
};

const stringValidation = (inputName) => {
  return Yup.string().required(`${inputName} is required`).trim();
};

export const AddDeviceValidation = Yup.object().shape({
  SerialNumber: stringValidation("Serial Number"),
});

export const AddSimValidation = Yup.object().shape({
  simSerialNumber: stringValidation("Serial Number"),
  phoneNumber: stringValidation('Phone Number')
});