import React, { useState, useMemo, useCallback, memo } from 'react'
import { Button, Form } from 'reactstrap'
import { getFormPayload } from './utils'
import { BasicFormProps } from './propTypes'
import BasicInput from '../BasicInput'

const BasicForm = ({
  title,
  inputs,
  submitLabel,
  method,
  onSubmit,
  onChange,
}) => {
  const [state, setState] = useState(inputs)

  const handleSubmit = e => {
    e.preventDefault()
    if (!onSubmit) return

    const payload = getFormPayload(state)

    onSubmit(payload)
  }

  const handleChange = useCallback(event => {
    if (onChange) {
      onChange(event)
    } else {
      const {
        target: { id, name, value, type, checked, files },
      } = event

      setState(prevState =>
        prevState.map(input => {
          if (input.name === name) {
            if (type === 'radio' || type === 'checkbox') {
              return { ...input, checked }
            } else if (type === 'file') {
              return { ...input, files }
            } else {
              return { ...input, value }
            }
          } else {
            return input
          }
        }),
      )
    }
  }, [])

  const renderInputs = useMemo(
    () =>
      (onChange ? inputs : state).map((input, i) => (
        <BasicInput
          key={`${input.name}-${i}`}
          {...input}
          onChange={handleChange}
        />
      )),
    [onChange, inputs, state, handleChange],
  )

  return (
    <Form onSubmit={handleSubmit} method={method}>
      {!title ? undefined : typeof title === 'object' ? (
        title
      ) : (
        <h2 className='text-center'>{title}</h2>
      )}
      {renderInputs}
      {onSubmit && (
        <div className='text-center'>
          <Button color='accent' type='submit'>
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
  submitLabel: 'Submit',
  method: 'post',
}
export default memo(BasicForm)
