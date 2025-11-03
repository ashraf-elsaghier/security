import { Form } from "react-bootstrap";

export function CustomInput({
  ClassN = "col-12 col-md-6 col-lg-4",
  Type = "text",
  Name,
  Label,
  Placeholder,
  value,
  handleChange,
  disabled = false,
  required = true,
  isInvalid,
  min,
  max,
  feedBack,
  onKeyDown,
}) {
  return (
    <Form.Group className={`${ClassN} mb-3`} controlId={Label}>
      <Form.Label>{Label}</Form.Label>
      <Form.Control
        className="border-primary"
        name={Name}
        value={value}
        onChange={handleChange}
        type={Type}
        placeholder={Placeholder ?? Label}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        isInvalid={isInvalid}
        onKeyDown={onKeyDown}
      />
      <Form.Control.Feedback type="invalid">
        {feedBack ? feedBack : `${Label} is required`}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
