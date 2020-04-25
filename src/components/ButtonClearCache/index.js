import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { UserLogout } from "../../redux/User/actions"
import { clearReduxStoreFromLocalStorage } from "../../redux/localState"
import { ConfirmAction } from "../"
import { Button } from "reactstrap"

const ButtonClearCache = () => {
  const dispatch = useDispatch()
  const handleClearCache = useCallback(() => {
    clearReduxStoreFromLocalStorage()
    dispatch(UserLogout())
  }, [])
  return (
    <ConfirmAction
      message="Are you sure you want to clear your cache? Everything will be erased."
      onConfirm={handleClearCache}
      button={
        <Button color="danger">
          <i className="fas fa-trash-alt mr-1" />
          Clear Cache
        </Button>
      }
    />
  )
}

ButtonClearCache.propTypes = {}

ButtonClearCache.defaultProps = {}

export default memo(ButtonClearCache)
