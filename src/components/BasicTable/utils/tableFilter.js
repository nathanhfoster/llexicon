import MomentJS from "moment"
import { stringMatch, isType } from "../../../helpers"

const tableFilter = (data, filterList) => {
  // console.log(filterList)
  filterList.forEach((item) => {
    const { key, filterValue, filter } = item
    if (!filterValue) return

    if (filter instanceof Function || typeof filter === "function") {
      data = data.filter(filter(filterValue))
    } else if (filter === "date") {
      data = data.filter((item) => {
        if (filterValue) {
          const momentCreatedByAuthor = MomentJS(item[key])
          const momentOfSearchValue = MomentJS(filterValue)

          return momentCreatedByAuthor >= momentOfSearchValue
        } else {
          return true
        }
      })
    } else if (filter === "string") {
      data = data.filter((item) => {
        const itemString = item[key]
        return stringMatch(itemString, filterValue)
      })
    } else if (filter === "number") {
      if (filterValue) {
        data = data.filter((item) => item[key] >= filterValue)
      }
    }
  })

  return data
}

export default tableFilter
