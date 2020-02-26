import React, { memo } from "react"
import PropTypes from "prop-types"
import { ButtonGroup, Button } from "reactstrap"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../routes"

const NewEntryButton = () => {
  const history = useHistory()
  return (
    <ButtonGroup size="lg">
      <Button
        color="accent"
        onClick={() => RouterPush(history, RouteMap.NEW_ENTRY)}
      >
        <i className="fas fa-feather-alt mr-1" />
        New Entry
      </Button>
    </ButtonGroup>
  )
}

NewEntryButton.propTypes = {}

NewEntryButton.defaultProps = {}

export default memo(NewEntryButton)
