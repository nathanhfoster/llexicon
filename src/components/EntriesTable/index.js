import React, { useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { stripHtml } from "../../helpers"
import { GoToEntryDetail } from "../../routes"
import { useHistory } from "react-router-dom"
import Moment from "react-moment"
import { TagsContainer, BasicTable } from "../"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { stringMatch, formatBytes } from "../../helpers"
import {
  SetEntriesSortMap,
  SetEntriesFilterMap,
} from "../../redux/Entries/actions"

const mapStateToProps = ({ Entries: { items, sortMap, filterMap } }) => ({
  items,
  sortMap,
  filterMap,
})

const mapDispatchToProps = {
  SetEntriesSortMap,
  SetEntriesFilterMap,
}

const EntriesTable = ({
  items,
  sortMap,
  filterMap,
  SetEntriesSortMap,
  SetEntriesFilterMap,
}) => {
  const history = useHistory()

  const viewableEntries = useMemo(
    () => items.filter(({ _shouldDelete }) => !_shouldDelete),
    [items]
  )

  const handleSortCallback = useCallback(
    (sortKey, sortUp) => SetEntriesSortMap(sortKey, sortUp),
    []
  )

  const handleFilterCallback = useCallback(
    (filterKey, searchValue) => SetEntriesFilterMap(filterKey, searchValue),
    []
  )

  const tableColumns = useMemo(
    () => [
      {
        title: <i className="fas fa-hdd" />,
        key: "id",
        width: 90,
        sort: (a, b, sortUp) => {
          const aSize = a.size || a._size
          const bSize = b.size || b._size
          return sortUp ? bSize - aSize : aSize - bSize
        },
        defaultSortValue: sortMap.id,
        filter: (searchValue) => ({ size, _size }) =>
          stringMatch(formatBytes(size || _size), searchValue),
        defaultFilterValue: filterMap.id,
        filterPlaceholder: "Size",
        render: ({ size, _size }) => formatBytes(size || _size),
      },
      {
        title: <i className="fas fa-heading" />,
        key: "title",
        width: 180,
        filter: "string",
        filterPlaceholder: "Title",
        defaultSortValue: sortMap.title,
        defaultFilterValue: filterMap.title,
      },
      {
        title: <i className="fas fa-keyboard" />,
        key: "html",
        width: 180,
        defaultSortValue: sortMap.html,
        filter: "string",
        filterPlaceholder: "Body",
        defaultFilterValue: filterMap.html,
        render: (item) => stripHtml(item.html),
      },
      {
        title: <i className="fas fa-tags" />,
        key: "tags",
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.tags.join().localeCompare(a.tags.join())
            : a.tags.join().localeCompare(b.tags.join()),
        defaultSortValue: sortMap.tags,
        filter: (searchValue) => (item) =>
          item.tags.some((t) => stringMatch(t.name, searchValue)),
        defaultFilterValue: filterMap.tags,
        filterPlaceholder: "Tags",
        render: (item) => <TagsContainer tags={item.tags} />,
      },
      {
        title: <i className="fas fa-users" />,
        key: "people",
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.people.join().localeCompare(a.people.join())
            : a.people.join().localeCompare(b.people.join()),
        defaultSortValue: sortMap.people,
        filter: (searchValue) => (item) =>
          item.people.some((t) => stringMatch(t.name, searchValue)),
        defaultFilterValue: filterMap.people,
        filterPlaceholder: "People",
        render: (item) => (
          <TagsContainer
            tags={item.people}
            faIcon="fas fa-user"
            emptyString="No People..."
          />
        ),
      },
      {
        title: <i className="fas fa-map-marker-alt" />,
        key: "address",
        width: 180,
        defaultSortValue: sortMap.address,
        filter: "string",
        filterPlaceholder: "Address",
        defaultFilterValue: filterMap.address,
      },
      {
        title: <i className="fas fa-calendar-day" />,
        key: "date_created_by_author",
        width: 100,
        onRowClick: (item) => GoToEntryDetail(item.id, history),
        render: (item) => (
          <Moment format="D MMM YY hh:mma">
            {item.date_created_by_author}
          </Moment>
        ),
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b.date_created_by_author) -
              new Date(a.date_created_by_author)
            : new Date(a.date_created_by_author) -
              new Date(b.date_created_by_author),
        defaultSortValue: sortMap.date_created_by_author,
        filter: "date",
        filterPlaceholder: "Created",
        defaultFilterValue: filterMap.date_created_by_author,
      },
      {
        title: <i className="fas fa-pencil-alt" />,
        key: "date_updated",
        width: 130,
        render: (item) => (
          <Moment format="D MMM YY hh:mma">
            {item._lastUpdated || item.date_updated}
          </Moment>
        ),
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b._lastUpdated || b.date_updated) -
              new Date(a._lastUpdated || a.date_updated)
            : new Date(a._lastUpdated || a.date_updated) -
              new Date(b._lastUpdated || b.date_updated),
        defaultSortValue: sortMap.date_updated,
        filter: "date",
        filterPlaceholder: "Updated",
        defaultFilterValue: filterMap.date_updated,
      },

      {
        title: <i className="far fa-eye" />,
        key: "views",
        width: 50,
        render: (item) => <span className="Center">{item.views}</span>,
        defaultSortValue: sortMap.views,
        filter: "number",
        filterPlaceholder: "<=",
        defaultFilterValue: filterMap.views,
      },
      {
        title: <i className="fas fa-star" />,
        key: "rating",
        width: 50,
        render: (item) => <span className="ml-2">{item.rating}</span>,
        footer: (items) => {
          let validItems = 0
          const ratingSum = items.reduce((count, item) => {
            const { rating } = item
            if (rating !== 0) {
              count += item.rating
              validItems += 1
            }
            return count
          }, 0)
          const averageRating = (ratingSum / validItems).toFixed(1)

          return <span>{averageRating > 0 ? averageRating : 0}</span>
        },
        defaultSortValue: sortMap.rating,
        filter: "number",
        filterPlaceholder: "<=",
        defaultFilterValue: filterMap.rating,
      },
      {
        title: <i className="fas fa-photo-video" />,
        key: "EntryFiles",
        width: 50,
        render: (item) => (
          <span className="Center">{item.EntryFiles.length}</span>
        ),
        sort: (a, b, sortUp) =>
          sortUp
            ? b.EntryFiles.length - a.EntryFiles.length
            : a.EntryFiles.length - b.EntryFiles.length,
        defaultSortValue: sortMap.EntryFiles,
        filter: (searchValue) => (item) =>
          item.EntryFiles.length >= searchValue,
        filterPlaceholder: "<=",
        defaultFilterValue: filterMap.EntryFiles,
      },
      {
        title: <i className="fas fa-lock" />,
        key: "is_public",
        width: 40,
        render: (item) => (
          <span className="Center">{item.is_public ? "Yes" : "No"}</span>
        ),
        defaultSortValue: sortMap.is_public,
        defaultFilterValue: filterMap.is_public,
      },
    ],
    []
  )
  return (
    <BasicTable
      sortable
      columns={tableColumns}
      data={viewableEntries}
      onSortCallback={handleSortCallback}
      onFilterCallback={handleFilterCallback}
    />
  )
}

EntriesTable.propTypes = {
  items: EntriesPropTypes,
  sortMap: PropTypes.object,
  filterMap: PropTypes.object,
  SetEntriesSortMap: PropTypes.func.isRequired,
  SetEntriesFilterMap: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntriesTable)
