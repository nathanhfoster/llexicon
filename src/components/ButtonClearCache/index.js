import React, { useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { ResetRedux } from 'redux/App/actions'
import { clearReduxStoreFromLocalStorage } from 'redux/localState'
import { ConfirmAction } from 'components'
import { AstralTreeDB } from 'components/Persistor'
import { Button } from 'reactstrap'

export const ButtonClearCache = () => {
  const dispatch = useDispatch()
  const handleClearCache = useCallback(() => {
    AstralTreeDB.clear().then(() => {
      clearReduxStoreFromLocalStorage()
      dispatch(ResetRedux())
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(registrations => {
            for (let registration of registrations) {
              registration.unregister()
            }
            window.location.reload()
          })
          .catch(err => {
            console.log('Service Worker registration failed: ', err)
          })
      }
    })
  }, [])
  return (
    <ConfirmAction
      message='Are you sure you want to clear your cache? Everything will be erased.'
      onConfirm={handleClearCache}
      button={
        <Button color='danger'>
          <i className='fas fa-trash-alt mr-1' />
          Clear Cache
        </Button>
      }
    />
  )
}

ButtonClearCache.propTypes = {}

ButtonClearCache.defaultProps = {}

export default memo(ButtonClearCache)
