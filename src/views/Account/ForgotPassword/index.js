import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import { Jumbotron } from "reactstrap"
import { BasicForm, FacebookGoogleLogin } from "../../../components"
import { PasswordReset } from "../../../redux/User/actions"

const mapStateToProps = ({ User: { error } }) => ({
  userError: error,
})

const mapDispatchToProps = {
  PasswordReset,
}

const ForgotPassword = ({ userError, PasswordReset }) => {
  const errorMessage = userError && "Please confirm email"
  const handlePasswordReset = useCallback(
    (payload) => PasswordReset(payload),
    []
  )

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
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "Email...",
        required: true,
        invalid: errorMessage,
        isInvalid,
      },
    ],
    [userError]
  )

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

ForgotPassword.propTypes = {
  userError: PropTypes.shape({
    message: PropTypes.string,
    name: PropTypes.string,
    stack: PropTypes.string,
    status: PropTypes.number,
    statusText: PropTypes.string,
  }),
  PasswordReset: PropTypes.func.isRequired,
}

ForgotPassword.defaultProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
