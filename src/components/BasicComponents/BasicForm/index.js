import React, { useState, useMemo, useCallback, memo } from 'react'
import { Button, Form } from 'reactstrap'
import { getFormPayload } from './utils'
import { BasicFormProps } from './propTypes'
import BasicInput from '../BasicInput'

const BasicForm = ({
  title,
  inputs,
  saveLabel,
  cancelLabel,
  method,
  onSubmit,
  onCancel,
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
        target: { id, name, value, type, checked, files, multiple, options },
      } = event

      setState(prevState =>
        prevState.map(input => {
          if (input.name === name) {
            if (type === 'radio' || type === 'checkbox' || type === 'switch') {
              return { ...input, checked }
            } else if (
              (type === 'select-one' || type === 'select-multiple') &&
              options?.length > 0
            ) {
              let stateOptions = []

              for (let i = 0, { length } = options; i < length; i++) {
                const { value, selected } = options[i]

                stateOptions.push({ value, selected })
              }

              return { ...input, options: stateOptions }
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
      (onChange ? inputs : state).map((input, i) => (
        <BasicInput key={`${input.name}-${i}`} {...input} onChange={handleChange} />
      )),
    [onChange, inputs, state, handleChange],
  )

  return (
    <Form onSubmit={handleSubmit} method={method}>
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
}
export default memo(BasicForm)
