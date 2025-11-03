import { Form } from "react-bootstrap";

export default function CustomSelectBox({
  name,
  Label,
  value = "",
  handleChange,
  Options,
}) {
  return (
    <div className={`mb-3`}>
      <Form.Label>{Label}</Form.Label>
      <Form.Select
        className="border-primary fw-bold"
        name={name}
        value={value}
        aria-label="Default select example"
        onChange={handleChange}
      >
        <option value="" disabled selected>
          Select User Rule
        </option>
        {Options?.map((ele) => {
          return (
            <option key={ele.name} className="" value={ele.value}>
              {ele.label}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
}
