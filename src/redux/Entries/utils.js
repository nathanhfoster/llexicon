import { objectToArray, stringMatch, getStringBytes } from 'utils'
import { RouteMap } from 'redux/router/actions'

const LINK_TO_SIGN_UP = `${RouteMap.SIGNUP}`

const BASE_JOURNAL_ENTRY_ID = 'Entry'

const getReduxEntryId = id => `${BASE_JOURNAL_ENTRY_ID}-${id}`

const DEFAULT_JOUNRAL_ENTRY_ID = getReduxEntryId(0)

const getMostRecent = (reduxData, newData) => {
  let newItem = { ...newData, ...reduxData }
  const reduxDataLastUpdated = new Date(reduxData._lastUpdated || reduxData.date_updated || 0)
  const newDataLastUpdated = new Date(newData._lastUpdated || newData.date_updated || 0)
  const overWriteWithNewData = newDataLastUpdated - reduxDataLastUpdated > 0

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

const handleFilterEntries = (entries, search) => {
  if (!search) return { items: entries, filteredItems: [] }
  let cachedFilteredEntries = []

  const tagOrPeopleMatch = tagsOrPeople =>
    tagsOrPeople.some(({ name }) => stringMatch(name, search))

  const filteredEntries = entries.filter(item => {
    const { title, html, tags, people, address } = item

    if (
      tagOrPeopleMatch(tags) ||
      tagOrPeopleMatch(people) ||
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

export {
  LINK_TO_SIGN_UP,
  BASE_JOURNAL_ENTRY_ID,
  DEFAULT_JOUNRAL_ENTRY_ID,
  getReduxEntryId,
  mergeJson,
  handleFilterEntries,
  getTagStringFromObject,
  getTagObjectFromString,
}
