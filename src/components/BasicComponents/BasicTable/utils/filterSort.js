const filterSort = (list, key, keyValue) => {
  let tempItem
  const newList = list
    .filter((item) => {
      if (item.key == key) {
        tempItem = { ...item, ...keyValue }
        return false
      } else return true
    })
    .concat(tempItem)

  return newList
}

export default filterSort
