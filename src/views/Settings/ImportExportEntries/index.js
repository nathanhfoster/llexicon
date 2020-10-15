import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap'
import { ImportEntries } from 'components'
import { connect as reduxConnect } from 'react-redux'
import { copyStringToClipboard, loadJSON, exportJSON } from 'utils'
import {
  SyncEntries,
  GetAllUserEntries,
  GetAllUserEntryPages,
} from '../../../redux/Entries/actions'
import MomentJs from 'moment'

const mapStateToProps = ({ User: { id }, Entries: { items, filteredItems } }) => ({
  userIsLoggedIn: !!id,
  items,
  filteredItems,
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntryPages }

const ImportExportEntries = ({
  userIsLoggedIn,
  items,
  filteredItems,
  SyncEntries,
  GetAllUserEntryPages,
}) => {
  const entries = items.concat(filteredItems)
  const totalEntries = entries.length

  const GetAllEntries = useCallback(
    () => SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntryPages()))),
    [],
  )

  const handleExportEntries = () => {
    const formattedEntries = entries.map((entry, i) => {
      const {
        id,
        author,
        tags,
        people,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views,
        latitude,
        longitude,
        EntryFiles,
        ...restOfProps
      } = entry
      const dateFormat = 'YYYY-MM-DD hh:mm:ss'

      return {
        id,
        author,
        tags: tags.reduce((tagString, tag) => (tagString += `${tag.name},`), ''),
        people: people.reduce((peopleString, person) => (peopleString += `${person.name},`), ''),
        title,
        html,
        date_created: MomentJs(date_created).format(dateFormat),
        date_created_by_author: MomentJs(date_created_by_author).format(dateFormat),
        date_updated: MomentJs(date_updated).format(dateFormat),
        views,
        latitude,
        longitude,
        EntryFiles,
        ...restOfProps
      }
    })

    exportJSON(formattedEntries)
  }

  return (
    <Container fluid>
      <Row className='py-2'>
        <Col xs={12} tag={ButtonGroup} className='p-0'>
          <Button color='accent' onClick={GetAllEntries} disabled={!userIsLoggedIn}>
            <i className='fas fa-cloud-download-alt' /> Download and Sync All Entries
          </Button>
          <ImportEntries />
          <Button color='accent' onClick={handleExportEntries} disabled={totalEntries === 0}>
            <i className='fas fa-file-export' /> Export Entries
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

ImportExportEntries.propTypes = {
  userIsLoggedIn: PropTypes.bool.isRequired,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

ImportExportEntries.defaultProps = { userIsLoggedIn: false }

export default reduxConnect(mapStateToProps, mapDispatchToProps)(ImportExportEntries)
