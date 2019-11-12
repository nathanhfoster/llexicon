import React, { memo } from "react"
import PropTypes from "prop-types"
import { getRandomInt } from "../../../helpers"
import Star from "../Star"

const StarGenerator = ({ length = 20 }) => {
  const stars = []
  for (let i = 0; i < length; i++) {
    const fiftyPercentChance = getRandomInt(0, 100) > 50
    const animation = getRandomInt(1, 5)
    const props = {
      top: getRandomInt(0, 100),
      left: getRandomInt(0, 100),
      animation: fiftyPercentChance ? animation : false
    }
    stars.push(<Star key={i} {...props} />)
  }
  return stars
}

StarGenerator.propTypes = {
  length: PropTypes.number
}

export default memo(StarGenerator)
