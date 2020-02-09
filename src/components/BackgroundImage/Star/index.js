import React, { memo } from "react"
import PropTypes from "prop-types"
import { getRandomInt, getRandomFloat, objectToArray } from "../../../helpers"
import "./styles.css"

export const StarColorGradients = {
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
  position,
  display,
  top,
  bottom,
  left,
  right,
  animation = getRandomFloat(3, 10),
  size,
  color,
  opacity = getRandomFloat(0.1, 1),
  zIndex,
  marginLeft,
  marginRight
}) => {
  const randomSize = getRandomInt(1, 6)
  const randomGradientIndex = getRandomInt(0, StarColorGradientsList.length - 1)
  const randomZIndex = getRandomInt(0, 100)
  if (typeof top === "string" && !top.includes("px")) top = `${top}%`
  if (typeof left === "string" && !left.includes("px")) left = `${left}%`
  return {
    top,
    bottom,
    left,
    right,
    animation: animation
      ? `glow-star 2s infinite ease-in-out alternate ${animation}s`
      : "none",
    position,
    display,
    borderRadius: "100%",
    backgroundImage: `radial-gradient(circle, ${
      color
        ? StarColorGradients[color]
        : StarColorGradientsList[randomGradientIndex]
    })`,
    width: size || randomSize,
    height: size || randomSize,
    willChange: "opacity",
    opacity,
    zIndex: zIndex || randomZIndex,
    marginLeft,
    marginRight
  }
}

const Star = props => <div style={styles(props)} />

Star.propTypes = {
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

Star.defaultProps = {
  position: "inherit",
  display: "inline-block",
  marginLeft: 0,
  marginRight: 0
}

export default memo(Star)
