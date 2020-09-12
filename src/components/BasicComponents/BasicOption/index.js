import React, { memo } from 'react'
import {optionProps} from './propTypes'

const BasicOption = ({ name }) => {
  return <option>{name}</option>
}

export default memo(BasicOption)


BasicOption.propTypes = optionProps