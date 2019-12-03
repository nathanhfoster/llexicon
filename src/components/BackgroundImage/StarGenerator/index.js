import React, { memo } from "react"
import PropTypes from "prop-types"
import { ArrayList } from "../../../classes"
import { getRandomInt } from "../../../helpers"
import { StarColorGradients } from "../Star"
import Star from "../Star"

const StarGenerator = ({ length = 101, position = "inherit" }) => {
  let topPositions = new ArrayList({ ofFloats: true, length: 101 })
  let leftPositions = new ArrayList({ ofFloats: true, length: 101 })
  let stars = []

  for (let i = 0; i < length; i++) {
    const randomTop = topPositions.getRandomUniqueValue()
    const randomLeft = leftPositions.getRandomUniqueValue()

    const percentChance = getRandomInt(0, 100) <= 25
    const animation = getRandomInt(1, 5)

    const props = {
      top: randomTop,
      left: randomLeft,
      animation: percentChance ? animation : false,
      position
    }

    stars.push(<Star key={i} {...props} />)
  }
  return stars
}

StarGenerator.propTypes = {
  length: PropTypes.number,
  // Star Props
  position: PropTypes.string,
  display: PropTypes.string,
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  animation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  size: PropTypes.number,
  color: PropTypes.oneOf(Object.keys(StarColorGradients)),
  opacity: PropTypes.number,
  marginLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default memo(StarGenerator)
