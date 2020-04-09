import React, { memo } from "react"
import { BasicFormInputsProps } from "../../../components/BasicForm/propTypes"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { UserLogin } from "../../../redux/User/actions"

const Login = ({ inputs }) => {
  const dispatch = useDispatch()
  const handleLogin = (payload) => dispatch(UserLogin(payload))

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

Login.propTypes = { inputs: BasicFormInputsProps }

Login.defaultProps = {
  inputs: [
    {
      label: "Username",
      type: "text",
      name: "username",
      placeholder: "Username...",
      required: true,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Password...",
      required: true,
    },
  ],
}

export default memo(Login)
