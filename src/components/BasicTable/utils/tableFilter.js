import MomentJS from "moment"
import { stringMatch, isType } from "../../../helpers"

const tableFilter = (data, filterList) => {
  let filteredData = [...data]

  const filters = filterList.filter(({ filterValue }) => filterValue)

  for (let i = 0, { length } = filters; i < length; i++) {
    const item = filters[i]
    const { key, filterValue, filter } = item
    if (!filterValue) return

    if (filter instanceof Function || typeof filter === "function") {
      filteredData = filteredData.filter(filter(filterValue))
    } else if (filter === "date") {
      filteredData = filteredData.filter((item) => {
        if (filterValue) {
          const momentCreatedByAuthor = MomentJS(item[key])
          const momentOfSearchValue = MomentJS(filterValue)

          return momentCreatedByAuthor >= momentOfSearchValue
        } else {
          return true
        }
      })
    } else if (filter === "string") {
      filteredData = filteredData.filter((item) => {
        const itemString = item[key]
        return stringMatch(itemString, filterValue)
      })
    } else if (filter === "number") {
      if (filterValue) {
        filteredData = filteredData.filter((item) => item[key] >= filterValue)
      }
    }
  }

  return filteredData
}

export default tableFilter
