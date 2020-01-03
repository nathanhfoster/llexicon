import React, { Component, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Row, Button, ButtonGroup } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import TagsContainer from "../../components/TagsContainer"
import { stripHtml } from "../../helpers"
import deepEquals from "../../helpers/deepEquals"
import {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries
} from "../../actions/Entries"
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
  User,
  Entries: { items, next, search },
  TextEditor,
  Window: {
    innerHeight,
    screen: { availHeight },
    navBarHeight
  }
}) => ({
  UserId: User.id,
  fluid: User.Settings.full_container_width,
  entries: items
    .filter(item => !item.shouldDelete)
    .sort(
      (a, b) =>
        new Date(b.date_created_by_author) - new Date(a.date_created_by_author)
    ),
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
    UserId: PropTypes.number,
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

    const minimalEntriesListHeight =
      viewPortHeight - tabContainerHeight - loadButtonContainerHeight

    const detailedEntriesListHeight = viewPortHeight - tabContainerHeight

    let listItemHeight = detailedEntriesListHeight / 2

    if (detailedEntriesListHeight / 3 > listItemHeight)
      listItemHeight = detailedEntriesListHeight / 3

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

  componentDidMount() {
    const { UserId, SyncEntries, GetUserEntries } = this.props
    const { entries } = this.state
    if (UserId && entries.length === 0) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))))
    }
  }

  handleDeleteEntry = id => {
    const { DeleteEntry } = this.props
    DeleteEntry(id)
  }

  handleItemsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }) => {
    const { entries } = this.state
    const { length } = entries
    const bottomOfListIndex = length === 0 ? length : length - 1
    const reachedBottomOfList =
      bottomOfListIndex !== 0 && overscanStopIndex === bottomOfListIndex

    // console.log("overscanStopIndex: ", overscanStopIndex)
    // console.log("visibleStopIndex: ", visibleStopIndex)
    // console.log("reachedBottomOfList: ", reachedBottomOfList)
    // console.log("---------------------------------------")

    if (reachedBottomOfList) {
      this.GetEntries()
    }
  }

  GetEntries = () => {
    const {
      SyncEntries,
      GetUserEntries,
      entriesSearch,
      nextEntryPage
    } = this.props

    if (entriesSearch || !nextEntryPage) {
      return
    }

    const split = nextEntryPage.split(/\?page=(.*)/)
    const pageNumber = split[1]

    SyncEntries(
      () => new Promise(resolve => resolve(GetUserEntries(pageNumber)))
    )
  }

  GetAllEntries = () => {
    const { SyncEntries, GetAllUserEntries } = this.props

    SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntries())))
  }

  handleFilter = (key, value) => {}

  render() {
    const {
      history,
      viewPortHeight,
      SetEditorState,
      fluid,
      nextEntryPage
    } = this.props
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

              <Button
                color="accent"
                onClick={this.GetAllEntries}
                disabled={!nextEntryPage}
              >
                <i className="fas fa-cloud-download-alt" /> Load All
              </Button>
            </Row>
          </Fragment>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      },
      {
        tabId: RouteMap.ENTRIES_TABLE,
        title: <i className="fas fa-table" />,
        render: (
          <Row>
            <BasicTable
              sortable
              columns={[
                {
                  title: <i className="fas fa-star" />,
                  key: "rating",
                  width: 60,
                  render: item => <span className="ml-2">{item.rating}</span>,
                  filter: "number",
                  filterPlaceholder: "<=",
                  onRowClick: item =>
                    RouterPush(
                      history,
                      RouteMap.ENTRY_DETAIL.replace(":entryId", `${item.id}`)
                    )
                },
                {
                  title: <i className="fas fa-tags" />,
                  dataIndex: "tags",
                  key: "id",
                  width: 80,
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
                  dataIndex: "title",
                  key: "title",
                  filter: searchValue => item =>
                    item.title
                      .toUpperCase()
                      .includes(searchValue.toUpperCase()),
                  width: "25%"
                },
                {
                  title: <i className="fas fa-keyboard" />,
                  key: "html",
                  render: item => stripHtml(item.html),
                  filter: "string"
                },
                {
                  title: <i className="fas fa-map-marker-alt" />,
                  key: "address",
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
                },

                {
                  title: <i className="fas fa-calendar-day" />,
                  dataIndex: "date_created_by_author",
                  key: "date_created_by_author",
                  width: 100,
                  render: item => (
                    <Moment format="D MMM YY">
                      {item.date_created_by_author}
                    </Moment>
                  ),
                  sort: (a, b, sortUp) =>
                    sortUp
                      ? new Date(b.date_created_by_author) -
                        new Date(a.date_created_by_author)
                      : new Date(a.date_created_by_author) -
                        new Date(b.date_created_by_author),
                  filter: searchValue => item => {
                    if (searchValue) {
                      const momentCreatedByAuthor = MomentJS(
                        item.date_created_by_author
                      )
                      const momentOfSearchValue = MomentJS(searchValue)

                      return momentCreatedByAuthor >= momentOfSearchValue
                    } else {
                      return true
                    }
                  },
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
        unMountOnExit: true,
        title: <i className="fas fa-map-marked-alt" />,
        render: (
          <Row>
            <BasicMap
              height={viewPortHeight - 54}
              locations={entries}
              getAddressOnMarkerClick
              onChangeCallback={({ entryId, address, latitude, longitude }) => {
                if (!entryId) return
                else if (entryId === "NewEntry") {
                  SetEditorState({
                    id: entryId,
                    title: entryId,
                    address,
                    latitude,
                    longitude
                  })
                } else if (entryId !== "MyLocation") {
                  return RouterPush(
                    history,
                    RouteMap.ENTRY_DETAIL.replace(":entryId", `${entryId}`)
                  )
                }
              }}
            />
          </Row>
        ),
        onClickCallback: tabId => RouterPush(history, tabId)
      }
    ]

    return <BasicTabs fluid={fluid} activeTab={activeTab} tabs={tabs} />
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
)
