import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { PasswordReset } from "../../../redux/User/actions"

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const handlePasswordReset = payload => dispatch(PasswordReset(payload))
  const forgotPasswordInputs = useMemo(
    () => [
      {
        label: "Email",
        type: "email",
        id: "email",
        placeholder: "Email...",
        required: true
      }
    ],
    []
  )
  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Forgot password"
        onSubmit={handlePasswordReset}
        submitLabel="Request"
        inputs={forgotPasswordInputs}
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

ForgotPassword.propTypes = {}

ForgotPassword.defaultProps = {}

export default memo(ForgotPassword)
