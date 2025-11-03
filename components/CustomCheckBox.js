import { Form } from "react-bootstrap";

export function CustomCheckBox({
	ClassN = "col-6 col-md-3 col-lg-2",
	Name,
	Type = "checkbox",
	Label,
	value,
	handleChange,
	disabled = false,
	required = true, }) {

	return (
		<>
			<Form.Group className={`${ClassN} mb-3 d-flex align-items-center`} controlId={Label}>
				<Form.Check
					type={Type}
					name={Name}
					id={`${Label}`}
					label={`${Label}`}
					disabled={disabled}
					required={required}
					checked={value}
					onChange={handleChange}
				/>
				<Form.Control.Feedback type="invalid">{Label} is required</Form.Control.Feedback>
			</Form.Group>
		</>
	)
}
