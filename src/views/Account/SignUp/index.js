import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { CreateUser, UserLogin } from "reducers//User/actions"

const mapStateToProps = ({ User: { error } }) => ({
  userError: error,
})

const mapDispatchToProps = {
  CreateUser,
  UserLogin,
}

const SignUp = ({ userError, CreateUser, UserLogin }) => {
  const errorMessage =
    userError && "Please confirm Username, Email, or Password"
  const handleSignUp = useCallback(async (payload) => {
    await CreateUser(payload)
    await UserLogin(payload)
  }, [])

  const isInvalid = useCallback((value) => {
    if (value && value.length < 3) {
      return "Required. 3 or more characters."
    } else {
      return false
    }
  }, [])

  const inputs = useMemo(
    () => [
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
    ],
    [errorMessage]
  )

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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
