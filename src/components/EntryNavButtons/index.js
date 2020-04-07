import React, { memo } from "react"
import PropTypes from "prop-types"
import { ButtonGroup, Button } from "reactstrap"
import { RouterPush } from "../../routes"
import { useHistory } from "react-router-dom"
import { ENTRY_LINKS } from "../NavBar"

const EntryNavButtons = () => {
  const history = useHistory()

  const renderButtons = () =>
    ENTRY_LINKS.map(({ route, icon }, i) => (
      <Button
        key={i}
        color="accent"
        className="px-3 py-2"
        onClick={() => RouterPush(history, route)}
      >
        {icon}
      </Button>
    ))

  return <ButtonGroup>{renderButtons()}</ButtonGroup>
}

EntryNavButtons.propTypes = {}

EntryNavButtons.defaultProps = {}

export default memo(EntryNavButtons)
