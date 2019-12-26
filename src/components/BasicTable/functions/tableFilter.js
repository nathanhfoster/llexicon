const tableFilter = (data, filterMap) => {
  Object.keys(filterMap).forEach(filterKey => {
    const { searchValue, filter } = filterMap[filterKey]

    if (typeof filter === "function") {
      data = data.filter(filter(searchValue))
    } else if (filter === "string") {
      data = data.filter(item =>
        item[filterKey].toUpperCase().includes(searchValue.toUpperCase())
      )
    } else if (filter === "number") {
      if (searchValue) {
        data = data.filter(item => item[filterKey] >= searchValue)
      }
    }
  })

  return data
}

export default tableFilter
