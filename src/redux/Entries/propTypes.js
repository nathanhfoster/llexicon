import PropTypes from 'prop-types'

export const stringOrDatePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
])

export const EntryTagProps = PropTypes.shape({
  name: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.number),
})

export const EntryTagsProps = PropTypes.arrayOf(EntryTagProps)

export const EntryPersonProps = PropTypes.shape({
  name: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.number),
})

export const EntryPeopleProps = PropTypes.arrayOf(EntryPersonProps)

export const EntryFileProps = PropTypes.shape({
  id: PropTypes.number,
  file_type: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  url: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  date_modified: PropTypes.string,
  entry_id: PropTypes.number,
})

export const EntryFilesProps = PropTypes.arrayOf(EntryFileProps)

export const EntryRatingProps = PropTypes.oneOf([0, 1, 2, 3, 4, 5])

export const EntryPropType = {
  id: PropTypes.number,
  author: PropTypes.number,
  title: PropTypes.string,
  html: PropTypes.string,
  tags: EntryTagsProps,
  people: EntryPeopleProps,
  address: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  date_created: stringOrDatePropType,
  date_created_by_author: stringOrDatePropType,
  date_updated: stringOrDatePropType,
  views: PropTypes.number,
  rating: EntryRatingProps,
  EntryFiles: EntryFilesProps,
  is_public: PropTypes.bool,
  size: PropTypes.number,
  // Redux Only
  _size: PropTypes.number,
  _shouldDelete: PropTypes.bool,
  _shouldPost: PropTypes.bool,
  _lastUpdated: stringOrDatePropType,
  _image: PropTypes.string,
  _calendarDate: stringOrDatePropType,
}

export const EntryPropTypes = PropTypes.shape(EntryPropType)

export const EntriesPropTypes = PropTypes.arrayOf(EntryPropTypes)

export const TableColumnsPropType = PropTypes.arrayOf(PropTypes.oneOf(Object.keys(EntryPropType)))
