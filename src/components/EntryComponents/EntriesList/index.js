import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import { BasicList, EntryMinimal } from '../..'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { GetUserEntries } from 'redux/Entries/actions'
import { SetMapBoundsCenterZoom } from 'redux/Map/actions'

const mapStateToProps = ({ Entries: { next, search } }) => ({
  nextEntryPage: next,
  entriesSearch: search,
})

const mapDispatchToProps = {
  GetUserEntries,
  SetMapBoundsCenterZoom,
}

export const EntriesList = ({
  nextEntryPage,
  entriesSearch,
  height,
  width,
  itemSize,
  entries,
  GetUserEntries,
  SetMapBoundsCenterZoom,
  ˇ,
}) => {
  const handleOnScrollToBottomOfListCallback = useCallback(() => {
    if (entriesSearch || !nextEntryPage) {
      return
    }

    const split = nextEntryPage.split(/\?page=(.*)/)
    const pageNumber = split[1]

    GetUserEntries(pageNumber)
  }, [entriesSearch, nextEntryPage])

  const renderMinimalEntries = useCallback(({ data, index, style, isScrolling }) => {
    const entry = data[index]
    const handleOnHover = () => {
      const { id, latitude, longitude } = entry
      const center = { lat: latitude, lng: longitude }
      SetMapBoundsCenterZoom({ hoveredChildKey: id, center, zoom: 16 })
    }
    return (
      <Col
        key={entry.id}
        xs={12}
        className='fade-in px-0 py-1'
        style={style}
        onMouseEnter={handleOnHover}
      >
        <EntryMinimal {...entry} />
      </Col>
    )
  }, [])

  return (
    <BasicList
      height={height}
      width={width}
      list={entries}
      itemCount={entries.length}
      itemSize={itemSize}
      render={renderMinimalEntries}
      onScrollToBottomOfListCallback={handleOnScrollToBottomOfListCallback}
    />
  )
}

EntriesList.propTypes = {
  entries: EntriesPropTypes,
  height: PropTypes.number.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  GetUserEntries: PropTypes.func.isRequired,
  SetMapBoundsCenterZoom: PropTypes.func.isRequired,
}

EntriesList.defaultProps = {
  height: 500,
  width: '100%',
  itemSize: 180,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntriesList)
