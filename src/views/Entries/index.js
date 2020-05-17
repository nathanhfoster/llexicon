import React, { useEffect, useMemo, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Row } from "reactstrap"
import { RouteMap, RouterPush } from "../../redux/router/actions"
import { BasicTabs, NewEntryButton, EntriesTable } from "../../components"
import NewEntry from "../NewEntry"
import { GetUserEntries } from "../../redux/Entries/actions"
import "./styles.css"

const EntryCalendar = lazy(() => import("../../components/EntryComponents/EntryCalendar"))
const EntryFolders = lazy(() => import("../../components/EntryComponents/EntryFolders"))
const EntriesList = lazy(() => import("../../components/EntryComponents/EntriesList"))
const EntriesMap = lazy(() => import("../../components/EntryComponents/EntriesMap"))

const mapStateToProps = ({
  User: { id },
  Entries: { items },
  TextEditor,
  Window: { innerHeight, navBarHeight },
  router: {
    location: { pathname },
  },
}) => ({
  userId: id,
  entries: items,
  TextEditor,
  viewPortHeight: innerHeight - navBarHeight,
  pathname,
})

const mapDispatchToProps = {
  GetUserEntries,
}

const Entries = ({
  userId,
  entries,
  TextEditor,
  viewPortHeight,
  GetUserEntries,
  pathname,
}) => {
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
    RouterPush(RouteMap.ENTRIES_LIST)
  }

  if (TextEditor.latitude && TextEditor.longitude) {
    viewableEntries.push({ ...TextEditor })
  }

  const tabContainerHeight = 46

  const minimalEntriesListHeight = viewPortHeight - tabContainerHeight

  const activeTab = pathname

  const handleTabChange = (tabId) => RouterPush(tabId)

  const tabs = [
    {
      tabId: RouteMap.NEW_ENTRY,
      mountTabOnlyWhenActive: true,
      title: {
        name: "Create Entry",
        render: <i className="fas fa-feather-alt" />,
      },
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
      title: {
        name: "Entries Calendar",
        render: <i className="fas fa-calendar-alt" />,
      },
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
      title: {
        name: "Entries Folders",
        render: <i className="fas fa-folder" />,
      },
      className: "fade-in",
      render: (
        <Row>
          {shouldRenderNewEntryButton ? (
            <NewEntryButton />
          ) : (
            <EntryFolders entries={viewableEntries} />
          )}
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_LIST,
      mountTabOnlyWhenActive: true,
      title: { name: "Entries List", render: <i className="fas fa-th-list" /> },
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
      title: { name: "Entries Table", render: <i className="fas fa-table" /> },
      className: "fade-in",
      render: shouldRenderNewEntryButton ? (
        <Row>
          <NewEntryButton />
        </Row>
      ) : (
        <Row className="ShowScrollBar">
          <EntriesTable />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: RouteMap.ENTRIES_MAP,
      mountTabOnlyWhenActive: true,
      title: {
        name: "Entries Map",
        render: <i className="fas fa-map-marked-alt" />,
      },
      className: "fade-in",
      render: (
        <Row>
          <EntriesMap height={viewPortHeight - 46} />
        </Row>
      ),
      onClickCallback: handleTabChange,
    },
  ]
  const fluid = useMemo(
    () =>
      activeTab === RouteMap.ENTRIES_CALENDAR ||
      activeTab === RouteMap.ENTRIES_TABLE ||
      activeTab === RouteMap.ENTRIES_MAP,
    [activeTab]
  )

  return (
    <BasicTabs
      className="EntryTabs"
      fluid={fluid}
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

  GetUserEntries: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
