import PropTypes from "prop-types"

const EntryTagProps = PropTypes.shape({
  title: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.number)
})

const EntryTagsProps = PropTypes.arrayOf(EntryTagProps)

const EntryFileProps = PropTypes.shape({
  id: PropTypes.number,
  file_type: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  url: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  date_modified: PropTypes.string,
  entry_id: PropTypes.number
})

const EntryFilesProps = PropTypes.arrayOf(EntryFileProps)

const EntryRatingProps = PropTypes.oneOf([0, 1, 2, 3, 4, 5])

const EntryPropTypes = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: EntryTagsProps,
  EntryFiles: EntryFilesProps,
  title: PropTypes.string,
  html: PropTypes.string,
  date_created: PropTypes.string,
  date_created_by_author: PropTypes.string,
  date_updated: PropTypes.string,
  views: PropTypes.number,
  rating: EntryRatingProps,
  address: PropTypes.string,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  author: PropTypes.number
})

const EntriesPropTypes = PropTypes.arrayOf(EntryPropTypes)

export {
  EntryTagProps,
  EntryTagsProps,
  EntryFileProps,
  EntryFilesProps,
  EntryRatingProps,
  EntryPropTypes,
  EntriesPropTypes
}
