import React, { useCallback, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Jumbotron } from 'reactstrap'
import { BasicForm, FacebookGoogleLogin } from 'components'
import { PasswordReset } from 'redux/User/actions'

const mapStateToProps = ({ User: { error, pending } }) => ({
  userError: error,
  userPending: pending,
})

const mapDispatchToProps = {
  PasswordReset,
}

const ForgotPassword = ({ userError, userPending, PasswordReset }) => {
  const errorMessage = userError && 'Please confirm email'
  const handlePasswordReset = useCallback(payload => PasswordReset(payload), [])

  const isInvalid = useCallback(value => {
    if (value && value.length < 3) {
      return 'Required. 3 or more characters.'
    } else {
      return false
    }
  }, [])

  const inputs = useMemo(
    () => [
      {
        label: 'Email',
        type: 'email',
        name: 'email',
        placeholder: 'Email...',
        required: true,
        invalid: errorMessage,
        isInvalid,
      },
    ],
    [userError],
  )

  const formSubmitLabel = useMemo(
    () => (
      <Fragment>
        {userPending && <i className={`fas fa-sun SunIcon`} />}
        <span className='ml-1'>Request</span>
      </Fragment>
    ),
    [userPending],
  )

  return (
    <Jumbotron className='LoginFormContainer'>
      <BasicForm
        title='Forgot password'
        onSubmit={handlePasswordReset}
        submitLabel={formSubmitLabel}
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
