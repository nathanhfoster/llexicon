import React, { memo } from 'react'
import { optionProps } from './propTypes'

export const BasicOption = ({ value, name, label, ...optionPros }) => {
  return (
    <option value={value || name || label} {...optionPros}>
      {label || name || value}
    </option>
  )
}

export default memo(BasicOption)

BasicOption.propTypes = optionProps
