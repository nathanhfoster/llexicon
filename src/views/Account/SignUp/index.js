import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { CreateUser } from "../../../redux/User/actions"

const mapStateToProps = ({ User: { error } }) => ({
  userError: error,
})

const mapDispatchToProps = {
  CreateUser,
}

const SignUp = ({ userError, CreateUser }) => {
  const errorMessage =
    userError && "Please confirm Username, Email, or Password"
  const handleSignUp = useCallback((payload) => CreateUser(payload), [])

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
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Email...",
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
      // defaultValue: true,
    },
  ]

  return (
    <Jumbotron className="LoginFormContainer">
      <BasicForm
        title="Sign Up"
        onSubmit={handleSignUp}
        submitLabel="Sign Up"
        inputs={inputs}
      />
      <FacebookGoogleLogin />
    </Jumbotron>
  )
}

SignUp.propTypes = {
  userError: PropTypes.shape({
    message: PropTypes.string,
    name: PropTypes.string,
    stack: PropTypes.string,
    status: PropTypes.number,
    statusText: PropTypes.string,
  }),
  CreateUser: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(SignUp)
