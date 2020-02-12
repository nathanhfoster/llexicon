import React, { memo } from "react"
import PropTypes from "prop-types"
import { Jumbotron } from "reactstrap"
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import { BasicTabs, BasicForm, FacebookGoogleLogin } from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { RouterPush, RouteMap } from "../../components/ReactRouter/Routes"
import { UserLogin, CreateUser, PasswordReset } from "../../actions/User"

import "./styles.css"
const { LOGIN, SIGNUP, PASSWORD_RESET } = RouteMap

const Login = ({ history, location: { pathname } }) => {
  const dispatch = useDispatch()
  const activeTab = pathname

  const handleLogin = payload => dispatch(UserLogin(payload))

  const handleSignUp = payload => dispatch(CreateUser(payload))

  const handlePasswordReset = payload => dispatch(PasswordReset(payload))

  const handleTabChange = tabId => RouterPush(history, tabId)

  const tabs = [
    {
      tabId: LOGIN,
      title: "Login",
      render: (
        <Jumbotron className="LoginFormContainer">
          <LogoImage center />
          <BasicForm
            title="Login"
            onSubmit={payload => handleLogin(payload)}
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
      onClickCallback: handleTabChange
    },
    {
      tabId: SIGNUP,
      title: "Sign up",
      render: (
        <Jumbotron className="LoginFormContainer">
          <LogoImage center />
          <BasicForm
            title="Sign Up"
            onSubmit={payload => handleSignUp(payload)}
            submitLabel="Sign Up"
          />
          <FacebookGoogleLogin />
        </Jumbotron>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: PASSWORD_RESET,
      title: "Forgot password",
      render: (
        <Jumbotron className="LoginFormContainer">
          <LogoImage center />
          <BasicForm
            title="Forgot password"
            onSubmit={payload => handlePasswordReset(payload)}
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
      onClickCallback: handleTabChange
    }
  ]

  return (
    <BasicTabs containerClassname="Login" activeTab={activeTab} tabs={tabs} />
  )
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(memo(Login))
