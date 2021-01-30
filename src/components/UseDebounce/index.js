import { useRef, useEffect, memo } from 'react'
import PropTypes from 'prop-types'

export const UseDebounce = ({ debounceOnMount, value, delay, onChange }) => {
  const mounted = useRef(debounceOnMount)

  useEffect(() => {
    if (mounted.current && delay) {
      const debounce = setTimeout(() => onChange(value), delay)

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
  onChange: PropTypes.func.isRequired,
}

UseDebounce.defaultProps = { debounceOnMount: false, delay: 400 }

export default memo(UseDebounce)
