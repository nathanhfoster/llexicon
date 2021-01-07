export const selectedEntriesSelector = ({
  Entries: { items, filteredItems, selectedItemsMap, showOnlyPublic },
}) => ({
  entriesSelected: items
    .concat(filteredItems)
    .filter(
      ({ id, is_public, _shouldDelete }) =>
        (showOnlyPublic ? is_public && !_shouldDelete : !_shouldDelete) && selectedItemsMap[id],
    ),
  selectedItemsMap,
})

export const selectedItemsAreEqual = (
  { selectedItemsMap: prevSelectedItems },
  { selectedItemsMap: nextSelectedItems },
) => Object.keys(prevSelectedItems).length === Object.keys(nextSelectedItems).length
