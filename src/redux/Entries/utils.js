const handleFilterEntries = (entries, search) => {
  if (!search) return { items: entries, filteredItems: [] }
  const searchValue = search.toUpperCase()
  let cachedFilteredEntries = []

  const filteredEntries = entries.filter(item => {
    const { title, html, tags, address } = item
    if (
      tags.map(tag => tag.title.toUpperCase()).includes(searchValue) ||
      title.toUpperCase().includes(searchValue) ||
      html.toUpperCase().includes(searchValue) ||
      address.toUpperCase().includes(searchValue)
    ) {
      return true
    } else {
      cachedFilteredEntries.push(item)
      return false
    }
  })

  return {
    filteredItems: cachedFilteredEntries,
    items: filteredEntries
  }
}

export { handleFilterEntries }
