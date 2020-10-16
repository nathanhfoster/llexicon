import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { ClearEntries } from "redux/Entries/actions"
import { clearReduxStoreFromLocalStorage } from "redux/localState"
import { ConfirmAction } from "components"
import { Button } from "reactstrap"

const ButtonClearEntries = () => {
  const dispatch = useDispatch()
  const handleClearEntries = useCallback(() => {
    dispatch(ClearEntries())
  }, [])
  return (
    <ConfirmAction
      message="Are you sure you want to clear your entries?"
      onConfirm={handleClearEntries}
      button={
        <Button color="danger">
          <i className="fas fa-trash-alt mr-1" />
          Clear Entries
        </Button>
      }
    />
  )
}

ButtonClearEntries.propTypes = {}

ButtonClearEntries.defaultProps = {}

export default memo(ButtonClearEntries)
