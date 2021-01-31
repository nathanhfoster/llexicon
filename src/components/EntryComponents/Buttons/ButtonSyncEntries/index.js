import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

import { connect } from 'react-redux'
import { SyncEntries, GetAllUserEntryPages } from 'redux/Entries/actions'

const mapStateToProps = ({ User: { id } }) => ({
  userId: id,
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntryPages }

const ButtonSyncEntries = ({ userId, SyncEntries, GetAllUserEntryPages }) => {
  const GetAllEntries = useCallback(
    () => SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntryPages()))),
    [],
  )

  return (
    <Button color='accent' onClick={GetAllEntries} disabled={!userId} title='Download and Sync'>
      <i className='fas fa-cloud-download-alt' />
    </Button>
  )
}

ButtonSyncEntries.propTypes = {
  userId: PropTypes.number,
}

ButtonSyncEntries.defaultProps = { userId: null }

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSyncEntries)
