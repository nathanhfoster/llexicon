import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class PendingAction extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = { ShouldShow: true, Disabled: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      ShouldShow,
      Disabled,
      Click,
      ActionPending,
      ActionComplete,
      ActionError,
      ActionName,
      Redirect
    } = props
    const Pending = ActionPending && !ActionComplete
    const Completed = !ActionPending && ActionComplete && !ActionError
    const shouldRedirect = Redirect && Completed

    if (shouldRedirect) Redirect()

    return {
      ShouldShow,
      Disabled,
      Click,
      ActionName,
      Pending,
      Completed
    }
  }

  switchActionIcon = ActionName => {
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

  render() {
    const {
      ShouldShow,
      Disabled,
      Click,
      ActionName,
      Pending,
      Completed
    } = this.state

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
            : [this.switchActionIcon(ActionName), ActionName]}
        </Button>
      )
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PendingAction)
