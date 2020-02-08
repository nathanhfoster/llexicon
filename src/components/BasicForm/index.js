import React, { memo } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"
import "./styles.css"

const BasicForm = ({ title, inputs, submitLabel, onSubmit }) => {
  const handleSubmit = e => {
    e.preventDefault()
    let payload = {}

    for (let i = 0, { length } = inputs; i < length; i++) {
      const { id, value, type, checked } = e.target[i]
      if (value) {
        payload[id] = value
      } else if (type === "radio") {
        // console.log("RADIO: ", checked)
        payload[id] = checked
      }
    }

    onSubmit(payload)
  }

  const renderInputs = inputs =>
    inputs.map(input => {
      const { id, defaultValue, label, type, name, placeholder, check } = input
      return (
        <FormGroup check={check} key={id}>
          <Label check={check} for={id}>
            {label}
          </Label>
          <Input
            defaultValue={defaultValue}
            type={type}
            name={name || id}
            id={id}
            placeholder={placeholder}
          />
        </FormGroup>
      )
    })

  return (
    <Form onSubmit={handleSubmit} method="post">
      {title && <h2 className="Center">{title}</h2>}
      {renderInputs(inputs)}
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
      type: PropTypes.string,
      name: PropTypes.string,
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
      name: "email",
      id: "email",
      placeholder: "Email..."
    },
    {
      label: "Username",
      type: "text",
      name: "username",
      id: "username",
      placeholder: "Username..."
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      id: "password",
      placeholder: "Password..."
    }
  ],
  submitLabel: "Submit"
}
export default memo(BasicForm)
