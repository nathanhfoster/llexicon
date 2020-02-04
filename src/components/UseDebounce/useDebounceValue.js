import { useState, useEffect } from "react"
import PropTypes from "prop-types"

const useDebounceValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value])

  return debouncedValue
}

UseDebounce.propTypes = {
  onChangeCallback: PropTypes.func.isRequired,
  value: PropTypes.any,
  delay: PropTypes.number
}

UseDebounce.defaultProps = {
  delay: 400
}

export default useDebounceValue
