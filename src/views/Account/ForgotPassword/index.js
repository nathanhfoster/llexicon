import React, { memo } from "react"
import { BasicFormProps } from "../../../components/BasicForm/propTypes"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { PasswordReset } from "../../../redux/User/actions"

const ForgotPassword = ({ inputs }) => {
  const dispatch = useDispatch()
  const handlePasswordReset = (payload) => dispatch(PasswordReset(payload))

  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Forgot password"
        onSubmit={handlePasswordReset}
        submitLabel="Request"
        inputs={inputs}
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

ForgotPassword.propTypes = { inputs: BasicFormProps }

ForgotPassword.defaultProps = {
  inputs: [
    {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Email...",
      required: true,
    },
  ],
}

export default memo(ForgotPassword)
