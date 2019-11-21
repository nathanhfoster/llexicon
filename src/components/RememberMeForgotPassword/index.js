import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { FormGroup, Label, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import { RouterLinkPush } from "../../ReactRouter/Routes"
import { RouteMap } from "../../ReactRouter"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class RememberMeForgotPassword extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  render() {
    const { history, isLogin, onChange } = this.props
    const {PASSWORD_RESET} = RouteMap
    return (
      <FormGroup check>
        <Label check>
          <Input type="checkbox" name="rememberMe" onChange={onChange} />
          Keep me logged in
        </Label>

        <Link
          to={RouterLinkPush(history, PASSWORD_RESET)}
          className="float-right"
        >
          Forgot password?
        </Link>
      </FormGroup>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(RememberMeForgotPassword)
)
