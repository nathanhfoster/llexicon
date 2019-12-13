const removeArrayDuplicates = array => [...new Set(array)]

const removeAttributeDuplicates = (array, objAttr) => {
  let map = new Map()

  for (let i = 0; i < array.length; i++) {
    try {
      map.set(array[i][objAttr], array[i])
    } catch (e) {}
  }

  return [...map.values()]
}

export { removeArrayDuplicates, removeAttributeDuplicates }
