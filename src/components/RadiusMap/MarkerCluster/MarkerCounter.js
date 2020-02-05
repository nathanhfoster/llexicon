import React, { memo } from "react"
import PropTypes from "prop-types"
import {
  locationCircleStyle,
  K_CIRCLE_SIZE,
  K_STICK_SIZE
} from "../Marker/styles"

const styles = {
  ...locationCircleStyle,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE + 5),
  left: K_CIRCLE_SIZE / 2 + 7,
  padding: 4,
  fontSize: K_CIRCLE_SIZE / 3,
  color: "white",
  border: "2px solid white",
  backgroundColor: "#333"
}
const MarkerCounter = ({ children }) => <div style={styles}>{children}</div>

MarkerCounter.propTypes = {
  children: PropTypes.any
}

export default memo(MarkerCounter)
