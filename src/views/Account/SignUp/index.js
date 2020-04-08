import React, { memo } from "react"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { CreateUser } from "../../../redux/User/actions"

const SignUp = () => {
  const dispatch = useDispatch()
  const handleSignUp = (payload) => dispatch(CreateUser(payload))
  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Sign Up"
        onSubmit={handleSignUp}
        submitLabel="Sign Up"
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

export default memo(SignUp)
