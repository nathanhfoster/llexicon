import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { SelectEntries } from 'redux/Entries/actions'

const mapStateToProps = ({ Entries: { items, filteredItems } }, { entries }) => ({
  entries: entries || items.concat(filteredItems).filter(({ _isSelected }) => _isSelected),
})

const mapDispatchToProps = { SelectEntries }

const ButtonClearSelectedEntries = ({ entries, SelectEntries }) => {
  const handleShareEntries = useCallback(() => {
    SelectEntries([])
  }, [])
  return (
    <Button disabled={entries.length === 0} color='accent' onClick={handleShareEntries}>
      <i className={`fas fa-minus-square mr-1`} />
      Clear
    </Button>
  )
}

ButtonClearSelectedEntries.propTypes = {
  entries: EntriesPropTypes,
  UpdateReduxEntries: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
}

ButtonClearSelectedEntries.defaultProps = { entries: [] }

export default connect(mapStateToProps, mapDispatchToProps)(ButtonClearSelectedEntries)
