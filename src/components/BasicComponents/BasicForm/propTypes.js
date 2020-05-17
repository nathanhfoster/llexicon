import PropTypes from "prop-types"

const BasicFormInputsProps = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    check: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.oneOf(["email", "text", "password", "checkbox", "radio"]),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    error: PropTypes.bool,
    multiline: PropTypes.bool,
    rows: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired
)

const BasicFormProps = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inputs: BasicFormInputsProps,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  submitLabel: PropTypes.string,
}

export { BasicFormProps, BasicFormInputsProps }
