import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { EntryPropType } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { GoToEntryDetail } from 'redux/router/actions'
import { SetCalendarActiveEntry, ResetCalendarActiveEntry } from 'redux/Calendar/actions'
import Star from '../../../BackgroundImage/Star'
import TagsContainer from '../../TagsContainer'
import { IMAGE_REGEX } from 'utils'

const mapStateToProps = ({ Calendar: { activeDate, view, activeEntry } }, { id }) => {
  return { activeDate, view, isSelected: activeEntry == id }
}

const mapDispatchToProps = { SetCalendarActiveEntry, ResetCalendarActiveEntry }

const EntryListItem = ({
  activeDate,
  view,
  isSelected,
  SetCalendarActiveEntry,
  ResetCalendarActiveEntry,
  ...entryProps
}) => {
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
    EntryFiles,
  } = entryProps

  const foundFile = useMemo(() => EntryFiles.find(({ entry_id, url }) => url), [EntryFiles])

  const foundImageRegex = useMemo(() => {
    if (IMAGE_REGEX.test(html)) {
      IMAGE_REGEX.lastIndex = 0
      let iterator
      while ((iterator = IMAGE_REGEX.exec(html))) {
        if (foundImageRegex) break
        const { 0: image, 1: src, groups, index, input, length } = iterator
        return src
      }
    }
    return null
  }, [html])

  const showImageIcon = EntryFiles.length > 0 || foundImageRegex

  const handleOnClick = () => {
    GoToEntryDetail(id)
  }

  const handleOnMouseEnter = () => {
    SetCalendarActiveEntry({
      ...entryProps,
      _image: foundImageRegex || foundFile?.url,
      _calendarDate: new Date(activeDate),
      // _calendarView: view,
    })
  }
  const handleOnMouseLeave = () => {
    ResetCalendarActiveEntry()
  }

  return (
    <div
      onClick={handleOnClick}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className='listItem'
      title={title}
    >
      <div className='Overflow eventTitle'>
        <Star size={8} color='PurpleWhite' animation={false} opacity={1} />
        <span className='ml-1'>{title || 'No title'}</span>
      </div>

      <div className='Overflow eventDate'>
        {showImageIcon && <i className='fas fa-image mr-1' />}
        <Moment format='h:mma'>{date_created_by_author}</Moment>
      </div>

      <TagsContainer tags={tags} />
      <TagsContainer tags={people} emptyString='No people...' faIcon='fas fa-user' />
    </div>
  )
}

EntryListItem.propTypes = {
  activeDate: PropTypes.instanceOf(Date),
  view: PropTypes.string,
  isSelected: PropTypes.bool,
  SetCalendarActiveEntry: PropTypes.func.isRequired,
  ResetCalendarActiveEntry: PropTypes.func.isRequired,
  ...EntryPropType,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryListItem)
