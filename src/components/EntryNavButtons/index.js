import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { ButtonGroup, Button } from "reactstrap"
import { RouterPush } from "../../redux/router/actions"

import { ENTRY_LINKS } from "../NavBar"

const EntryNavButtons = ({ size }) => {
  const renderButtons = useMemo(
    () =>
      ENTRY_LINKS.map(({ title, route, icon }, i) => (
        <Button
          key={i}
          color="accent"
          title={title}
          onClick={() => RouterPush(route)}
        >
          {icon}
        </Button>
      )),
    []
  )

  return (
    <ButtonGroup aria-label="Navigation" size={size}>
      {renderButtons}
    </ButtonGroup>
  )
}

EntryNavButtons.propTypes = { size: PropTypes.string }

EntryNavButtons.defaultProps = { size: "mod" }

export default memo(EntryNavButtons)
