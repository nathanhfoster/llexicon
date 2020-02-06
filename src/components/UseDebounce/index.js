import { useRef, useEffect, memo } from "react"
import PropTypes from "prop-types"

const UseDebounce = ({ value, delay, onChangeCallback }) => {
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current) {
      const debounce = setTimeout(() => onChangeCallback(value), delay)
      return () => {
        clearTimeout(debounce)
      }
    }
    mounted.current = true
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
