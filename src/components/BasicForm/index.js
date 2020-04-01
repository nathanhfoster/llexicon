import React, { useRef, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"
import { getFormPayload } from "./utils"

const BasicForm = ({ title, inputs, submitLabel, onSubmit, onChange }) => {
  const formRef = useRef()

  const handleSubmit = e => {
    e.preventDefault()
    if (!onSubmit) return

    const payload = getFormPayload(e.target.elements)
    onSubmit(payload)
  }

  const handleChange = e => {
    e.preventDefault()
    if (!onChange) return

    const payload = getFormPayload(formRef.current.elements)
    onChange(payload)
  }

  const renderInputs = useMemo(
    () =>
      inputs.map(input => {
        const {
          id,
          defaultValue,
          label,
          type,
          placeholder,
          check,
          required
        } = input
        return (
          <FormGroup check={check} key={id} row>
            <Label check={check} for={id}>
              {`${label} ${required ? "*" : ""}`}
            </Label>
            <Input
              defaultValue={defaultValue}
              type={type}
              id={id}
              placeholder={placeholder}
            />
          </FormGroup>
        )
      }),
    [inputs]
  )

  return (
    <Form
      innerRef={formRef}
      onSubmit={handleSubmit}
      method="post"
      onChange={handleChange}
    >
      {title && <h2 className="Center">{title}</h2>}
      {renderInputs}
      {onSubmit && (
        <div className="Center">
          <Button color="accent" type="submit">
            {submitLabel}
          </Button>
        </div>
      )}
    </Form>
  )
}

BasicForm.propTypes = {
  title: PropTypes.string,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      defaultValue: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      check: PropTypes.bool,
      required: PropTypes.bool
    }).isRequired
  ),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  submitLabel: PropTypes.string
}

BasicForm.defaultProps = {
  inputs: [
    {
      label: "Username",
      type: "text",
      id: "username",
      placeholder: "Username...",
      required: true
    },
    {
      label: "Email",
      type: "email",
      id: "email",
      placeholder: "Email...",
      required: true
    },
    {
      label: "Password",
      type: "password",
      id: "password",
      placeholder: "Password...",
      required: true
    }
  ],
  submitLabel: "Submit"
}
export default memo(BasicForm)
