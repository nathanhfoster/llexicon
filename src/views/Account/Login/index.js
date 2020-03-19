import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { UserLogin } from "../../../redux/User/actions"

const Login = () => {
  const dispatch = useDispatch()
  const handleLogin = payload => dispatch(UserLogin(payload))
  const loginInputs = useMemo(
    () => [
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
    ],
    []
  )
  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Login"
        onSubmit={handleLogin}
        submitLabel="Login"
        inputs={loginInputs}
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

Login.propTypes = {}

Login.defaultProps = {}

export default memo(Login)
