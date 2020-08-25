import { objectToArray, stringMatch } from "utils"

const getMostRecent = (reduxData, newData) => {
  const reduxDataLastUpdated = new Date(
    reduxData._lastUpdated || reduxData.date_updated
  )
  const newDataLastUpdated = new Date(newData.date_updated)

  // const reduxViews = reduxData.views
  // const newDataViews = newData.views

  // console.log(newDataLastUpdated - reduxDataLastUpdated)
  // console.log(newDataLastUpdated - 0 > reduxDataLastUpdated - 0)

  // || newDataViews > reduxViews
  if (newDataLastUpdated > reduxDataLastUpdated) {
    delete reduxData._lastUpdated
    // delete reduxData._shouldDelete
    return { ...reduxData, ...newData }
  } else {
    return { ...newData, ...reduxData }
  }
}

const mergeJson = (reduxData, newData) => {
  // Order matters. You want to merge the reduxData into the newData
  const allData = reduxData.concat(newData)
  let mergeMap = {}

  for (let i = 0, { length } = allData; i < length; i++) {
    const item = allData[i]
    const { id } = item

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

  const tagOrPeopleMatch = (tagsOrPeople) =>
    tagsOrPeople.some(({ name }) => stringMatch(name, search))

  const filteredEntries = entries.filter((item) => {
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

const getJsonTagsOrPeople = (tagsOrPeople) =>
  tagsOrPeople.map(({ name }) => name).join(",")

export { mergeJson, handleFilterEntries, getJsonTagsOrPeople }
