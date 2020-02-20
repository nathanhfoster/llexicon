import React, { memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { CreateUser } from "../../../redux/User/actions"

const SignUp = () => {
  const dispatch = useDispatch()
  const handleSignUp = payload => dispatch(CreateUser(payload))
  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Sign Up"
        onSubmit={payload => handleSignUp(payload)}
        submitLabel="Sign Up"
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

SignUp.propTypes = {}

SignUp.defaultProps = {}

export default memo(SignUp)
