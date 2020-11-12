import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Button } from 'reactstrap'
import { ImportEntries, ButtonExportEntries } from 'components'
import { connect } from 'react-redux'

import { SyncEntries, GetAllUserEntryPages } from 'redux/Entries/actions'

const mapStateToProps = ({ User: { id } }) => ({
  userId: id,
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntryPages }

const ImportExportEntries = ({ userId, SyncEntries, GetAllUserEntryPages }) => {
  const GetAllEntries = useCallback(
    () => SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntryPages()))),
    [],
  )

  return (
    <ButtonGroup style={{ width: '100%' }} className='pb-1'>
      <Button color='accent' onClick={GetAllEntries} disabled={!userId}>
        <i className='fas fa-cloud-download-alt' /> Download and Sync
      </Button>
      <ImportEntries />
      <ButtonExportEntries />
    </ButtonGroup>
  )
}

ImportExportEntries.propTypes = {
  userId: PropTypes.number,
}

ImportExportEntries.defaultProps = { userId: null }

export default connect(mapStateToProps, mapDispatchToProps)(ImportExportEntries)
