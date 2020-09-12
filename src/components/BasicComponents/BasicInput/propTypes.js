import PropTypes from 'prop-types'
import { optionProps } from '../BasicOption/propTypes'

const InputTypes = [
  'email',
  'text',
  'password',
  'checkbox',
  'radio',
  'file',
  'select',
]

const InputProps = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  check: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.oneOf(InputTypes),
  options: PropTypes.arrayOf(PropTypes.shape(optionProps)),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isValid: PropTypes.func,
  invalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isInvalid: PropTypes.func,
  helpText: PropTypes.string,
  multiline: PropTypes.bool,
  row: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

const BasicInputsProps = PropTypes.shape(InputProps)

export { InputTypes, InputProps, BasicInputsProps }
