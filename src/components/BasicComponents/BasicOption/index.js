import React, { memo } from "react"
import { optionProps } from "./propTypes"

const BasicOption = ({ value, name, label, ...optionPros }) => {
  if (optionPros.selected) console.log("BasicOption: ", optionPros.selected)
  return (
    <option value={value || name || label} {...optionPros}>
      {label || name || value}
    </option>
  )
}

export default memo(BasicOption)

BasicOption.propTypes = optionProps
