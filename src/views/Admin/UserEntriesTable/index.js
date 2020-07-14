import React, { useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "../../../redux/Entries/propTypes"
import {
  BasicTable,
  Header,
  EntryDataCellLink,
  TagsContainer,
} from "../../../components"
import Moment from "react-moment"
import { Container, Row, Col } from "reactstrap"
import { stringMatch, stripHtml, formatBytes } from "../../../utils"

const UserEntriesTable = ({ entries }) => {
  const tableColumns = useMemo(
    () => [
      {
        title: <i className="fas fa-heading" />,
        key: "title",
        width: 180,
        filter: "string",
        filterPlaceholder: "Title",
        render: ({ id, title }) => (
          <EntryDataCellLink entryId={id}>{title}</EntryDataCellLink>
        ),
      },
      {
        title: <i className="fas fa-keyboard" />,
        key: "html",
        width: 90,
        filter: "string",
        filterPlaceholder: "Body",
        render: ({ html }) => stripHtml(html),
      },
      {
        title: <i className="fas fa-tags" />,
        key: "tags",
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.tags.join().localeCompare(a.tags.join())
            : a.tags.join().localeCompare(b.tags.join()),
        filter: (searchValue) => ({ tags }) =>
          searchValue
            .split(",")
            .every((value) => tags.some((tag) => stringMatch(tag.name, value))),

        filterPlaceholder: "Tags",
        render: ({ tags }) => <TagsContainer tags={tags} />,
      },
      {
        title: <i className="fas fa-users" />,
        key: "people",
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.people.join().localeCompare(a.people.join())
            : a.people.join().localeCompare(b.people.join()),
        filter: (searchValue) => ({ people }) =>
          searchValue
            .split(",")
            .every((value) =>
              people.some((person) => stringMatch(person.name, value))
            ),
        filterPlaceholder: "People",
        render: ({ people }) => (
          <TagsContainer
            tags={people}
            faIcon="fas fa-user"
            emptyString="No People..."
          />
        ),
      },
      {
        title: <i className="fas fa-map-marker-alt" />,
        key: "address",
        width: 180,
        filter: "string",
        filterPlaceholder: "Address",
      },
      {
        title: <i className="fas fa-calendar-day" />,
        key: "date_created_by_author",
        width: 100,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b.date_created_by_author) -
              new Date(a.date_created_by_author)
            : new Date(a.date_created_by_author) -
              new Date(b.date_created_by_author),
        filter: "date",
        filterPlaceholder: "Created",
        render: ({ date_created_by_author }) => (
          <Moment format="D MMM YY hh:mma">{date_created_by_author}</Moment>
        ),
      },
      {
        title: <i className="fas fa-pencil-alt" />,
        key: "date_updated",
        width: 130,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b._lastUpdated || b.date_updated) -
              new Date(a._lastUpdated || a.date_updated)
            : new Date(a._lastUpdated || a.date_updated) -
              new Date(b._lastUpdated || b.date_updated),
        filter: "date",
        filterPlaceholder: "Updated",
        render: ({ _lastUpdated, date_updated }) => (
          <Moment format="D MMM YY hh:mma">
            {_lastUpdated || date_updated}
          </Moment>
        ),
      },

      {
        title: <i className="far fa-eye" />,
        key: "views",
        width: 50,
        render: ({ views }) => <span className="Center">{views}</span>,
        filter: "number",
        filterPlaceholder: "<=",
        footer: (items) => items.reduce((count, { views }) => count + views, 0),
      },
      {
        title: <i className="fas fa-star" />,
        key: "rating",
        width: 50,
        render: ({ rating }) => <span className="ml-2">{rating}</span>,
        footer: (items) => {
          let validItems = 0
          const ratingSum = items.reduce((count, { rating }) => {
            if (rating !== 0) {
              count += rating
              validItems += 1
            }
            return count
          }, 0)
          const averageRating = (ratingSum / validItems).toFixed(1)

          return <span>{averageRating > 0 ? averageRating : 0}</span>
        },
        filter: "number",
        filterPlaceholder: "<=",
      },
      {
        title: <i className="fas fa-photo-video" />,
        key: "EntryFiles",
        width: 50,
        render: ({ EntryFiles }) => (
          <span className="Center">{EntryFiles.length}</span>
        ),
        sort: (a, b, sortUp) =>
          sortUp
            ? b.EntryFiles.length - a.EntryFiles.length
            : a.EntryFiles.length - b.EntryFiles.length,
        filter: (searchValue) => ({ EntryFiles }) =>
          EntryFiles.length >= searchValue,
        filterPlaceholder: "<=",
        footer: (items) =>
          items.reduce((count, { EntryFiles }) => count + EntryFiles.length, 0),
      },
      {
        title: <i className="fas fa-lock" />,
        key: "is_public",
        width: 40,
        render: ({ is_public }) => (
          <span className="Center">{is_public ? "Yes" : "No"}</span>
        ),
      },
      {
        title: <i className="fas fa-hdd" />,
        key: "id",
        width: 65,
        sort: (a, b, sortUp) => {
          const aSize = a.size || a._size
          const bSize = b.size || b._size
          return sortUp ? bSize - aSize : aSize - bSize
        },
        filter: (searchValue) => ({ size, _size }) =>
          stringMatch(formatBytes(size || _size), searchValue),
        filterPlaceholder: "Size",

        render: ({ size, _size }) => formatBytes(size || _size),
      },
    ],
    [entries]
  )
  const getRowValue = useCallback(
    (user) => <UserEntriesTable entries={user.entries} />,
    [entries]
  )

  return (
    <Container className="UserEntriesTable Container">
      <Row className="Center">
        <Col xs={12} className="p-0">
          <Header fill="var(--quinaryColor)">User Entries Table</Header>
        </Col>
      </Row>
      <Row className="HomeRow mb-3 pb-1">
        <BasicTable
          sortable
          filterable
          pageSize={25}
          columns={tableColumns}
          dataDisplayName="Users"
          data={entries}
          getRowValue={getRowValue}
          // onSortCallback={handleSortCallback}
          // onFilterCallback={handleFilterCallback}
        />
      </Row>
    </Container>
  )
}

UserEntriesTable.propTypes = { entries: EntriesPropTypes }

UserEntriesTable.defaultProps = {}

export default memo(UserEntriesTable)
