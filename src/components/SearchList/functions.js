const listFilter = (listItem, searchValue) => {
  const { id, value } = listItem

  if (typeof id === 'string' && id.toUpperCase().includes(value.toUpperCase())) {
    return true
  }

  if (typeof value === 'string' && value.toUpperCase().includes(searchValue.toUpperCase())) {
    return true
  }

  return false
}

const filterList = (orginalList, searchValue, initiallyRenderList) => {
  return initiallyRenderList || !searchValue
    ? orginalList
    : orginalList.filter(item => listFilter(item, searchValue))
}

const getSearchValue = (orginalList, value) => {
  // console.log('getSearchValue: ', list, value)
  if (orginalList.length === 0 || !value) return ''
  const foundListItem = orginalList.find(item => item.id === value)
  // console.log('foundListItem: ', foundListItem)
  if (!foundListItem) return ''
  return foundListItem.value
}

const getTextWidth = (text, font) => {
  const canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

const objectToArray = obj => Object.keys(obj).map(key => obj[key])

const mergeLists = (currentList, newList) => {
  const allListData = currentList.concat(newList)
  let mergeMap = {}

  for (const item of allListData) {
    const { id } = item

    mergeMap[id] = item
  }

  return objectToArray(mergeMap)
}

export { getSearchValue, filterList, getTextWidth, mergeLists }
