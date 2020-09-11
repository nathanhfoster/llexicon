import React, { useMemo, memo, Fragment } from 'react'
import { inputProps } from './propTypes'
import { FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'

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
  className,
  value,
  onChange,
  children,
  options,
  ...restOfProps
}) => {
  // console.log(name, ' rendered')
  const isCheckOrRadio = type === 'checkbox' || type === 'radio'

  const valid =
    restOfProps.valid || (typeof isValid === 'function' && isValid(value))

  const invalid =
    restOfProps.invalid ||
    (typeof isInvalid === 'function' && isInvalid(value))

  const renderLabel = `${label} ${required ? '*' : ''}`

  const renderOptions = useMemo(
    () =>
      type === 'select'
        ? options?.map(({ name }, i) => (
            <option key={`option-${name}-${i}`}>{name}</option>
          ))
        : undefined,
    [options, type],
  )

  const renderInput = useMemo(
    () => (
      <Input
        id={id || name}
        defaultValue={defaultValue}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        valid={Boolean(valid)}
        invalid={Boolean(invalid)}
        onChange={onChange}
      >
        {renderOptions}
      </Input>
    ),
    [value, renderOptions, disabled, valid, invalid, type, placeholder],
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
      {typeof valid === 'string' && (
        <FormFeedback valid={!valid}>{valid}</FormFeedback>
      )}
      {typeof invalid === 'string' && (
        <FormFeedback valid={!invalid}>{invalid}</FormFeedback>
      )}
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  )
}

BasicInput.propTypes = inputProps

export default memo(BasicInput)
