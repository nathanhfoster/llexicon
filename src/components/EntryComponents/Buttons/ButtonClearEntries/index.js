import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { ClearEntries } from 'redux/Entries/actions'
import { ConfirmAction } from 'components'
import { Button } from 'reactstrap'

export const ButtonClearEntries = () => {
  const dispatch = useDispatch()
  const handleClearEntries = useCallback(() => {
    dispatch(ClearEntries())
  }, [])
  return (
    <ConfirmAction
      message='Are you sure you want to clear your local entries entries?'
      onConfirm={handleClearEntries}
      button={
        <Button color='danger' title='Clear Entries'>
          <i className='fas fa-trash-alt mr-1' />
          <i className='fas fa-feather-alt' />
        </Button>
      }
    />
  )
}

export default ButtonClearEntries
