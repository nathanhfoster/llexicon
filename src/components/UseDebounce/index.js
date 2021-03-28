import { useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { useMounted } from 'hooks'

export const UseDebounce = ({ debounceOnMount, value, delay, onChange }) => {
  const mounted = useMounted(debounceOnMount)

  useEffect(() => {
    if (mounted && delay) {
      const debounce = setTimeout(() => onChange(value), delay)

      return () => {
        clearTimeout(debounce)
      }
    }
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
