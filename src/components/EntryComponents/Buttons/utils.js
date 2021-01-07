export const selectedEntriesSelector = ({
  Entries: { items, filteredItems, selectedItems, showOnlyPublic },
}) => ({
  entriesSelected: items
    .concat(filteredItems)
    .filter(
      ({ id, is_public, _shouldDelete }) =>
        (showOnlyPublic ? is_public && !_shouldDelete : !_shouldDelete) && selectedItems[id],
    ),
  selectedItems,
})

export const selectedItemsAreEqual = (
  { selectedItems: prevSelectedItems },
  { selectedItems: nextSelectedItems },
) => Object.keys(prevSelectedItems).length === Object.keys(nextSelectedItems).length
