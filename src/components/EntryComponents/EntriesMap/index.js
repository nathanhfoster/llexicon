import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BasicMap, EntriesList } from 'components'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { SetEditorState } from 'redux/TextEditor/actions'
import { RouteMap, RouterPush, GoToEntryDetail } from 'redux/router/actions'
import { Container, Row, Col } from 'reactstrap'
import createClusters from 'components/BasicComponents/BasicMap/functions/createClusters'
import formatLocations from 'components/BasicComponents/BasicMap/functions/formatLocations'

const mapStateToProps = ({
  Entries: { items, showOnlyPublic },
  Map: { bounds, center, zoom },
}) => ({
  entries: items,
  showOnlyPublic,
  bounds,
  center,
  zoom,
})

const mapDispatchToProps = {
  SetEditorState,
}

export const EntriesMap = ({ entries, showOnlyPublic, height, center, bounds, zoom }) => {
  const viewableEntries = useMemo(
    () =>
      entries.filter(({ _shouldDelete, is_public }) =>
        showOnlyPublic ? is_public : !_shouldDelete,
      ),
    [entries, showOnlyPublic],
  )

  const entriesInMapView = useMemo(() => {
    const formattedLocations = formatLocations(viewableEntries)
    const clusters = createClusters(formattedLocations, {
      center,
      bounds,
      zoom,
    })
    const entries = clusters.map(({ points }) => points).flat(1)
    return entries
  }, [viewableEntries, center, bounds, zoom])

  const handleOnChange = useCallback(({ entryId, address, latitude, longitude }) => {
    if (!entryId) return
    else {
      SetEditorState({
        id: entryId,
        title: '',
        address,
        latitude,
        longitude,
      })
      if (entryId === 'MyLocation') {
        return RouterPush(RouteMap.NEW_ENTRY)
      } else {
        return GoToEntryDetail(entryId)
      }
    }
  }, [])

  return (
    <Container fluid className='Container'>
      <Row>
        <Col className='p-0' xs={{ size: 12, order: 2 }} md={{ size: 3, order: 1 }}>
          <EntriesList height={height} entries={entriesInMapView} />
        </Col>
        <Col className='p-0' xs={{ size: 12, order: 1 }} md={{ size: 9, order: 2 }}>
          <BasicMap
            showList
            height={height}
            getAddressOnMarkerClick
            locations={viewableEntries}
            onChange={handleOnChange}
          />
        </Col>
      </Row>
    </Container>
  )
}

EntriesMap.propTypes = {
  entries: EntryPropTypes,
  height: PropTypes.number.isRequired,
  SetEditorState: PropTypes.func.isRequired,
}

EntryPropTypes.defaultProps = {
  height: 500,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntriesMap)
