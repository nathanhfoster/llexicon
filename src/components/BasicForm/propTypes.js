import PropTypes from "prop-types"

const BasicFormProps = {
  title: PropTypes.string,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      defaultValue: PropTypes.string,
      value: PropTypes.string,
      check: PropTypes.bool,
      label: PropTypes.string,
      type: PropTypes.oneOf(["email", "text", "password", "checkbox", "radio"]),
      name: PropTypes.string,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      disabled: PropTypes.bool,
      autoFocus: PropTypes.bool,
      error: PropTypes.bool,
      multiline: PropTypes.bool,
      rows: PropTypes.string,
      className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired
  ),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  submitLabel: PropTypes.string,
}

export { BasicFormProps }
