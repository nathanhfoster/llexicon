import React, { memo } from "react"
import { Fab } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import defaultStyles from "./defaultStyles"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    ...defaultStyles,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 9999
  }
})

const CloseButton = props => {
  const { classes, onClick } = props
  const { root } = classes
  return (
    <Fab className={root} size="medium" aria-label="exit" onClick={onClick}>
      <Close />
    </Fab>
  )
}

export default withStyles(styles)(memo(CloseButton))
