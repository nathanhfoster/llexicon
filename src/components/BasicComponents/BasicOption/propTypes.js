import PropTypes from 'prop-types'

const optionProps = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defualtValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
}

export { optionProps }
