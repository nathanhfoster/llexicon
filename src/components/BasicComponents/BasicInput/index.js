import React, { useMemo, memo, Fragment } from 'react'
import { InputProps } from './propTypes'
import { FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap'
import BasicOption from '../BasicOption'

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
  const isCheckOrRadio = type === 'checkbox' || type === 'radio'

  const valid = restOfProps.valid || (typeof isValid === 'function' && isValid(value))

  const invalid = restOfProps.invalid || (typeof isInvalid === 'function' && isInvalid(value))

  const renderOptions = useMemo(
    () =>
      type === 'select'
        ? options?.map((option, i) => <BasicOption key={`option-${name}-${i}`} {...option} />)
        : undefined,
    [name, options, type],
  )

  const renderInput = useMemo(
    () => (
      <Input
        id={id || name}
        className={className}
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
    [id, name, className, defaultValue, value, type, placeholder, disabled, valid, invalid, onChange, renderOptions],
  )

  const renderLabel = useMemo(() => {
    const labelText = label ? `${label} ${required ? '*' : ''}` : null

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
    <FormGroup check={isCheckOrRadio} row={row}>
      {renderLabel}
      {typeof valid === 'string' && <FormFeedback valid={!valid}>{valid}</FormFeedback>}
      {typeof invalid === 'string' && <FormFeedback valid={!invalid}>{invalid}</FormFeedback>}
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  )
}

BasicInput.propTypes = InputProps

export default memo(BasicInput)
