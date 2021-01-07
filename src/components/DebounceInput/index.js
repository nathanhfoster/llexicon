import React, { useRef, useState, useEffect, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { InputProps } from 'components/BasicComponents/BasicInput/propTypes'
import { Input } from 'reactstrap'
import { UseDebounce } from '../'

const DebounceInput = ({
  debounceOnMount,
  delay,
  onChange,
  value,
  defaultValue,
  focusOnMount,
  ...restOfInputProps
}) => {
  const mounted = useRef(false)
  const inputRef = useRef()
  const [debouncedValue, setDebouncedValue] = useState(defaultValue || value)
  const handleInputChange = ({ target: { value } }) => setDebouncedValue(value)

  useEffect(() => {
    if (mounted.current) {
      setDebouncedValue(value)
    }
    mounted.current = true
  }, [value])

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  return (
    <Fragment>
      <Input
        {...restOfInputProps}
        innerRef={inputRef}
        value={debouncedValue}
        onChange={handleInputChange}
      />
      <UseDebounce
        debounceOnMount={debounceOnMount}
        value={debouncedValue}
        delay={delay}
        onChange={onChange}
      />
    </Fragment>
  )
}

DebounceInput.propTypes = {
  ...InputProps,
  debounceOnMount: PropTypes.bool.isRequired,
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  focusOnMount: PropTypes.bool,
}

DebounceInput.defaultProps = {
  debounceOnMount: false,
  delay: 400,
  focusOnMount: false,
  type: 'search',
  autoComplete: 'on',
  name: 'debounce'
}

export default memo(DebounceInput)
