import PropTypes from "prop-types"

const EntryTagProps = PropTypes.shape({
  name: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.number),
})

const EntryTagsProps = PropTypes.arrayOf(EntryTagProps)

const EntryPersonProps = PropTypes.shape({
  name: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.number),
})

const EntryPeopleProps = PropTypes.arrayOf(EntryPersonProps)

const EntryFileProps = PropTypes.shape({
  id: PropTypes.number,
  file_type: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  url: PropTypes.string,
  date_created: PropTypes.string,
  date_updated: PropTypes.string,
  date_modified: PropTypes.string,
  entry_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
})

const EntryFilesProps = PropTypes.arrayOf(EntryFileProps)

const EntryRatingProps = PropTypes.oneOf([0, 1, 2, 3, 4, 5])

const EntryPropTypes = PropTypes.shape({
  size: PropTypes.number,
  author: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: EntryTagsProps,
  people: EntryPeopleProps,
  EntryFiles: EntryFilesProps,
  title: PropTypes.string,
  html: PropTypes.string,
  date_created: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  date_created_by_author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  date_updated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  views: PropTypes.number,
  rating: EntryRatingProps,
  address: PropTypes.string,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  is_public: PropTypes.bool,

  // Redux Only
  _shouldDelete: PropTypes.bool,
  _shouldPost: PropTypes.bool,
  _lastUpdated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
})

const EntriesPropTypes = PropTypes.arrayOf(EntryPropTypes)

export {
  EntryTagProps,
  EntryTagsProps,
  EntryPersonProps,
  EntryPeopleProps,
  EntryFileProps,
  EntryFilesProps,
  EntryRatingProps,
  EntryPropTypes,
  EntriesPropTypes,
}
