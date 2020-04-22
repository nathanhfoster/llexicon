import React, { memo } from "react"
import PropTypes from "prop-types"
import { ButtonGroup, Button } from "reactstrap"
import { RouterPush } from "../../routes"
import { useHistory } from "react-router-dom"
import { ENTRY_LINKS } from "../NavBar"

const EntryNavButtons = ({ size }) => {
  const history = useHistory()

  const renderButtons = () =>
    ENTRY_LINKS.map(({ title, route, icon }, i) => (
      <Button
        key={i}
        color="accent"
        title={title}
        onClick={() => RouterPush(history, route)}
      >
        {icon}
      </Button>
    ))

  return (
    <ButtonGroup aria-label="Navigation" size={size}>
      {renderButtons()}
    </ButtonGroup>
  )
}

EntryNavButtons.propTypes = { size: PropTypes.string }

EntryNavButtons.defaultProps = { size: "mod" }

export default memo(EntryNavButtons)
