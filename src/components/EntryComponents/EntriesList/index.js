import React, { createRef, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import { BasicList, EntryMinimal } from '../..'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { GetUserEntries } from 'redux/Entries/actions'
import { SetMapBoundsCenterZoom } from 'redux/Map/actions'

const mapStateToProps = ({ Entries: { next, search }, Map: { hoveredChildKey } }, { entries }) => ({
  nextEntryPage: next,
  entriesSearch: search,
  scrollToItem: entries.findIndex(({ id }) => id == hoveredChildKey),
})

const mapDispatchToProps = {
  GetUserEntries,
  SetMapBoundsCenterZoom,
}

export class EntriesList extends PureComponent {
  debounceSetMap = createRef()

  componentWillUnmount() {
    const { SetMapBoundsCenterZoom } = this.props
    SetMapBoundsCenterZoom({ hoveredChildKey: null })
  }
  handleOnScrollToBottomOfListCallback = () => {
    const { entriesSearch, nextEntryPage, GetUserEntries } = this.props
    if (entriesSearch || !nextEntryPage) {
      return
    }

    const split = nextEntryPage.split(/\?page=(.*)/)
    const pageNumber = split[1]

    GetUserEntries(pageNumber)
  }

  renderMinimalEntries = ({ data, index, style, isScrolling }) => {
    const { scrollToItem, SetMapBoundsCenterZoom } = this.props
    const entry = data[index]
    const handleOnHover = () => {
      const { id, latitude, longitude } = entry

      let payload = { hoveredChildKey: id }
      if (latitude && longitude) {
        const center = { lat: latitude, lng: longitude }
        payload = {
          ...payload,
          center,
        }
      }
      clearTimeout(this.debounceSetMap)
      this.debounceSetMap = setTimeout(() => SetMapBoundsCenterZoom(payload), 150)
    }

    return (
      <Col
        key={entry.id}
        xs={12}
        className='fade-in px-0 py-1'
        style={style}
        onMouseEnter={handleOnHover}
        onFocus={handleOnHover}
      >
        <EntryMinimal {...entry} index={index} hover={index == scrollToItem} />
      </Col>
    )
  }
  render() {
    const { scrollToItem, height, width, itemSize, entries, ˇ } = this.props
    return (
      <BasicList
        height={height}
        width={width}
        list={entries}
        itemCount={entries.length}
        itemSize={itemSize}
        render={this.renderMinimalEntries}
        onScrollToBottomOfListCallback={this.handleOnScrollToBottomOfListCallback}
        scrollToItem={scrollToItem}
      />
    )
  }
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
