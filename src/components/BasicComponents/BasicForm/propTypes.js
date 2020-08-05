import PropTypes from "prop-types"
import { BasicInputsProps } from "../BasicInput/propTypes"

const BasicFormInputProps = PropTypes.arrayOf(BasicInputsProps)

const BasicFormProps = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inputs: BasicFormInputProps.isRequired,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  submitLabel: PropTypes.string,
  method: PropTypes.string.isRequired,
}

export { BasicFormInputProps, BasicFormProps }
