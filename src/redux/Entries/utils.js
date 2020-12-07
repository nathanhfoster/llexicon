import MomentJS from 'moment'
import { objectToArray, stringMatch, getStringBytes, getValidDate } from 'utils'
import { RouteMap } from 'redux/router/actions'

const LINK_TO_SIGN_UP = `${RouteMap.SIGNUP}`

const BASE_JOURNAL_ENTRY_ID = 'Entry-'

const NEW_ENTRY_ID = 'NewEntry'

const getReduxEntryId = () => `${BASE_JOURNAL_ENTRY_ID}${new Date().getTime()}`

const DEFAULT_JOUNRAL_ENTRY_ID = getReduxEntryId()

const getDate = ({ _lastUpdated, date_updated }) => _lastUpdated || date_updated

const getMostRecent = (reduxData, newData) => {
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
    hasValidDates && MomentJS(reduxDataLastUpdated).isBefore(newDataLastUpdated)

  if (overWriteWithNewData) {
    delete reduxData._lastUpdated
    delete newData._lastUpdated
    // delete reduxData._shouldDelete
    newItem = { ...reduxData, ...newData }
  }

  return { ...newItem, _size: getStringBytes(newItem) }
}

const mergeJson = (reduxData, newData, key = 'id') => {
  // Order matters. You want to merge the reduxData into the newData
  const allData = reduxData.concat(newData)
  let mergeMap = {}

  for (let i = 0, { length } = allData; i < length; i++) {
    const item = allData[i]
    const id = item[key]

    if (!mergeMap[id]) {
      mergeMap[id] = item
    } else {
      // Merge
      mergeMap[id] = getMostRecent(mergeMap[id], item)
    }
  }

  return objectToArray(mergeMap)
}

const tagOrPeopleMatch = (tagsOrPeople, search) =>
  tagsOrPeople.some(({ name }) => stringMatch(name, search))

const handleFilterEntries = (entries, search) => {
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

  return {
    filteredItems: cachedFilteredEntries,
    items: filteredEntries,
  }
}

const getTagStringFromObject = obj =>
  obj.reduce((acc, { name }, i, { length }) => {
    if (length === 1 || i === length - 1) {
      acc += name
    } else {
      acc += `${name},`
    }

    return acc
  }, '')

const getTagObjectFromString = s =>
  s.split(',').reduce((acc, name) => {
    if (name) {
      acc.push({ name })
    }
    return acc
  }, [])

const isReadOnly = (entryId, entryAuthor, userId) => {
  const entryIsStoredInTheBackend = !entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

  const userNotLoggedInButAuthorExistsAndEntryStoredInBackend =
    !userId && entryAuthor && entryIsStoredInTheBackend

  const userIsNotTheAuthor = entryAuthor && userId !== entryAuthor

  return Boolean(userNotLoggedInButAuthorExistsAndEntryStoredInBackend || userIsNotTheAuthor)
}

export {
  LINK_TO_SIGN_UP,
  BASE_JOURNAL_ENTRY_ID,
  NEW_ENTRY_ID,
  DEFAULT_JOUNRAL_ENTRY_ID,
  getReduxEntryId,
  mergeJson,
  handleFilterEntries,
  getTagStringFromObject,
  getTagObjectFromString,
  isReadOnly,
}
