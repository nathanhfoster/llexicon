import React, { useMemo, useCallback, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { SelectReduxEntries } from 'redux/Entries/actions'
import { selectedEntriesSelector, selectedItemsAreEqual } from 'redux/Entries/utils'

export const ButtonClearSelectedEntries = ({ entries: entriesFromProps }) => {
  const { entries } = useSelector(selectedEntriesSelector, selectedItemsAreEqual)
  const dispatch = useDispatch()

  const disabled = useMemo(() => (entriesFromProps || entries).length === 0, [
    entries,
    entriesFromProps,
  ])

  const handleShareEntries = useCallback(() => {
    dispatch(SelectReduxEntries())
  }, [dispatch])

  return (
    <Button disabled={disabled} color='accent' onClick={handleShareEntries}>
      <i className={`fas fa-minus-square mr-1`} />
    </Button>
  )
}

ButtonClearSelectedEntries.propTypes = {
  entries: EntriesPropTypes,
}

export default memo(ButtonClearSelectedEntries)
