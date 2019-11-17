import React from "react"
import PropTypes from "prop-types"
import { capitalize } from "../../../../helpers"
import "./styles.css"

const capitalizeHeaders = string => {
  if (typeof string === "string" || string instanceof String) {
    const newString = string.split("-")
    const first = capitalize(newString[0])
    const second = capitalize(newString[1])
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

export default QuillSelect
