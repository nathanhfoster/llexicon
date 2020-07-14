import React, { useState, memo } from "react"
import { inputProps } from "./propTypes"
import { FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap"

const getInitialState = ({ value }) => {
  return value || ""
}

const BasicInput = ({
  name,
  defaultValue,
  check,
  label,
  type,
  placeholder,
  required,
  disabled,
  autoFocus,
  //   valid,
  isValid,
  //   invalid,
  isInvalid,
  helpText,
  multiline,
  row,
  className,
  ...restOfProps
}) => {
  const [value, setValue] = useState(getInitialState(restOfProps))
  const isCheckOrRadio = check || type === "radio"

  const handleChange = ({ target: { value } }) => setValue(value)

  const valid =
    restOfProps.valid || (typeof isValid === "function" && isValid(value))
  const invalid =
    restOfProps.invalid || (typeof isInvalid === "function" && isInvalid(value))

  return (
    <FormGroup check={isCheckOrRadio} row={row}>
      <Label check={check} for={name}>
        {`${label} ${required ? "*" : ""}`}
      </Label>
      <Input
        id={name}
        defaultValue={defaultValue}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        valid={Boolean(valid)}
        invalid={Boolean(invalid)}
        onChange={handleChange}
      />
      {typeof valid === "string" && (
        <FormFeedback valid={!valid}>{valid}</FormFeedback>
      )}
      {typeof invalid === "string" && (
        <FormFeedback valid={!invalid}>{invalid}</FormFeedback>
      )}
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  )
}

BasicInput.propTypes = inputProps

BasicInput.defaultProps = {}

export default memo(BasicInput)
