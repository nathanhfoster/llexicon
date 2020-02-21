import React, { memo } from "react"
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom"
import { BasicTabs } from "../../components"
import { RouterPush, RouteMap } from "../../routes"
import Login from "./Login"
import SignUp from "./SignUp"
import ForgotPassword from "./ForgotPassword"

import "./styles.css"
const { LOGIN, SIGNUP, PASSWORD_RESET } = RouteMap

const Account = ({ history, location: { pathname } }) => {
  const activeTab = pathname

  const handleTabChange = tabId => RouterPush(history, tabId)

  const tabs = [
    {
      tabId: LOGIN,
      title: "Login",
      render: <Login />,
      onClickCallback: handleTabChange
    },
    {
      tabId: SIGNUP,
      title: "Sign up",
      render: <SignUp />,
      onClickCallback: handleTabChange
    },
    {
      tabId: PASSWORD_RESET,
      title: "Forgot password",
      render: <ForgotPassword />,
      onClickCallback: handleTabChange
    }
  ]

  return (
    <BasicTabs containerClassname="Account" activeTab={activeTab} tabs={tabs} />
  )
}

Account.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(memo(Account))
