import React, { memo } from "react"
import "./styles.css"

const styles = ({}) => ({
  position: "relative",
  pointerEvents: "none",
  zIndex: 102,
  width: 300
})

const FourOFOur = props => (
  <img style={styles(props)} src="http://salehriaz.com/404Page/img/404.svg" />
)

export default memo(FourOFOur)
