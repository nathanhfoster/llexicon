import React, { memo } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import { RouteMap, RouterPush } from "reducers//router/actions"

const NewEntryButton = () => (
  <Button color="accent" onClick={() => RouterPush(RouteMap.NEW_ENTRY)}>
    <i className="fas fa-feather-alt mr-1" />
    Create a new journal entry
  </Button>
)

NewEntryButton.propTypes = {}

NewEntryButton.defaultProps = {}

export default memo(NewEntryButton)
