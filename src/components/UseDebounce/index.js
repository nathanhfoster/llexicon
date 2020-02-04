import { useEffect, memo } from "react"
import PropTypes from "prop-types"

const UseDebounce = ({ value, delay, onChangeCallback }) => {
  useEffect(() => {
    const debounce = setTimeout(() => onChangeCallback(value), delay)

    return () => clearTimeout(debounce)
  }, [value])

  return null
}

UseDebounce.propTypes = {
  onChangeCallback: PropTypes.func.isRequired,
  value: PropTypes.any,
  delay: PropTypes.number
}

UseDebounce.defaultProps = {
  delay: 400
}

export default memo(UseDebounce)
