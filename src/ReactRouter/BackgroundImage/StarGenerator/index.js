import React, { memo } from "react"
import PropTypes from "prop-types"
import { getRandomInt } from "../../../helpers"
import Star from "../Star"

const StarGenerator = ({ length = 100 }) => {
  let topPositions = Array.from(new Array(length).keys())
  let leftPositions = Array.from(new Array(length).keys())
  let stars = []

  for (let i = 0; i < length; i++) {
    const randomTop = getRandomInt(0, topPositions.length - 1)
    topPositions.splice(randomTop, 1)

    const randomLeft = getRandomInt(0, leftPositions.length - 1)
    leftPositions.splice(randomTop, 1)

    const fiftyPercentChance = getRandomInt(0, 100) > 50
    const animation = getRandomInt(1, 5)

    const props = {
      top: randomTop,
      left: randomLeft,
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
