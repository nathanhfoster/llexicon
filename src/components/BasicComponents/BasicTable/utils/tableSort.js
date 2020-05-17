import { isType } from "../../../../utils"

const tableSort = (data, sortList) => {
  let sortedData = [...data]
  
  const sorts = sortList.filter(
    ({ sortUp }) => typeof sortUp !== isType.UNDEFINED && sortUp !== null
  )

  for (let i = 0, { length } = sorts; i < length; i++) {
    const item = sorts[i]
    const { key, sortUp, sort } = item

    // console.log(key)

    if (sort) {
      // console.log("shouldSort && sort: ", key)
      sortedData = sortedData.sort((a, b) => sort(a, b, sortUp))
    } else {
      // console.log("else: ", key)
      sortedData = sortedData.sort((a, b) => {
        const aValue = a[key]
        const bValue = b[key]
        let valueType = null

        if (typeof aValue === typeof bValue) {
          valueType = typeof aValue
        }

        // console.log("valueType: ", valueType)

        if (valueType === isType.STRING) {
          return sortUp
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue)
        } else if (
          valueType === isType.NUMBER ||
          valueType === isType.BOOLEAN
        ) {
          return sortUp ? bValue - aValue : aValue - bValue
        } else if (Array.isArray(aValue)) {
          return sortUp
            ? bValue.join().localeCompare(aValue.join())
            : aValue.join().localeCompare(bValue.join())
        } else if (valueType === isType.OBJECT) {
          // console.log(aValue)
          // console.log("OBJECT")
        }
      })
    }
  }

  return sortedData
}

export default tableSort
