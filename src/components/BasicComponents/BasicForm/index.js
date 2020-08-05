import React, { useRef, useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { Button, Form } from "reactstrap"
import { getFormPayload } from "./utils"
import { BasicFormProps } from "./propTypes"
import BasicInput from "../BasicInput"

const BasicForm = ({
  title,
  inputs,
  submitLabel,
  method,
  onSubmit,
  onChange,
}) => {
  const mounted = useRef(false)
  const [state, setState] = useState(inputs)

  useEffect(() => {
    if (mounted.current) {
      setState(inputs)
    }
    mounted.current = true
  }, [inputs])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!onSubmit) return

    const payload = getFormPayload(state)

    onSubmit(payload)
  }

  const handleChange = ({
    target: { id, name, value, type, checked, files },
  }) => {
    const newState = [...state].map((input) => {
      if (input.name === name) {
        if (type === "radio" || type === "checkbox") {
          return { ...input, checked }
        } else if (type === "file") {
          return { ...input, files }
        } else {
          return { ...input, value }
        }
      } else {
        return input
      }
    })

    setState(newState)

    if (!onChange) return

    const payload = getFormPayload(newState)

    onChange(payload)
  }

  const renderInputs = state.map((input, i) => (
    <BasicInput key={`${input.name}-${i}`} {...input} />
  ))

  return (
    <Form onSubmit={handleSubmit} method={method} onChange={handleChange}>
      {typeof title === "object" ? title : <h2 className="Center">{title}</h2>}
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

BasicForm.propTypes = BasicFormProps

BasicForm.defaultProps = {
  inputs: [
    {
      label: "Username",
      type: "text",
      name: "username",
      placeholder: "Username...",
      required: true,
      disabled: false,
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Email...",
      required: true,
      disabled: false,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Password...",
      required: true,
      disabled: false,
    },
  ],
  submitLabel: "Submit",
  method: "post",
}
export default memo(BasicForm)
