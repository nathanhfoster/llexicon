import React, { useEffect, useMemo, memo, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Row } from "reactstrap"
import { RouteMap, RouterPush, GoToEntryDetail } from "../../routes"
import { BasicTabs, NewEntryButton, EntriesTable } from "../../components"
import NewEntry from "../NewEntry"
import memoizeProps from "../../helpers/memoizeProps"
import {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries,
} from "../../redux/Entries/actions"
import { SetEditorState } from "../../redux/TextEditor/actions"
import "./styles.css"

const EntryCalendar = lazy(() => import("../../components/EntryCalendar"))
const EntryFolders = lazy(() => import("../../components/EntryFolders"))
const EntriesList = lazy(() => import("../../components/EntriesList"))
const BasicMap = lazy(() => import("../../components/BasicMap"))

const mapStateToProps = ({
  User: { id },
  Entries: { items, next, search },
  TextEditor,
  Window: { innerHeight, navBarHeight },
}) => ({
  userId: id,
  entries: items,
  TextEditor,
  nextEntryPage: next,
  entriesSearch: search,
  viewPortHeight: innerHeight - navBarHeight,
})

const mapDispatchToProps = {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries,
  SetEditorState,
}

const Entries = ({
  userId,
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
  match,
}) => {
  const { pathname } = location
  useEffect(() => {
    if (userId) GetUserEntries(1)
  }, [])
  const viewableEntries = useMemo(
    () =>
      entries
        .filter(({ _shouldDelete }) => !_shouldDelete)
        .sort(
          (a, b) =>
            new Date(b.date_created_by_author) -
            new Date(a.date_created_by_author)
        ),
    [entries]
  )

  const shouldRenderNewEntryButton = viewableEntries.length === 0 ? true : false

  if (pathname === RouteMap.ENTRIES) {
    RouterPush(history, RouteMap.ENTRIES_LIST)
  }

  if (TextEditor.latitude && TextEditor.longitude) {
    viewableEntries.push({ ...TextEditor })
  }

  const tabContainerHeight = 46

  const minimalEntriesListHeight = viewPortHeight - tabContainerHeight

  const activeTab = pathname

  const handleTabChange = (tabId) => RouterPush(history, tabId)

  const tabs = [
    {
      tabId: RouteMap.NEW_ENTRY,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-feather-alt"></i>,
      className: "fade-in",
      render: (
        <Row>
          <NewEntry />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_CALENDAR,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-calendar-alt"></i>,
      className: "fade-in",
      render: (
        <Row>
          <EntryCalendar />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_FOLDERS,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-folder" />,
      className: "fade-in",
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
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_LIST,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-th-list" />,
      className: "fade-in",
      render: shouldRenderNewEntryButton ? (
        <Row>
          <NewEntryButton />
        </Row>
      ) : (
        <Row>
          <EntriesList
            height={minimalEntriesListHeight}
            entries={viewableEntries}
          />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_TABLE,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-table" />,
      className: "fade-in",
      render: shouldRenderNewEntryButton ? (
        <Row>
          <NewEntryButton />
        </Row>
      ) : (
        <Row>
          <EntriesTable />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_MAP,
      mountTabOnlyWhenActive: true,
      title: <i className="fas fa-map-marked-alt" />,
      className: "fade-in",
      render: (
        <Row>
          <BasicMap
            renderUserLocation
            height={viewPortHeight - 46}
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
                  longitude,
                })
              } else if (entryId === "MyLocation") {
                SetEditorState({
                  id: entryId,
                  title: "",
                  address,
                  latitude,
                  longitude,
                })
                return RouterPush(history, RouteMap.NEW_ENTRY)
              } else {
                return GoToEntryDetail(entryId, history)
              }
            }}
          />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
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
  userId: PropTypes.number,
  entries: EntriesPropTypes,
  TextEditor: PropTypes.object,
  nextEntryPage: PropTypes.string,
  entriesSearch: PropTypes.string,
  SyncEntries: PropTypes.func.isRequired,
  GetAllUserEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired,
  SetEditorState: PropTypes.func.isRequired,
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
    "match",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Entries, isEqual))
