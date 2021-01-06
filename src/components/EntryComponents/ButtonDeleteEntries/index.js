import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { ConfirmAction } from 'components'
import { Button } from 'reactstrap'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'

const mapStateToProps = (
  { Entries: { items, filteredItems, EntryTags, EntryPeople } },
  { entries },
) => ({
  entries: entries || items.concat(filteredItems).filter(({ _isSelected }) => _isSelected),
  items,
  filteredItems,
  EntryTags,
  EntryPeople,
})

const mapDispatchToProps = { UpdateReduxEntries, SyncEntries }

const ButtonDeleteEntries = ({ entries, UpdateReduxEntries, SyncEntries }) => {
  const handleDeleteEntries = useCallback(() => {
    const getUpdatedEntry = e => ({
      ...e,
      _shouldDelete: true,
      _shouldPost: false,
      _lastUpdated: null,
    })
    const payload =
      entries.length === 1
        ? getUpdatedEntry(entries[0])
        : entries.reduce((acc, e) => {
            acc[e.id] = getUpdatedEntry(e)
            return acc
          }, {})

    UpdateReduxEntries(payload, null)

    SyncEntries()
  }, [entries])

  const confirmationButton = useMemo(
    () => (
      <Button color='danger'>
        <i className='fas fa-trash-alt mr-1' />
        Delete
      </Button>
    ),
    [],
  )
  return (
    <ConfirmAction
      disabled={entries.length === 0}
      message={`Are you sure you want delete  ${
        entries.length === 1 ? 'this entry' : `these ${entries.length} entries`
      }?`}
      onConfirm={handleDeleteEntries}
      button={confirmationButton}
    />
  )
}

ButtonDeleteEntries.propTypes = {
  entries: EntriesPropTypes,
  UpdateReduxEntries: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
}

ButtonDeleteEntries.defaultProps = { entries: [] }

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteEntries)
