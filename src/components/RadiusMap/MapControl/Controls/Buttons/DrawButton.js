import React, { memo } from "react"
import { Fab } from "@material-ui/core"
import { BorderColor } from "@material-ui/icons"
import defaultStyles from "./defaultStyles"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    ...defaultStyles
  }
})

const DrawButton = props => {
  const { classes, onClick, disabled } = props
  const { root } = classes
  return (
    <Fab
      className={root}
      size="medium"
      aria-label="exit"
      onClick={onClick}
      disabled={disabled}
    >
      <BorderColor />
    </Fab>
  )
}

export default withStyles(styles)(memo(DrawButton))
