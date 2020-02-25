import MomentJS from "moment"

const tableFilter = (data, filterMap) => {
  Object.keys(filterMap).forEach(filterKey => {
    const { searchValue, filter } = filterMap[filterKey]

    if (filter instanceof Function || typeof filter === "function") {
      data = data.filter(filter(searchValue))
    } else if (filter === "date") {
      data = data.filter(item => {
        if (searchValue) {
          const momentCreatedByAuthor = MomentJS(item[filterKey])
          const momentOfSearchValue = MomentJS(searchValue)

          return momentCreatedByAuthor >= momentOfSearchValue
        } else {
          return true
        }
      })
    } else if (filter === "string") {
      data = data.filter(item => {
        const itemString = item[filterKey].toUpperCase()
        return itemString.includes(searchValue.toUpperCase())
      })
    } else if (filter === "number") {
      if (searchValue) {
        data = data.filter(item => item[filterKey] >= searchValue)
      }
    }
  })

  return data
}

export default tableFilter
