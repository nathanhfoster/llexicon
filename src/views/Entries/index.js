import React, { useEffect, useCallback, useMemo, memo, lazy } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Row } from "reactstrap"
import { RouteMap, RouterPush } from "../../routes"
import { BasicTabs, NewEntryButton, EntriesTable } from "../../components"
import NewEntry from "../NewEntry"
import memoizeProps from "../../helpers/memoizeProps"
import {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries
} from "../../redux/Entries/actions"
import { SetEditorState } from "../../redux/TextEditor/actions"
import "./styles.css"

const ReactCalendar = lazy(() => import("../../components/ReactCalendar"))
const EntryFolders = lazy(() => import("../../components/EntryFolders"))
const EntriesMinimal = lazy(() => import("../../components/EntriesMinimal"))
const BasicMap = lazy(() => import("../../components/BasicMap"))

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
  SetEditorState,
  history,
  location,
  match
}) => {
  const { pathname } = location
  useEffect(() => {
    GetUserEntries(1)
  }, [])
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

  if (pathname === RouteMap.ENTRIES) {
    RouterPush(history, RouteMap.ENTRIES_MINIMAL)
  }

  if (TextEditor.latitude && TextEditor.longitude) {
    viewableEntries.push({ ...TextEditor })
  }

  const tabContainerHeight = 46

  const minimalEntriesListHeight = viewPortHeight - tabContainerHeight

  let listItemHeight = minimalEntriesListHeight / 2

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
      tabId: RouteMap.ENTRIES_CALENDAR,
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
      tabId: RouteMap.ENTRIES_FOLDERS,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-folder" />,
      render: (
        <Row>
          {shouldRenderNewEntryButton ? (
            <NewEntryButton />
          ) : (
            <EntryFolders
              entries={viewableEntries}
              history={history}
              location={location}
              match={match}
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
        <Row>
          <EntriesMinimal
            height={minimalEntriesListHeight}
            entries={viewableEntries}
            onItemsRendered={handleItemsRendered}
          />
        </Row>
      ),
      onClickCallback: handleTabChange
    },
    {
      tabId: RouteMap.ENTRIES_TABLE,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-table" />,
      render: shouldRenderNewEntryButton ? (
        <Row>
          <NewEntryButton />
        </Row>
      ) : (
        <Row>
          <EntriesTable entries={viewableEntries} />
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
      className="EntryTabs"
      fluid={
        activeTab === RouteMap.ENTRIES_CALENDAR ||
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
  entries: EntriesPropTypes,
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
    "viewPortHeight",
    "history",
    "location",
    "match"
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Entries, isEqual))
