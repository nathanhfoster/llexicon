import React, { memo } from "react"
import PropTypes from "prop-types"
import { getRandomInt, objectToArray } from "../../../helpers"
import "./styles.css"

const StarColorGradients = {
  Blue: `#2980b9, #3498db`,
  DeepBlueWhite: `#2980b9, #ffffff`,
  BlueWhite: `#3498db, #ffffff`,
  Green: `#27ae60, #2ecc71`,
  GreenWhite: `#2ecc71, #ffffff`,
  White: `#f5f5f5, #ffffff`,
  YellowishWhite: `#f1c40f, #ffffff`,
  PaleYellowOrange: `#f1c40f, #e67e22`,
  LightOrangeRed: `#f39c12, #e74c3c`
}

const StarColorGradientsList = objectToArray(StarColorGradients)

const styles = ({
  top = getRandomInt(0, 100),
  left = getRandomInt(0, 100),
  animation = getRandomInt(1, 5),
  size,
  color
}) => {
  const randomSize = getRandomInt(1, 8)
  const randomGradientIndex = getRandomInt(0, StarColorGradientsList.length - 1)
  return {
    top: `${top}%`,
    left: `${left}%`,
    animation: animation
      ? `glow-star 2s infinite ease-in-out alternate ${animation}s`
      : "none",
    position: "absolute",
    borderRadius: "100%",
    // backgroundColor: "red",
    backgroundImage: `radial-gradient(circle, ${
      color
        ? StarColorGradients[color]
        : StarColorGradientsList[randomGradientIndex]
    })`,
    width: size || randomSize,
    height: size || randomSize,
    opacity: 0.3,
    willChange: "opacity"
  }
}

const Star = props => <div style={styles(props)} />

Star.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  animation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  size: PropTypes.number,
  color: PropTypes.string
}

export default memo(Star)
