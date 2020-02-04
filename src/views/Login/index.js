import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Jumbotron, Container, Row, Col } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush, RouteMap } from "../../ReactRouter/Routes"
import BasicForm from "../../components/BasicForm"
import FacebookGoogleLogin from "../../components/FacebookGoogleLogin"
import { UserLogin, CreateUser, PasswordReset } from "../../actions/User"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import BasicTabs from "../../components/BasicTabs"
import "./styles.css"
const { LOGIN, SIGNUP, PASSWORD_RESET } = RouteMap

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UserLogin, CreateUser, PasswordReset }

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserLogin: PropTypes.func.isRequired,
    CreateUser: PropTypes.func.isRequired,
    PasswordReset: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname }
    } = nextProps
    return { activeTab: pathname }
  }

  handleLogin = payload => {
    const { UserLogin } = this.props
    UserLogin(payload)
  }

  handleSignUp = payload => {
    const { CreateUser } = this.props
    CreateUser(payload)
  }

  handlePasswordReset = payload => {
    const { PasswordReset } = this.props
    PasswordReset(payload)
  }

  handleTabChange = tabId => {
    const { history } = this.props
    RouterPush(history, tabId)
  }

  render() {
    const { history } = this.props
    const { activeTab } = this.state

    const tabs = [
      {
        tabId: LOGIN,
        title: "Login",
        render: (
          <Jumbotron className="LoginFormContainer">
            <LogoImage center />
            <BasicForm
              title="Login"
              onSubmit={payload => this.handleLogin(payload)}
              submitLabel="Login"
              inputs={[
                {
                  label: "Username",
                  type: "text",
                  name: "username",
                  id: "username",
                  placeholder: "Username..."
                },
                {
                  label: "Password",
                  type: "password",
                  name: "password",
                  id: "password",
                  placeholder: "Password..."
                }
              ]}
            />
            <FacebookGoogleLogin />
          </Jumbotron>
        ),
        onClickCallback: this.handleTabChange
      },
      {
        tabId: SIGNUP,
        title: "Sign up",
        render: (
          <Jumbotron className="LoginFormContainer">
            <LogoImage center />
            <BasicForm
              title="Sign Up"
              onSubmit={payload => this.handleSignUp(payload)}
              submitLabel="Sign Up"
            />
            <FacebookGoogleLogin />
          </Jumbotron>
        ),
        onClickCallback: this.handleTabChange
      },
      {
        tabId: PASSWORD_RESET,
        title: "Forgot password",
        render: (
          <Jumbotron className="LoginFormContainer">
            <LogoImage center />
            <BasicForm
              title="Forgot password"
              onSubmit={payload => this.handlePasswordReset(payload)}
              submitLabel="Request"
              inputs={[
                {
                  label: "Email",
                  type: "email",
                  name: "email",
                  id: "email",
                  placeholder: "Email..."
                }
              ]}
            />
            <FacebookGoogleLogin />
          </Jumbotron>
        ),
        onClickCallback: this.handleTabChange
      }
    ]

    return (
      <BasicTabs containerClassname="Login" activeTab={activeTab} tabs={tabs} />
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
)
