import React, { useState, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { UseDebounce } from "../"

const DebounceInput = ({ debounceOnMount, delay, onChange, ...inputProps }) => {
  const [value, setValue] = useState("")
  const handleInputChange = ({ target: { value } }) => setValue(value)

  return (
    <Fragment>
      <Input onChange={handleInputChange} {...inputProps} />
      <UseDebounce
        debounceOnMount={debounceOnMount}
        value={value}
        delay={delay}
        onChangeCallback={onChange}
      />
    </Fragment>
  )
}

DebounceInput.propTypes = {
  debounceOnMount: PropTypes.bool.isRequired,
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
}

DebounceInput.defaultProps = { debounceOnMount: false, delay: 400 }

export default memo(DebounceInput)
