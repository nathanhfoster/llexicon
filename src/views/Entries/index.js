import React, { Fragment, useCallback, useMemo, memo, lazy } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Row, Col, Button } from "reactstrap"
import { RouteMap, RouterPush } from "../../routes"
import Moment from "react-moment"
import { BasicTabs, EntryCards, NewEntryButton } from "../../components"
import NewEntry from "../NewEntry"
import { useHistory, useLocation } from "react-router-dom"
import { stripHtml, fuzzySearch } from "../../helpers"
import memoizeProps from "../../helpers/memoizeProps"
import {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries
} from "../../redux/Entries/actions"
import { SetEditorState } from "../../redux/TextEditor/actions"
import "./styles.css"

const ReactCalendar = lazy(() => import("../../components/ReactCalendar"))
const EntriesMinimal = lazy(() => import("../../components/EntriesMinimal"))
const EntriesDetailed = lazy(() => import("../../components/EntriesDetailed"))
const BasicTable = lazy(() => import("../../components/BasicTable"))
const BasicMap = lazy(() => import("../../components/BasicMap"))
const TagsContainer = lazy(() => import("../../components/TagsContainer"))

const mapStateToProps = ({
  Entries: { items, next, search },
  TextEditor,
  Window: { innerHeight, navBarHeight }
}) => ({
  entries: items,
  TextEditor,
  nextEntryPage: next,
  entriesSearch: search,
  viewPortHeight: innerHeight - navBarHeight
})

const mapDispatchToProps = {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries,
  SetEditorState
}

const Entries = ({
  entries,
  TextEditor,
  nextEntryPage,
  viewPortHeight,
  SyncEntries,
  GetUserEntries,
  entriesSearch,
  GetAllUserEntries,
  SetEditorState
}) => {
  const viewableEntries = useMemo(
    () =>
      entries
        .filter(item => !item._shouldDelete)
        .sort(
          (a, b) =>
            new Date(b.date_created_by_author) -
            new Date(a.date_created_by_author)
        ),
    [entries]
  )

  const shouldRenderNewEntryButton = viewableEntries.length === 0 ? true : false

  const history = useHistory()
  const { pathname } = useLocation()

  if (pathname === RouteMap.ENTRIES) {
    RouterPush(history, RouteMap.ENTRIES_MINIMAL)
  }

  if (TextEditor.latitude && TextEditor.longitude) {
    viewableEntries.push({ ...TextEditor })
  }

  const tabContainerHeight = 54

  const loadButtonContainerHeight = 38

  const minimalEntriesListHeight =
    viewPortHeight - tabContainerHeight - loadButtonContainerHeight

  const detailedEntriesListHeight = viewPortHeight - tabContainerHeight

  let listItemHeight = detailedEntriesListHeight / 2

  if (detailedEntriesListHeight / 3 > listItemHeight)
    listItemHeight = detailedEntriesListHeight / 3

  const activeTab = pathname

  const handleItemsRendered = useCallback(
    ({
      overscanStartIndex,
      overscanStopIndex,
      visibleStartIndex,
      visibleStopIndex
    }) => {
      const { length } = viewableEntries
      const bottomOfListIndex = length === 0 ? length : length - 1
      const reachedBottomOfList =
        bottomOfListIndex !== 0 && overscanStopIndex === bottomOfListIndex

      // console.log("overscanStopIndex: ", overscanStopIndex)
      // console.log("visibleStopIndex: ", visibleStopIndex)
      // console.log("reachedBottomOfList: ", reachedBottomOfList)
      // console.log("---------------------------------------")

      if (reachedBottomOfList) {
        GetEntries()
      }
    },
    [viewableEntries.length]
  )

  const GetEntries = () => {
    if (entriesSearch || !nextEntryPage) {
      return
    }

    const split = nextEntryPage.split(/\?page=(.*)/)
    const pageNumber = split[1]

    SyncEntries(
      () => new Promise(resolve => resolve(GetUserEntries(pageNumber)))
    )
  }

  const handleTabChange = tabId => RouterPush(history, tabId)

  const tabs = [
    {
      tabId: RouteMap.NEW_ENTRY,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-feather-alt"></i>,
      render: (
        <Row>
          <NewEntry />
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.CALENDAR,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-calendar-alt"></i>,
      render: (
        <Row>
          <ReactCalendar />
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_CARDS,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-columns"></i>,
      render: (
        <Row>
          {shouldRenderNewEntryButton ? (
            <NewEntryButton />
          ) : (
            <EntryCards entries={viewableEntries} />
          )}
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_DETAILED,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-newspaper" />,
      render: (
        <Row>
          {shouldRenderNewEntryButton ? (
            <NewEntryButton />
          ) : (
            <EntriesDetailed
              height={detailedEntriesListHeight}
              entries={viewableEntries}
              itemSize={listItemHeight}
              onItemsRendered={handleItemsRendered}
            />
          )}
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_MINIMAL,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-th-list" />,
      render: shouldRenderNewEntryButton ? (
        <Row>
          <NewEntryButton />
        </Row>
      ) : (
        <Fragment>
          <Row>
            <EntriesMinimal
              height={minimalEntriesListHeight}
              entries={viewableEntries}
              onItemsRendered={handleItemsRendered}
            />
          </Row>
          <Row className="Center">
            {nextEntryPage && (
              <Col xs={12} tag={Button} color="accent" onClick={GetEntries}>
                <i className="fas fa-cloud-download-alt" /> Load More
              </Col>
            )}
          </Row>
        </Fragment>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_TABLE,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-table" />,
      render: shouldRenderNewEntryButton ? (
        <NewEntryButton />
      ) : (
        <Row>
          <BasicTable
            sortable
            defaultSortKey="date_updated"
            columns={[
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
                  fuzzySearch(item.tags.map(t => t.title).join(), searchValue),
                render: item => <TagsContainer tags={item.tags} />
              },

              {
                title: <i className="fas fa-heading" />,
                key: "title",
                filter: searchValue => item =>
                  fuzzySearch(item.title, searchValue),
                width: 180
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
                filter: searchValue => item =>
                  item.EntryFiles.length >= searchValue,
                filterPlaceholder: "<="
              }
            ]}
            data={viewableEntries}
          />
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_MAP,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-map-marked-alt" />,
      render: (
        <Row>
          <BasicMap
            renderUserLocation
            height={viewPortHeight - 54}
            locations={viewableEntries}
            getAddressOnMarkerClick
            onChangeCallback={({ entryId, address, latitude, longitude }) => {
              if (!entryId) return
              else if (entryId === "NewEntry") {
                SetEditorState({
                  id: entryId,
                  title: "",
                  address,
                  latitude,
                  longitude
                })
              } else if (entryId === "MyLocation") {
                SetEditorState({
                  id: entryId,
                  title: "",
                  address,
                  latitude,
                  longitude
                })
                return RouterPush(history, RouteMap.NEW_ENTRY)
              } else {
                return RouterPush(
                  history,
                  RouteMap.ENTRY_DETAIL.replace(":entryId", `${entryId}`)
                )
              }
            }}
          />
        </Row>
      ),
      onClickCallback: handleTabChange
    }
  ]

  return (
    <BasicTabs
      fluid={
        activeTab === RouteMap.CALENDAR ||
        activeTab === RouteMap.ENTRIES_TABLE ||
        activeTab === RouteMap.ENTRIES_MAP
      }
      activeTab={activeTab}
      tabs={tabs}
    />
  )
}

Entries.propTypes = {
  history: PropTypes.object,
  loaction: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.any,
  entries: PropTypes.arrayOf(PropTypes.object),
  TextEditor: PropTypes.object,
  nextEntryPage: PropTypes.string,
  entriesSearch: PropTypes.string,
  SyncEntries: PropTypes.func.isRequired,
  GetAllUserEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired,
  SetEditorState: PropTypes.func.isRequired
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "entries",
    "TextEditor",
    "nextEntryPage",
    "entriesSearch",
    "viewPortHeight"
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Entries, isEqual))
