import React, { useMemo, memo, Fragment } from 'react'
import { InputProps } from './propTypes'
import {
  FormGroup,
  Label,
  CustomInput,
  CustomFileInput,
  Input,
  FormFeedback,
  FormText,
} from 'reactstrap'
import BasicOption from '../BasicOption'
import { cleanObject } from 'utils'

const BasicInput = ({
  id,
  name,
  defaultValue,
  defaultChecked,
  value,
  checked,
  label,
  type,
  placeholder,
  required,
  readOnly,
  disabled,
  autoFocus,
  //   valid,
  isValid,
  //   invalid,
  isInvalid,
  autoComplete,
  helpText,
  multiline,
  row,
  inline,
  className,
  onChange,
  options,
  multiple,
  min,
  max,
  step,
  formGroup,
  children,
  ...restOfProps
}) => {
  const isCheckOrRadio = type === 'checkbox' || type === 'radio'

  console.log(name, isCheckOrRadio)

  const uniqueId = id || name

  const valid = restOfProps.valid || (typeof isValid === 'function' && isValid(value))

  const invalid = restOfProps.invalid || (typeof isInvalid === 'function' && isInvalid(value))

  const renderOptions = useMemo(
    () =>
      type === 'select'
        ? options?.map((option, i) => {
            return <BasicOption key={`option-${name}-${i}`} {...option} />
          })
        : undefined,
    [name, options, type],
  )

  const renderInput = useMemo(() => {
    const inputProps = cleanObject({
      id: uniqueId,
      defaultValue,
      defaultChecked,
      value,
      checked,
      type,
      name,
      placeholder,
      readOnly,
      disabled,
      valid: Boolean(valid),
      invalid: Boolean(invalid),
      autoComplete,
      onChange,
      min,
      max,
      multiple,
      step,
    })

    switch (type) {
      case 'switch':
        return <CustomInput {...inputProps} />
      case 'file':
        return <CustomFileInput {...inputProps} />
      default:
        return <Input {...inputProps}>{renderOptions}</Input>
    }
  }, [
    uniqueId,
    defaultValue,
    defaultChecked,
    value,
    checked,
    type,
    name,
    placeholder,
    readOnly,
    disabled,
    valid,
    invalid,
    autoComplete,
    onChange,
    min,
    max,
    multiple,
    step,
    renderOptions,
  ])

  const labelText = useMemo(() => {
    if (typeof label === 'string') {
      return `${label} ${required ? '*' : ''}`
    }

    return label
  }, [label, required])

  const renderLabel = useMemo(() => {
    return isCheckOrRadio ? (
      <Label check={isCheckOrRadio} for={name}>
        {renderInput} {labelText}
      </Label>
    ) : (
      <Fragment>
        {labelText && (
          <Label check={isCheckOrRadio} for={name}>
            {labelText}
          </Label>
        )}
        {renderInput}
      </Fragment>
    )
  }, [isCheckOrRadio, name, renderInput, labelText])

  const render = useMemo(
    () => (
      <Fragment>
        {renderLabel}
        {typeof valid === 'string' && (
          <FormFeedback for={uniqueId} valid={!valid}>
            {valid}
          </FormFeedback>
        )}
        {typeof invalid === 'string' && (
          <FormFeedback for={uniqueId} valid={!invalid}>
            {invalid}
          </FormFeedback>
        )}
        {helpText && <FormText>{helpText}</FormText>}
      </Fragment>
    ),
    [helpText, invalid, renderLabel, uniqueId, valid],
  )

  return (
    <Fragment>
      {formGroup ? (
        <FormGroup className={className} check={isCheckOrRadio} row={row} inline={inline}>
          {render}
        </FormGroup>
      ) : (
        render
      )}
      {children}
    </Fragment>
  )
}

BasicInput.propTypes = InputProps

BasicInput.defaultProps = {
  row: false,
  formGroup: true,
}

export default memo(BasicInput)
