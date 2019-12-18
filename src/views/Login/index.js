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

  render() {
    const { history } = this.props
    const { activeTab } = this.state

    const tabs = [
      {
        tabId: LOGIN,
        title: "Login",
        Component: () => (
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
        onClickCallback: () => RouterPush(history, LOGIN)
      },
      {
        tabId: SIGNUP,
        title: "Sign up",
        Component: () => (
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
        onClickCallback: () => RouterPush(history, SIGNUP)
      },
      {
        tabId: PASSWORD_RESET,
        title: "Forgot password",
        Component: () => (
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
        onClickCallback: () => RouterPush(history, PASSWORD_RESET)
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
