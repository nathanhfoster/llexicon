import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { BasicList } from '../..'
import EntryListItem from './EntryListItem'
import MomentJS from 'moment'
import { SetCalendarActiveEntry, ResetCalendarActiveEntry } from 'redux/Calendar/actions'
import './styles.css'

const listItemStyles = { padding: '2px 4px', color: 'white' }

const mapStateToProps = ({ Window: { innerHeight, navBarHeight, isMobile } }) => {
  const calendarTileHeight = innerHeight * 0.07 - 46 / 6
  const calendarHeight = 64 + 24 + calendarTileHeight * 6
  return {
    listHeight: isMobile
      ? innerHeight - navBarHeight - calendarHeight - 64 + 10
      : innerHeight - navBarHeight - 64 - 4,
  }
}

const EntryList = ({ entriesWithinView, activeDate, listHeight }) => {
  const entries = useMemo(
    () =>
      entriesWithinView
        .filter(entry => {
          const { date_created_by_author, _shouldDelete } = entry
          const date = MomentJS(activeDate)
          const startDate = MomentJS(date_created_by_author)
          const sameDayEvent = startDate.isSame(date, 'day')
          return !_shouldDelete && sameDayEvent
        })
        .map((e, i) => {
          return {
            id: e.id,
            value: <EntryListItem key={e.id} {...e} />,
          }
        }),
    [entriesWithinView, activeDate],
  )

  return (
    <BasicList list={entries} height={listHeight} itemSize={92} listItemStyles={listItemStyles} />
  )
}

EntryList.propTypes = {
  activeDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  entriesWithinView: EntriesPropTypes,
}

export default connect(mapStateToProps)(EntryList)
