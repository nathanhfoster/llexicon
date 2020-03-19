import React, { useState, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"

const getInitialState = inputs => {
  let state = {}
  for (let i = 0, { length } = inputs; i < length; i++) {
    const { id } = inputs[i]
    state[id] = null
  }
  return state
}

const BasicForm = ({ title, inputs, submitLabel, onSubmit }) => {
  const [state, setState] = useState(getInitialState(inputs))

  const handleSubmit = e => {
    e.preventDefault()
    let payload = {}

    for (let i = 0, { length } = inputs; i < length; i++) {
      const { id, type } = e.target[i]
      const value = state[id]
      if (value) {
        payload[id] = value
      } else if (type === "radio") {
        payload[id] = value
      }
    }

    onSubmit(payload)
  }

  const handleChange = ({ target: { id, value } }) =>
    setState(prevState => ({ ...prevState, [id]: value }))

  const renderInputs = useMemo(
    () =>
      inputs.map(input => {
        const { id, defaultValue, label, type, placeholder, check } = input
        const value = state[id]
        return (
          <FormGroup check={check} key={id}>
            <Label check={check} for={id}>
              {label}
            </Label>
            <Input
              id={id}
              defaultValue={defaultValue}
              onChange={handleChange}
              value={value}
              type={type}
              placeholder={placeholder}
            />
          </FormGroup>
        )
      }),
    [inputs]
  )

  return (
    <Form onSubmit={handleSubmit} method="post">
      {title && <h2 className="Center">{title}</h2>}
      {renderInputs}
      <div className="Center">
        <Button color="accent" type="submit">
          {submitLabel}
        </Button>
      </div>
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
      type: PropTypes.oneOf(["email", "text", "password", "check"]),
      placeholder: PropTypes.string,
      check: PropTypes.bool
    }).isRequired
  ),
  onSubmit: PropTypes.func,
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
