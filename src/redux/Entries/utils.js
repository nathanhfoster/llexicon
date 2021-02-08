import MomentJS from 'moment'
import {
  objectToArray,
  stringMatch,
  getStringBytes,
  getValidDate,
  jsonParseDates,
  isType,
} from 'utils'
import { RouteMap } from 'redux/router/actions'
import * as AwsImages from '../../images/AWS'
import { EntryPropType } from './propTypes'

export const DEFAULT_TABLE_COLUMNS = [
  'title',
  'html',
  'tags',
  'people',
  'address',
  'date_created_by_author',
  'date_updated',
  'views',
  'rating',
  'EntryFiles',
  'is_public',
  'id',
]

export const LINK_TO_SIGN_UP = `${RouteMap.SIGNUP}`

export const BASE_JOURNAL_ENTRY_ID = 'Entry-'

export const NEW_ENTRY_ID = 'NewEntry'

export const getReduxEntryId = () => `${BASE_JOURNAL_ENTRY_ID}${new Date().getTime()}`

export const DEFAULT_JOUNRAL_ENTRY_ID = getReduxEntryId()

export const getDate = ({ _lastUpdated, date_updated }) => _lastUpdated || date_updated

export const getMostRecent = (reduxData, newData) => {
  let newItem = { ...newData, ...reduxData }

  if (newData.views > reduxData.views) {
    newItem = { ...newItem, views: newData.views }
  }

  const reduxDataLastUpdated = getDate(reduxData)
  const newDataLastUpdated = getDate(newData)

  const hasValidDates = newDataLastUpdated && reduxDataLastUpdated

  const areUpdatedOnTheSameDay =
    hasValidDates && MomentJS(reduxDataLastUpdated).isSame(newDataLastUpdated)

  if (areUpdatedOnTheSameDay) {
    delete reduxData._lastUpdated
    delete newData._lastUpdated
  }

  const overWriteWithNewData =
    (hasValidDates && !reduxData.id) || MomentJS(reduxDataLastUpdated).isBefore(newDataLastUpdated)

  if (overWriteWithNewData) {
    delete reduxData._lastUpdated
    delete newData._lastUpdated
    // delete reduxData._shouldDelete
    newItem = { ...reduxData, ...newData }
  }

  return { ...newItem, _size: getStringBytes(newItem) }
}

export const mergeJson = (reduxData, newData, key = 'id') => {
  // Order matters. You want to merge the reduxData into the newData
  const allData = reduxData.concat(newData)
  let mergeMap = {}

  for (let i = 0, { length } = allData; i < length; i++) {
    const item = allData[i]
    const id = item[key]
    if (!id) {
      item[key] = getReduxEntryId()
    }

    if (!mergeMap[id]) {
      mergeMap[id] = item
    } else {
      // Merge
      mergeMap[id] = getMostRecent(mergeMap[id], item)
    }
  }

  return objectToArray(mergeMap)
}

export const tagOrPeopleMatch = (tagsOrPeople = [], search) =>
  tagsOrPeople?.some(({ name }) => stringMatch(name, search))

export const handleFilterEntries = (entries, search) => {
  if (!search) return { items: entries, filteredItems: [] }
  let cachedFilteredEntries = []

  const filteredEntries = entries.filter(item => {
    const { title, html, tags, people, address } = item

    if (
      tagOrPeopleMatch(tags, search) ||
      tagOrPeopleMatch(people, search) ||
      stringMatch(title, search) ||
      stringMatch(html, search) ||
      stringMatch(address, search)
    ) {
      return true
    } else {
      cachedFilteredEntries.push(item)
      return false
    }
  })

  return { items: filteredEntries, filteredItems: cachedFilteredEntries }
}

export const getStringFromObject = (obj, key = 'name') => {
  if (!Array.isArray(obj)) return obj
  return obj.reduce((acc, e, i, { length }) => {
    const value = e[key]
    if (length === 1 || i === length - 1) {
      acc += value
    } else {
      acc += `${value},`
    }

    return acc
  }, '')
}

export const getObjectFromString = (s, key = 'name') => {
  if (typeof s !== isType.STRING || !s) return s
  return s.split(',').reduce((acc, name) => {
    if (name) {
      acc.push({ [key]: name })
    }
    return acc
  }, [])
}

export const getTagStringFromObject = tagOrPeople => getStringFromObject(tagOrPeople)

export const getTagObjectFromString = s => getObjectFromString(s)

export const isReadOnly = (entryId, entryAuthor, userId) => {
  if (!entryId) return true
  const entryIsStoredInTheBackend = !entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

  const userNotLoggedInButAuthorExistsAndEntryStoredInBackend =
    !userId && entryAuthor && entryIsStoredInTheBackend

  const userIsNotTheAuthor = entryAuthor && userId !== entryAuthor

  return Boolean(userNotLoggedInButAuthorExistsAndEntryStoredInBackend || userIsNotTheAuthor)
}

export const { ...entryFiles } = AwsImages

export const DEFAULT_ENTRY_FILES = Object.keys(entryFiles).map((name, id) => ({
  id,
  file_type: 'image/jpeg',
  name,
  size: 870,
  url: entryFiles[name],
  entry_id: `${DEFAULT_JOUNRAL_ENTRY_ID}-${id}`,
}))

export const defaultEntry = {
  author: null,
  id: DEFAULT_JOUNRAL_ENTRY_ID,
  tags: [
    {
      name: 'Excited',
    },
    {
      name: 'Inspired',
    },
  ],
  people: [
    {
      name: 'Me',
    },
  ],
  EntryFiles: DEFAULT_ENTRY_FILES,
  title: 'My First Journal Entry',
  html: `<p class="ql-align-center"><img src="${entryFiles.Logo}" width="140"></p><br><p>After I've installed Astral Tree today, I will make a diary entry every day from now on. In case I forget to make an entry, the app will remind me with a notification in the evening. Besides pictures, videos, audio recordings or other files, I can add a location, tags or people to my journal entries.</p><p><br></p><p>If I <a href="${LINK_TO_SIGN_UP}" rel="noopener noreferrer" target="_blank">sign up</a>, my journal entries will be synced across all my devices. I am already looking forward to revisiting all those memories in a few months or years.</p>`,
  date_created: new Date(),
  date_created_by_author: new Date(),
  date_updated: new Date(),
  views: 0,
  rating: 5,
  address: null,
  latitude: null,
  longitude: null,
  is_public: false,

  // Redux Only
  _shouldDelete: false,
  _shouldPost: true,
  _lastUpdated: null,
}

export const FIRST_JOUNRAL_ENTRY = {
  ...defaultEntry,
  _size: getStringBytes(defaultEntry),
}

export const entryTagOrPeopleTransform = (tagsOrPeople, shouldExport = true) => {
  if (shouldExport) {
    return getTagStringFromObject(tagsOrPeople)
  }
  return getTagObjectFromString(tagsOrPeople)
}

export const entryDateTransform = date => getValidDate(date)

export const arrayOfObjectsTransform = (EntryFiles, shouldExport = true) => {
  if (shouldExport) {
    return JSON.stringify(EntryFiles)
  }
  return JSON.parse(EntryFiles || '[]', jsonParseDates)
}

export const stringToIntegerTransform = (s, shouldExport = true) => {
  if (shouldExport) {
    return `${s}`
  }
  const int = parseInt(s)

  if(isNaN(int)) {
    return s
  }

  return int
}

export const stringToFloatTransform = (s, shouldExport = true) => {
  if (shouldExport) {
    return `${s}`
  }
  const float = parseFloat(s)

  return float
}

export const stringToBoolTransform = (s, shouldExport = true) => {
  if (shouldExport) {
    if (s === true) return 'true'
    return 'false'
  }

  if (s === true) return true
  if (s === 'true') return true
  return false
}

export const entryKeyTransform = Object.keys(EntryPropType).map(key => {
  let entryTransform = { key }

  switch (key) {
    case 'id':
    case 'author':
    case 'views':
    case 'rating':
    case 'size':
    case '_size':
      entryTransform.transform = stringToIntegerTransform
      break
    case 'latitude':
    case 'longitude':
      entryTransform.transform = stringToFloatTransform
      break
    case 'is_public':
    case '_shouldDelete':
    case '_shouldPost':
      entryTransform.transform = stringToBoolTransform
      break
    case 'tags':
    case 'people':
      entryTransform.transform = entryTagOrPeopleTransform
      break
    case 'date_created':
    case 'date_created_by_author':
    case 'date_updated':
    case '_lastUpdated':
    case '_calendarDate':
      entryTransform.transform = entryDateTransform
      break
    case 'EntryFiles':
      entryTransform.transform = arrayOfObjectsTransform
      break

    default:
      entryTransform.transform = e => e
  }

  return entryTransform
})

export const getEntryTransform = (entry, returnObject = true, shouldExport = true) =>
  entryKeyTransform.reduce(
    (acc, { key, transform }) => {
      const newEntryKey = transform(entry[key], shouldExport)
      if (returnObject) {
        acc[key] = newEntryKey
      } else {
        acc.push(newEntryKey)
      }
      return acc
    },
    returnObject ? {} : [],
  )

export const selectedEntriesSelector = ({
  Entries: { items, filteredItems, selectedItemsMap, showOnlyPublic },
}) => ({
  entries: (filteredItems.length > 0 ? items.concat(filteredItems) : items).filter(
    ({ id, is_public, _shouldDelete }) =>
      (showOnlyPublic ? is_public && !_shouldDelete : !_shouldDelete) && selectedItemsMap[id],
  ),
  selectedItemsMap,
})

export const selectedItemsAreEqual = (
  { selectedItemsMap: prevSelectedItems },
  { selectedItemsMap: nextSelectedItems },
) => Object.keys(prevSelectedItems).length === Object.keys(nextSelectedItems).length

export const allEntriesSelector = ({ Entries: { items, filteredItems } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
})

export const allItemsAreEqual = (
  { entries: prevEntriesSelected },
  { entries: nextEntriesSelected },
) => prevEntriesSelected === nextEntriesSelected

export const findOneEntrySelector = entryId => ({ Entries: { items, filteredItems } }) => ({
  entry: (filteredItems.length > 0 ? items.concat(filteredItems) : items).find(
    ({ id }) => id === entryId,
  ),
})

export const findOneEntryAreEqual = ({ entry: prevEntrySelected }, { entry: nextEntrySelected }) =>
  prevEntrySelected === nextEntrySelected
