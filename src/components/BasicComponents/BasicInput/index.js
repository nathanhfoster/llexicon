import React, { useMemo, memo, Fragment } from "react"
import { InputProps } from "./propTypes"
import {
  FormGroup,
  Label,
  CustomInput,
  CustomFileInput,
  Input,
  FormFeedback,
  FormText,
} from "reactstrap"
import BasicOption from "../BasicOption"

const BasicInput = ({
  id,
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
  inline,
  className,
  value,
  onChange,
  children,
  options,
  multiple,
  min,
  max,
  step,
  ...restOfProps
}) => {
  const isCheckOrRadio = type === "checkbox" || type === "radio"

  const uniqueId = id || name

  const valid =
    restOfProps.valid || (typeof isValid === "function" && isValid(value))

  const invalid =
    restOfProps.invalid || (typeof isInvalid === "function" && isInvalid(value))

  const renderOptions = useMemo(
    () =>
      type === "select"
        ? options?.map((option, i) => (
            <BasicOption key={`option-${name}-${i}`} {...option} />
          ))
        : undefined,
    [name, options, type]
  )

  const renderInput = useMemo(() => {
    const inputProps = {
      id: uniqueId,
      className,
      defaultValue,
      value,
      type,
      name,
      placeholder,
      disabled,
      valid: Boolean(valid),
      invalid: Boolean(invalid),
      onChange,
      min,
      max,
      multiple,
      step,
    }

    switch (type) {
      case "switch":
        return <CustomInput {...inputProps} />
      case "file":
        return <CustomFileInput {...inputProps} />
      default:
        return <Input {...inputProps}>{renderOptions}</Input>
    }
  }, [
    uniqueId,
    className,
    defaultValue,
    value,
    type,
    name,
    placeholder,
    disabled,
    valid,
    invalid,
    onChange,
    min,
    max,
    multiple,
    step,
    renderOptions,
  ])

  const renderLabel = useMemo(() => {
    const labelText = label ? `${label} ${required ? "*" : ""}` : null

    return isCheckOrRadio ? (
      <Label check={isCheckOrRadio} for={name}>
        {renderInput} {labelText}
      </Label>
    ) : (
      <Fragment>
        {label && (
          <Label check={isCheckOrRadio} for={name}>
            {labelText}
          </Label>
        )}
        {renderInput}
      </Fragment>
    )
  }, [label, required, isCheckOrRadio, name, renderInput])

  return (
    <FormGroup check={isCheckOrRadio} row={row} inline={inline}>
      {renderLabel}
      {typeof valid === "string" && (
        <FormFeedback for={uniqueId} valid={!valid}>
          {valid}
        </FormFeedback>
      )}
      {typeof invalid === "string" && (
        <FormFeedback for={uniqueId} valid={!invalid}>
          {invalid}
        </FormFeedback>
      )}
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  )
}

BasicInput.propTypes = InputProps

export default memo(BasicInput)
