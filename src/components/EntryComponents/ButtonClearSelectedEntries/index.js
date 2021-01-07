import React, { useMemo, useCallback } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { SelectReduxEntries } from 'redux/Entries/actions'
import { selectedEntriesSelector, selectedItemsAreEqual } from 'components/EntryComponents/utils'

const ButtonClearSelectedEntries = ({ entries: entriesFromProps }) => {
  const { entriesSelected } = useSelector(selectedEntriesSelector, selectedItemsAreEqual)
  const dispatch = useDispatch()

  const disabled = useMemo(() => (entriesFromProps || entriesSelected).length === 0, [
    entriesFromProps?.length,
    entriesSelected.length,
  ])

  const handleShareEntries = useCallback(() => {
    dispatch(SelectReduxEntries())
  }, [])

  return (
    <Button disabled={disabled} color='accent' onClick={handleShareEntries}>
      <i className={`fas fa-minus-square mr-1`} />
      Clear
    </Button>
  )
}

ButtonClearSelectedEntries.propTypes = {
  entries: EntriesPropTypes,
}

export default ButtonClearSelectedEntries
