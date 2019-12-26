const tableFilter = (data, filterMap, sortUp) => {
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
        data = data.filter(item =>
          sortUp
            ? item[filterKey] >= searchValue
            : item[filterKey] <= searchValue
        )
      }
    }
  })

  return data
}

export default tableFilter
