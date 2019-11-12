import React, { memo } from "react"
import PropTypes from "prop-types"
import { ArrayList } from "../../../classes"
import { getRandomInt } from "../../../helpers"
import Star from "../Star"

const StarGenerator = ({ length = 101 }) => {
  let topPositions = new ArrayList({ ofNumbers: true, length: 101 })
  let leftPositions = new ArrayList({ ofNumbers: true, length: 101 })
  let stars = []

  for (let i = 0; i < length; i++) {
    const randomTop = topPositions.getRandomUniqueValue()
    const randomLeft = leftPositions.getRandomUniqueValue()

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
