import React, { memo } from 'react'

const BasicOption = ({ name }) => {
  return <option>{name}</option>
}

export default memo(BasicOption)
