const handleFilterEntries = (entries, search) => {
  if (!search) return { items: entries, filteredItems: [] }
  const searchValue = search.toUpperCase()
  let cachedFilteredEntries = []

  const tagOrPeopleMatch = (tagsOrPeople) =>
    tagsOrPeople.some(({ name }) => name.toUpperCase().includes(searchValue))

  const stringMatch = (string) => string.toUpperCase().includes(searchValue)

  const filteredEntries = entries.filter((item) => {
    const { title, html, tags, people, address } = item

    if (
      tagOrPeopleMatch(tags) ||
      tagOrPeopleMatch(people) ||
      stringMatch(title) ||
      stringMatch(html) ||
      stringMatch(address)
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
