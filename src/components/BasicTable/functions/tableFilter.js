import MomentJs from "moment"
import { fuzzyMatch } from "../../../helpers"

const tableFilter = (data, filterMap) => {
  Object.keys(filterMap).forEach(filterKey => {
    const { searchValue, filter } = filterMap[filterKey]

    if (filter instanceof Function || typeof filter === "function") {
      data = data.filter(filter(searchValue))
    } else if (filter === "date") {
      data = data.filter(item => {
        const itemFormattedMoment = MomentJs(item[filterKey]).format(
          "MMMM DD YYYY"
        )
        return fuzzyMatch(itemFormattedMoment, searchValue)
      })
    } else if (filter === "string") {
      data = data.filter(item => fuzzyMatch(item[filterKey], searchValue))
    } else if (filter === "number") {
      if (searchValue) {
        data = data.filter(item => item[filterKey] >= searchValue)
      }
    }
  })

  return data
}

export default tableFilter
