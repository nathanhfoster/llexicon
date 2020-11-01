import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap'
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
    <Container fluid>
      <Row className='py-2'>
        <Col xs={12} tag={ButtonGroup} className='p-0'>
          <Button color='accent' onClick={GetAllEntries} disabled={!userId}>
            <i className='fas fa-cloud-download-alt' /> Download and Sync All Entries
          </Button>
          <ImportEntries />
          <ButtonExportEntries />
        </Col>
      </Row>
    </Container>
  )
}

ImportExportEntries.propTypes = {
  userId: PropTypes.number,
}

ImportExportEntries.defaultProps = { userId: null }

export default connect(mapStateToProps, mapDispatchToProps)(ImportExportEntries)
