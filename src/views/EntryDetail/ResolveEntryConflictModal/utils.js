import memoizeProps from "../../../utils/memoizeProps"

const MEMOIZE_ENTRY_PROPS = [
  "EntryFiles",
  "address",
  // "author",
  // "date_created",
  "date_created_by_author",
  // "date_updated",
  "_lastUpdated",
  "html",
  "id",
  "is_public",
  "latitude",
  "longitude",
  "people",
  "rating",
  // "size",
  // "_size",
  "tags",
  "title",
  // "views",
]

const getEntryDate = (entry) =>
  new Date(
    entry.date_created_by_author || entry._lastUpdated || entry.date_updated
  )

const entryDatesAreTheSame = (e1, e2) => {
  const d1 = getEntryDate(e1)
  const d2 = getEntryDate(e2)
  const areEqual = d1 - d2 === 0
  return areEqual
}

const entriesDiffer = (e1, e2) => {
  // const recentlyViewed = Math.abs(e1.views - e2.views) === 1
  // const sameUpdateDates = entryDatesAreTheSame(e1, e2)

  const isEqual = memoizeProps(e1, e2, MEMOIZE_ENTRY_PROPS)

  return !isEqual
}

export {
  MEMOIZE_ENTRY_PROPS,
  getEntryDate,
  entryDatesAreTheSame,
  entriesDiffer,
}
