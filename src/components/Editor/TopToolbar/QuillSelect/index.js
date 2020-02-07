import React, { memo } from "react"
import PropTypes from "prop-types"
import { capitalizeFirstLetter } from "../../../../helpers"
import "./styles.css"

const capitalizeHeaders = string => {
  if (typeof string === "string" || string instanceof String) {
    const newString = string.split("-")
    const first = capitalizeFirstLetter(newString[0])
    const second = capitalizeFirstLetter(newString[1])
    if (second) return `${first} ${second}`
    else return first
  }
}

const renderOptions = options =>
  options.map((value, i) => (
    <option key={i} value={value}>
      {capitalizeHeaders(value)}
    </option>
  ))

const QuillSelect = ({
  options = [],
  onChange = e => e.persist(),
  className,
  defaultValue,
  ...restOfProps
}) => {
  return (
    <select className={`ql-${className}`} {...restOfProps}>
      {defaultValue && <option defaultValue={defaultValue} />}
      {renderOptions(options)}
    </select>
  )
}

QuillSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
}

export default memo(QuillSelect)
