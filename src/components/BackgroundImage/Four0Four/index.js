import React, { memo } from "react"
import { fourOfour } from "../../../images/AWS"
import "./styles.css"

const styles = ({}) => ({
  position: "relative",
  pointerEvents: "none",
  zIndex: 102,
  width: 300,
})

const Four0Four = (props) => <img style={styles(props)} src={fourOfour} />

export default memo(Four0Four)
