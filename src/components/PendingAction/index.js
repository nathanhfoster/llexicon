import React, { memo } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import "./styles.css"

const PendingAction = ({
  ShouldShow,
  Disabled,
  Click,
  ActionPending,
  ActionComplete,
  ActionError,
  ActionName,
  Redirect
}) => {
  const Pending = ActionPending && !ActionComplete
  const Completed = !ActionPending && ActionComplete && !ActionError
  const shouldRedirect = Redirect && Completed

  if (shouldRedirect) Redirect()

  const switchActionIcon = ActionName => {
    return null
    switch (ActionName) {
      case "POST":
        return <i className="fas fa-paper-plane" />
      case "UPDATE":
        return <i className="fas fa-pen-fancy" />
      default:
        return null
    }
  }

  return (
    ShouldShow && (
      <Button
        className="PendingAction"
        disabled={Disabled}
        type="submit"
        onClick={Click}
      >
        {Pending
          ? [<i className="fa fa-spinner fa-spin" />, ActionName]
          : Completed
          ? [
              <i
                className="fas fa-check"
                style={{ color: "var(--color_emerald)" }}
              />,
              ActionName
            ]
          : [switchActionIcon(ActionName), ActionName]}
      </Button>
    )
  )
}

PendingAction.propTypes = {}

PendingAction.defaultProps = { ShouldShow: true, Disabled: false }

export default memo(PendingAction)
