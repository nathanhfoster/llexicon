import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { UserLogin } from "../../../redux/User/actions"

const mapStateToProps = ({ User: { error } }) => ({
  userError: error,
})

const mapDispatchToProps = { UserLogin }

const Login = ({ userError, UserLogin }) => {
  const errorMessage = userError && "Username or Password is incorrect"

  const handleLogin = useCallback((payload) => UserLogin(payload), [])

  const isInvalid = useCallback(
    (value) => {
      if (value && value.length < 3) {
        return "Required. 3 or more characters."
      } else {
        return false
      }
    },
    [userError]
  )

  const inputs = [
    {
      label: "Username",
      type: "text",
      name: "username",
      placeholder: "Username...",
      invalid: errorMessage,
      isInvalid,
      required: true,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Password...",
      isInvalid,
      required: true,
    },
    {
      label: "Opt in",
      type: "checkbox",
      name: "opt_in",
      // placeholder: "Opt in...",
    },
  ]

  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Login"
        onSubmit={handleLogin}
        submitLabel="Login"
        inputs={inputs}
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

Login.propTypes = {
  userError: PropTypes.shape({
    message: PropTypes.string,
    name: PropTypes.string,
    stack: PropTypes.string,
    status: PropTypes.number,
    statusText: PropTypes.string,
  }),
  UserLogin: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
