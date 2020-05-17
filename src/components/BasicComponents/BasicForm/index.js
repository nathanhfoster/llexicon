import React, { useRef, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"
import { getFormPayload } from "./utils"
import { BasicFormProps } from "./propTypes"

const BasicForm = ({ title, inputs, submitLabel, onSubmit, onChange }) => {
  const formRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!onSubmit) return

    const payload = getFormPayload(e.target.elements)
    onSubmit(payload)
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (!onChange) return

    const payload = getFormPayload(formRef.current.elements)
    onChange(payload)
  }

  const renderInputs = useMemo(
    () =>
      inputs.map((input, i) => {
        const {
          name,
          defaultValue,
          value,
          check,
          label,
          type,
          placeholder,
          required,
          disabled,
          autoFocus,
          error,
          multiline,
          rows,
          className,
        } = input
        const isCheckOrRadio = check || type === "radio"
        const id = `${name}-${i}`
        return (
          <FormGroup check={isCheckOrRadio} key={id} row>
            <Label check={check} for={id}>
              {`${label} ${required ? "*" : ""}`}
            </Label>
            <Input
              defaultValue={defaultValue}
              value={value}
              type={type}
              id={id}
              name={name}
              placeholder={placeholder}
              disabled={disabled}
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
}
export default memo(BasicForm)
