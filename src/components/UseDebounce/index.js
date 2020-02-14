import { useRef, useEffect, memo } from "react"
import PropTypes from "prop-types"

const UseDebounce = ({ debounceOnMount, value, delay, onChangeCallback }) => {
  const mounted = useRef(debounceOnMount)
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
  debounceOnMount: PropTypes.bool.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  value: PropTypes.any,
  delay: PropTypes.number
}

UseDebounce.defaultProps = { debounceOnMount: false, delay: 400 }

export default memo(UseDebounce)
