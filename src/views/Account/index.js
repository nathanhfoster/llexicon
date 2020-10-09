import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { BasicTabs } from '../../components'
import { RouterPush, RouteMap } from '../../redux/router/actions'
import Login from './Login'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import { ResetUserError } from '../../redux/User/actions'
import './styles.css'

const { LOGIN, SIGNUP, PASSWORD_RESET } = RouteMap

const Account = ({ location: { pathname } }) => {
  const dispatch = useDispatch()
  const activeTab = pathname

  const handleTabChange = tabId => {
    RouterPush(tabId)
    dispatch(ResetUserError())
  }

  const tabs = [
    {
      tabId: LOGIN,
      title: 'Login',
      render: <Login />,
      onClick: handleTabChange,
    },
    {
      tabId: SIGNUP,
      title: 'Sign up',
      render: <SignUp />,
      onClick: handleTabChange,
    },
    {
      tabId: PASSWORD_RESET,
      title: 'Forgot password',
      render: <ForgotPassword />,
      onClick: handleTabChange,
    },
  ]

  return <BasicTabs className='Account' activeTab={activeTab} tabs={tabs} />
}

Account.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default memo(Account)
