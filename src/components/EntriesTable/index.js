import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { stripHtml } from "../../helpers"
import { RouteMap, RouterPush } from "../../routes"
import { useHistory } from "react-router-dom"
import Moment from "react-moment"
import { TagsContainer, BasicTable } from "../"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"

const EntriesTable = ({ entries }) => {
  const history = useHistory()
  const tableColumns = useMemo(
    () => [
      {
        title: <i className="fas fa-calendar-day" />,
        key: "date_created_by_author",
        width: 100,
        onRowClick: item =>
          RouterPush(
            history,
            RouteMap.ENTRY_DETAIL.replace(":entryId", `${item.id}`)
          ),
        render: item => (
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
        filter: "date",
        filterPlaceholder: "Created"
      },
      {
        title: <i className="fas fa-pencil-alt" />,
        key: "date_updated",
        width: 130,
        render: item => (
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
        filter: "date",
        filterPlaceholder: "Updated"
      },
      {
        title: <i className="fas fa-tags" />,
        key: "tags",
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.tags.join().localeCompare(a.tags.join())
            : a.tags.join().localeCompare(b.tags.join()),
        filter: searchValue => item =>
          item.tags.some(t =>
            t.title.toUpperCase().includes(searchValue.toUpperCase())
          ),
        render: item => <TagsContainer tags={item.tags} />
      },
      {
        title: <i className="fas fa-heading" />,
        key: "title",
        width: 180,
        filter: "string"
      },
      {
        title: <i className="fas fa-keyboard" />,
        key: "html",
        width: 180,

        render: item => stripHtml(item.html),
        filter: "string"
      },
      {
        title: <i className="fas fa-map-marker-alt" />,
        key: "address",
        width: 180,
        filter: "string"
      },
      {
        title: <i className="far fa-eye" />,
        key: "views",
        width: 60,
        render: item => <span className="Center">{item.views}</span>,
        filter: "number",
        filterPlaceholder: "<="
      },
      {
        title: <i className="fas fa-star" />,
        key: "rating",
        width: 60,
        render: item => <span className="ml-2">{item.rating}</span>,
        footer: items => {
          let validItems = 0
          const ratingSum = items.reduce((count, item) => {
            const { rating } = item
            if (rating !== 0) {
              count += item.rating
              validItems += 1
            }
            return count
          }, 0)
          const averageRating = (ratingSum / validItems).toFixed(3)

          return <span>{averageRating > 0 ? averageRating : 0}</span>
        },
        filter: "number",
        filterPlaceholder: "<="
      },
      {
        title: <i className="fas fa-photo-video" />,
        key: "EntryFiles",
        width: 60,
        render: item => (
          <span className="Center">{item.EntryFiles.length}</span>
        ),
        sort: (a, b, sortUp) =>
          sortUp
            ? b.EntryFiles.length - a.EntryFiles.length
            : a.EntryFiles.length - b.EntryFiles.length,
        filter: searchValue => item => item.EntryFiles.length >= searchValue,
        filterPlaceholder: "<="
      },
      {
        title: <i className="fas fa-lock" />,
        key: "is_public",
        width: 40,
        render: item => (
          <span className="Center">{item.is_public ? "Yes" : "No"}</span>
        )
      }
    ],
    []
  )
  return (
    <BasicTable
      sortable
      defaultSortKey="date_updated"
      columns={tableColumns}
      data={entries}
    />
  )
}

EntriesTable.propTypes = { entries: EntriesPropTypes }

EntriesTable.defaultProps = { entries: [] }

export default memo(EntriesTable)
