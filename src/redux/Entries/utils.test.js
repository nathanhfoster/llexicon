import {
  getEntryTransform,
  entryTagOrPeopleTransform,
  entryDateTransform,
  arrayOfObjectsTransform,
  stringToIntegerTransform,
  stringToFloatTransform,
  stringToBoolTransform,
} from './utils'
import { mockEntriesWithBadData } from 'redux/testUtils'

describe('Redux Entries utils', () => {
  const expectedExportedFormat = mockEntriesWithBadData.map(
    ({
      id,
      author,
      latitude,
      longitude,
      views,
      rating,
      size,
      _size,
      is_public,
      _shouldDelete,
      _shouldPost,
      tags,
      people,
      date_created,
      date_created_by_author,
      date_updated,
      _lastUpdated,
      _calendarDate,
      EntryFiles,
      ...restOfProps
    }) => ({
      id: stringToIntegerTransform(id),
      author: stringToIntegerTransform(author),
      latitude: stringToFloatTransform(latitude),
      longitude: stringToFloatTransform(longitude),
      views: stringToIntegerTransform(views),
      rating: stringToIntegerTransform(rating),
      size: stringToIntegerTransform(size),
      _size: stringToIntegerTransform(_size),
      is_public: stringToBoolTransform(is_public),
      _shouldDelete: stringToBoolTransform(_shouldDelete),
      _shouldPost: stringToBoolTransform(_shouldPost),
      tags: entryTagOrPeopleTransform(tags),
      people: entryTagOrPeopleTransform(people),
      date_created: entryDateTransform(date_created),
      date_created_by_author: entryDateTransform(date_created_by_author),
      date_updated: entryDateTransform(date_updated),
      _lastUpdated: entryDateTransform(_lastUpdated),
      _calendarDate: entryDateTransform(_calendarDate),
      EntryFiles: arrayOfObjectsTransform(EntryFiles),
      ...restOfProps,
    }),
  )
  it('should export entries in the right format', () => {
    const exportedEntries = mockEntriesWithBadData.map(e => getEntryTransform(e))
    expect(exportedEntries).toMatchObject(expectedExportedFormat)
  })

  it('should import entries in the right format', () => {
    const expectedImportedFormat = mockEntriesWithBadData.map(
      ({
        id,
        author,
        latitude,
        longitude,
        views,
        rating,
        size,
        _size,
        is_public,
        _shouldDelete,
        _shouldPost,
        tags,
        people,
        date_created,
        date_created_by_author,
        date_updated,
        _lastUpdated,
        _calendarDate,
        EntryFiles,
        ...restOfEntryProps
      }) => {
        const stringifiedEntryFiles = JSON.stringify(EntryFiles)
        return {
          id: stringToIntegerTransform(id, false),
          author: stringToIntegerTransform(author, false),
          latitude: stringToFloatTransform(latitude, false),
          longitude: stringToFloatTransform(longitude, false),
          views: stringToIntegerTransform(views, false),
          rating: stringToIntegerTransform(rating, false),
          size: stringToIntegerTransform(size, false),
          _size: stringToIntegerTransform(_size, false),
          is_public: stringToBoolTransform(is_public, false),
          _shouldDelete: stringToBoolTransform(_shouldDelete, false),
          _shouldPost: stringToBoolTransform(_shouldPost, false),
          tags: entryTagOrPeopleTransform(tags, false),
          people: entryTagOrPeopleTransform(people, false),
          date_created: entryDateTransform(date_created, false),
          date_created_by_author: entryDateTransform(date_created_by_author, false),
          date_updated: entryDateTransform(date_updated, false),
          _lastUpdated: entryDateTransform(_lastUpdated, false),
          _calendarDate: entryDateTransform(_calendarDate, false),
          EntryFiles: arrayOfObjectsTransform(stringifiedEntryFiles, false),
          ...restOfEntryProps,
        }
      },
    )
    const importedEntries = expectedExportedFormat.map(e => getEntryTransform(e, true, false))
    expect(importedEntries).toMatchObject(expectedImportedFormat)
  })
})
