import PropTypes from "prop-types"
const inputProps = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  check: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.oneOf([
    "email",
    "text",
    "password",
    "checkbox",
    "radio",
    "file",
  ]),
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

const BasicInputsProps = PropTypes.shape(inputProps)

export { inputProps, BasicInputsProps }
