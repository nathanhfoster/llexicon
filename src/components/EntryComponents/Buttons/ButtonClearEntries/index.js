import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { ClearEntries } from 'redux/Entries/actions'
import { ConfirmAction } from 'components'
import { Button } from 'reactstrap'

const ButtonClearEntries = () => {
  const dispatch = useDispatch()
  const handleClearEntries = useCallback(() => {
    dispatch(ClearEntries())
  }, [])
  return (
    <ConfirmAction
      message='Are you sure you want to clear your entries?'
      onConfirm={handleClearEntries}
      button={
        <Button color='danger'>
          <i className='fas fa-trash-alt mr-1' />
          Clear Entries
        </Button>
      }
    />
  )
}

export default ButtonClearEntries
