import { stringMatch } from "../../utils"

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

export { handleFilterEntries, getJsonTagsOrPeople }
