import React, { memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { UserLogin } from "../../../redux/User/actions"

const Login = () => {
  const dispatch = useDispatch()
  const handleLogin = payload => dispatch(UserLogin(payload))
  return (
    <Jumbotron className="LoginFormContainer">
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
  )
}

Login.propTypes = {}

Login.defaultProps = {}

export default memo(Login)
