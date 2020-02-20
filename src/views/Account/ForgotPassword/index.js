import React, { memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { PasswordReset } from "../../../redux/User/actions"

const Login = () => {
  const dispatch = useDispatch()
  const handlePasswordReset = payload => dispatch(PasswordReset(payload))
  return (
    <Jumbotron className="LoginFormContainer">
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
  )
}

Login.propTypes = {}

Login.defaultProps = {}

export default memo(Login)
