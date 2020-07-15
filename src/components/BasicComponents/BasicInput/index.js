import React, { useState, useEffect, memo, Fragment } from "react"
import { inputProps } from "./propTypes"
import { FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap"

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
  const [value, setValue] = useState(restOfProps.value)

  useEffect(() => {
    if (value !== restOfProps.value) {
      setValue(value)
    }
  }, [restOfProps.value])

  const isCheckOrRadio = type === "checkbox" || type === "radio"

  const handleChange = ({ target: { type, value, checked, files } }) => {
    if (type === "radio" || type === "checkbox") {
      setValue(checked)
    } else if (type === "file") {
      // setValue(files)
      setValue(value)
    } else {
      setValue(value)
    }
  }

  const valid =
    restOfProps.valid || (typeof isValid === "function" && isValid(value))
  const invalid =
    restOfProps.invalid || (typeof isInvalid === "function" && isInvalid(value))

  const renderLabel = `${label} ${required ? "*" : ""}`

  const renderInput = (
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
  )

  return (
    <FormGroup check={isCheckOrRadio} row={row}>
      {isCheckOrRadio ? (
        <Label check={isCheckOrRadio} for={name}>
          {renderInput} {renderLabel}
        </Label>
      ) : (
        <Fragment>
          {label && (
            <Label check={isCheckOrRadio} for={name}>
              {renderLabel}
            </Label>
          )}
          {renderInput}
        </Fragment>
      )}
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
