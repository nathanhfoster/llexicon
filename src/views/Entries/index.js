import React, { Component, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Row, Button, ButtonGroup } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import TagsContainer from "../../components/TagsContainer"
import { stripHtml } from "../../helpers"
import deepEquals from "../../helpers/deepEquals"
import { SyncEntries, GetAllUserEntries, GetUserEntries } from "../../actions/Entries"
import { SetEditorState } from "../../actions/TextEditor"
import EntriesMinimal from "../../components/EntriesMinimal"
import EntriesDetailed from "../../components/EntriesDetailed"
import BasicTabs from "../../components/BasicTabs"
import BasicTable from "../../components/BasicTable"
import BasicMap from "../../components/BasicMap"
import Moment from "react-moment"
import MomentJS from "moment"
import NewEntry from "../NewEntry"
import DiaryCalendar from "../DiaryCalendar"
import "./styles.css"

const mapStateToProps = ({
  Entries: { items, next, search },
  TextEditor,
  Window: {
    innerHeight,
    screen: { availHeight },
    navBarHeight
  }
}) => ({
  entries: items
    .filter(item => !item.shouldDelete)
    .sort((a, b) => new Date(b.date_created_by_author) - new Date(a.date_created_by_author)),
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

class Entries extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    SyncEntries: PropTypes.func.isRequired,
    GetAllUserEntries: PropTypes.func.isRequired,
    GetUserEntries: PropTypes.func.isRequired,
    SetEditorState: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    let {
      entries,
      TextEditor,
      nextEntryPage,
      viewPortHeight,
      history,
      location: { pathname }
    } = nextProps

    if (pathname === RouteMap.ENTRIES) {
      RouterPush(history, RouteMap.ENTRIES_MINIMAL)
    }

    if (TextEditor.latitude && TextEditor.longitude) {
      entries.push({ ...TextEditor })
    }

    const tabContainerHeight = 54

    const loadButtonContainerHeight = 38

    const minimalEntriesListHeight = viewPortHeight - tabContainerHeight - loadButtonContainerHeight

    const detailedEntriesListHeight = viewPortHeight - tabContainerHeight

    let listItemHeight = detailedEntriesListHeight / 2

    if (detailedEntriesListHeight / 3 > listItemHeight) listItemHeight = detailedEntriesListHeight / 3

    return {
      entries,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab: pathname
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    return propsChanged
  }

  handleDeleteEntry = id => {
    const { DeleteEntry } = this.props
    DeleteEntry(id)
  }

  handleItemsRendered = ({ overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex }) => {
    const { entries } = this.state
    const { length } = entries
    const bottomOfListIndex = length === 0 ? length : length - 1
    const reachedBottomOfList = bottomOfListIndex !== 0 && overscanStopIndex === bottomOfListIndex

    // console.log("overscanStopIndex: ", overscanStopIndex)
    // console.log("visibleStopIndex: ", visibleStopIndex)
    // console.log("reachedBottomOfList: ", reachedBottomOfList)
    // console.log("---------------------------------------")

    if (reachedBottomOfList) {
      this.GetEntries()
    }
  }

  GetEntries = () => {
    const { SyncEntries, GetUserEntries, entriesSearch, nextEntryPage } = this.props

    if (entriesSearch || !nextEntryPage) {
      return
    }

    const split = nextEntryPage.split(/\?page=(.*)/)
    const pageNumber = split[1]

    SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(pageNumber))))
  }

  GetAllEntries = () => {
    const { SyncEntries, GetAllUserEntries } = this.props

    SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntries())))
  }

  handleFilter = (key, value) => {}

  render() {
    const { history, viewPortHeight, SetEditorState, nextEntryPage } = this.props
    const {
      entries,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab
    } = this.state

    const tabs = [
      {
        tabId: RouteMap.NEW_ENTRY,
        mountTabWhenActive: true,
        title: <i className="fas fa-feather-alt"></i>,
        render: (
          <Row>
            <NewEntry />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.CALENDAR,
        mountTabWhenActive: true,
        title: <i className="fas fa-calendar-alt"></i>,
        render: (
          <Row>
            <DiaryCalendar />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.ENTRIES_DETAILED,
        mountTabWhenActive: true,
        title: <i className="fas fa-newspaper" />,
        render: (
          <Row>
            <EntriesDetailed
              height={detailedEntriesListHeight}
              entries={entries}
              itemSize={listItemHeight}
              onItemsRendered={this.handleItemsRendered}
            />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.ENTRIES_MINIMAL,
        mountTabWhenActive: true,
        title: <i className="fas fa-th-list" />,
        render: (
          <Fragment>
            <Row>
              <EntriesMinimal
                height={minimalEntriesListHeight}
                entries={entries}
                onItemsRendered={this.handleItemsRendered}
              />
            </Row>
            <Row className="Center" tag={ButtonGroup}>
              {nextEntryPage && (
                <Button color="accent" onClick={this.GetEntries}>
                  <i className="fas fa-cloud-download-alt" /> Load More
                </Button>
              )}
              <Button color="accent" onClick={this.GetAllEntries}>
                <i className="fas fa-cloud-download-alt" /> Load All
              </Button>
            </Row>
          </Fragment>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.ENTRIES_TABLE,
        mountTabWhenActive: true,
        title: <i className="fas fa-table" />,
        render: (
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
                    RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${item.id}`)),
                  render: item => <Moment format="D MMM YY hh:mma">{item.date_created_by_author}</Moment>,
                  sort: (a, b, sortUp) =>
                    sortUp
                      ? new Date(b.date_created_by_author) - new Date(a.date_created_by_author)
                      : new Date(a.date_created_by_author) - new Date(b.date_created_by_author),
                  filter: searchValue => item => {
                    if (searchValue) {
                      const momentCreatedByAuthor = MomentJS(item.date_created_by_author)
                      const momentOfSearchValue = MomentJS(searchValue)

                      return momentCreatedByAuthor >= momentOfSearchValue
                    } else {
                      return true
                    }
                  },
                  filterPlaceholder: "Created"
                },
                {
                  title: <i className="fas fa-pencil-alt" />,
                  key: "date_updated",
                  width: 130,
                  render: item => (
                    <Moment format="D MMM YY hh:mma">{item.lastUpdated || item.date_updated}</Moment>
                  ),
                  sort: (a, b, sortUp) =>
                    sortUp
                      ? new Date(b.lastUpdated || b.date_updated) - new Date(a.lastUpdated || a.date_updated)
                      : new Date(a.lastUpdated || a.date_updated) - new Date(b.lastUpdated || b.date_updated),
                  filter: searchValue => item => {
                    if (searchValue) {
                      const momentCreatedByAuthor = MomentJS(item.lastUpdated || item.date_updated)
                      const momentOfSearchValue = MomentJS(searchValue)

                      return momentCreatedByAuthor >= momentOfSearchValue
                    } else {
                      return true
                    }
                  },
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
                    item.tags
                      .map(t => t.title)
                      .join()
                      .toUpperCase()
                      .includes(searchValue.toUpperCase()),
                  render: item => <TagsContainer tags={item.tags} />
                },

                {
                  title: <i className="fas fa-heading" />,
                  key: "title",
                  filter: searchValue => item => item.title.toUpperCase().includes(searchValue.toUpperCase()),
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
                  filter: "number",
                  filterPlaceholder: "<="
                },
                {
                  title: <i className="fas fa-photo-video" />,
                  key: "EntryFiles",
                  width: 60,
                  render: item => <span className="Center">{item.EntryFiles.length}</span>,
                  sort: (a, b, sortUp) =>
                    sortUp
                      ? b.EntryFiles.length - a.EntryFiles.length
                      : a.EntryFiles.length - b.EntryFiles.length,
                  filter: searchValue => item => item.EntryFiles.length >= searchValue,
                  filterPlaceholder: "<="
                }
              ]}
              data={entries}
            />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.ENTRIES_MAP,
        mountTabWhenActive: true,
        title: <i className="fas fa-map-marked-alt" />,
        render: (
          <Row>
            <BasicMap
              renderUserLocation
              height={viewPortHeight - 54}
              locations={entries}
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
                  return RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${entryId}`))
                }
              }}
            />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
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
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Entries))
