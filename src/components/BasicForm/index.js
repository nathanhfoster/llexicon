import React, { useRef, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"

const BasicForm = ({ title, inputs, submitLabel, onSubmit, onChange }) => {
  if (onSubmit && onChange) {
    throw "The onSubmit and onChange props are mutually exclusive. Please use only one."
  }
  const formRef = useRef()

  const handleSubmit = e => {
    e.preventDefault()
    let payload = {}

    for (let i = 0, { length } = inputs; i < length; i++) {
      const { id, value, type } = e.target[i]
      if (value) {
        payload[id] = value
      } else if (type === "radio") {
        payload[id] = value
      }
    }

    onSubmit && onSubmit(payload)
    onChange && onChange(payload)
  }

  const handleChange = e => {
    e.preventDefault()
    onChange &&
      formRef.current &&
      formRef.current.dispatchEvent(new Event("submit"))
  }

  const renderInputs = useMemo(
    () =>
      inputs.map(input => {
        const { id, defaultValue, label, type, placeholder, check } = input
        return (
          <FormGroup check={check} key={id}>
            <Label check={check} for={id}>
              {label}
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
      check: PropTypes.bool
    }).isRequired
  ),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  submitLabel: PropTypes.string
}

BasicForm.defaultProps = {
  inputs: [
    {
      label: "Email",
      type: "email",
      id: "email",
      placeholder: "Email..."
    },
    {
      label: "Username",
      type: "text",
      id: "username",
      placeholder: "Username..."
    },
    {
      label: "Password",
      type: "password",
      id: "password",
      placeholder: "Password..."
    }
  ],
  submitLabel: "Submit"
}
export default memo(BasicForm)
