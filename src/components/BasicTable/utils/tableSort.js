import { isType } from "../../../helpers"

const tableSort = (data, sortList) => {
  // console.log(sortList)
  sortList.forEach((item) => {
    const { key, sortUp, sort } = item

    const shouldSort = typeof sortUp !== isType.UNDEFINED && sortUp !== null

    // console.log(key)

    if (shouldSort && sort) {
      // console.log("shouldSort && sort: ", key)
      data = data.sort((a, b) => sort(a, b, sortUp))
    } else if (shouldSort) {
      // console.log("else: ", key)
      data = data.sort((a, b) => {
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
  })

  return data
}

export default tableSort
