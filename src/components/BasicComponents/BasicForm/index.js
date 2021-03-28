import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { Button, Form, FormGroup, Col } from 'reactstrap'
import { BasicFormProps } from './propTypes'
import BasicInput from '../BasicInput'
import { useMounted } from 'hooks'
import { getInputValue, getState, getInputPayloadValue } from './utils'
import './styles.css'

export const BasicForm = ({
  className,
  inline,
  title,
  inputs,
  saveLabel,
  cancelLabel,
  method,
  onSubmit,
  onCancel,
  onChange,
}) => {
  const mounted = useMounted()
  const [state, setState] = useState(() => getState(inputs))

  useEffect(() => {
    if (mounted) {
      setState(getState(inputs))
    }
  }, [inputs])

  const handleSubmit = e => {
    e.preventDefault()
    if (!onSubmit) return

    const payload = state.reduce((acc, input) => {
      if (Array.isArray(input)) {
        input.forEach(e => {
          acc = getInputPayloadValue(acc, e)
        })
      } else {
        acc = getInputPayloadValue(acc, input)
      }
      return acc
    }, {})

    onSubmit(payload)
  }

  const handleChange = useCallback(
    event => {
      const { target } = event
      if (onChange) {
        onChange(event)
      }
      setState(prevState =>
        prevState.map(input => {
          if (Array.isArray(input)) {
            return input.map(e => getInputValue(e, target, true))
          }
          return getInputValue(input, target)
        }),
      )
    },
    [onChange],
  )

  const renderTitle = useMemo(
    () =>
      !title ? undefined : typeof title === 'object' ? (
        title
      ) : (
        <h2 className='text-center'>{title}</h2>
      ),
    [title],
  )

  const renderInputs = useMemo(
    () =>
      state.map((input, i) => {
        return Array.isArray(input) ? (
          <FormGroup className='mb-0' row={true} tag='fieldset' inline={input.inline}>
            {input.map((e, i) => (
              <Col>
                <BasicInput key={`${e.name}-${i}`} {...e} onChange={handleChange} />
              </Col>
            ))}
          </FormGroup>
        ) : (
          <BasicInput key={`${input.name}-${i}`} {...input} onChange={handleChange} />
        )
      }),
    [state, handleChange],
  )

  return (
    <Form className='BasicForm' inline={inline} onSubmit={handleSubmit} method={method}>
      {renderTitle}
      {renderInputs}
      {onSubmit && (
        <div className='text-center'>
          <Button className='mr-1' color='accent' type='submit'>
            {saveLabel}
          </Button>
          <Button color='danger' onClick={onCancel}>
            {cancelLabel}
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
      label: 'Username',
      type: 'text',
      name: 'username',
      placeholder: 'Username...',
      required: true,
      disabled: false,
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      placeholder: 'Email...',
      required: true,
      disabled: false,
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      placeholder: 'Password...',
      required: true,
      disabled: false,
    },
  ],
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
  method: 'post',
  inline: false,
}
export default memo(BasicForm)
