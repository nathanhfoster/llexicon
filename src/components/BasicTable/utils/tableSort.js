import { isType } from "../../../helpers"

const tableSort = (data, sortMap) => {
  Object.keys(sortMap).forEach((sortKey) => {
    const { sortUp, sort } = sortMap[sortKey]

    if (sort) {
      data = data.sort((a, b) => sort(a, b, sortUp))
    } else {
      data = data.sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
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
  })

  return data
}

export default tableSort
