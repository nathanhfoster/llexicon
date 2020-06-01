import { useRef, useEffect, memo } from "react"
import PropTypes from "prop-types"

const UseDebounce = ({ debounceOnMount, value, delay, onChangeCallback }) => {
  const mounted = useRef(debounceOnMount)

  useEffect(() => {
    if (mounted.current && delay) {
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
  debounceOnMount: PropTypes.bool.isRequired,
  value: PropTypes.any,
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

UseDebounce.defaultProps = { debounceOnMount: false, delay: 400 }

export default memo(UseDebounce)
