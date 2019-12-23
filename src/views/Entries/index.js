import React, { Component, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Row, Button, ButtonGroup } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import TagsContainer from "../../components/TagsContainer"
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
      nextEntryPage,
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
    const { SyncEntries, GetUserEntries, entriesSearch } = this.props
    const { nextEntryPage } = this.state

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

  render() {
    const { history, viewPortHeight, SetEditorState } = this.props
    const {
      entries,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab,
      nextEntryPage
    } = this.state

    const tabs = [
      {
        tabId: RouteMap.ENTRIES_DETAILED,
        title: () => (
          <span>
            <i className="fas fa-feather-alt" />
          </span>
        ),
        render: () => (
          <Row>
            <EntriesDetailed
              height={detailedEntriesListHeight}
              entries={entries}
              itemSize={listItemHeight}
              onItemsRendered={this.handleItemsRendered}
            />
          </Row>
        ),
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_DETAILED)
      },
      {
        tabId: RouteMap.ENTRIES_MINIMAL,
        title: () => (
          <span>
            <i className="fas fa-th-list" />
          </span>
        ),
        render: () => (
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
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_MINIMAL)
      },

      {
        tabId: RouteMap.ENTRIES_TABLE,
        title: () => (
          <span>
            <i className="fas fa-table" />
          </span>
        ),
        render: () => (
          <Row>
            <BasicTable
              columns={[
                {
                  title: () => <i className="fas fa-star" />,
                  key: "rating",
                  width: 30,
                  render: item => <span className="ml-1">{item.rating}</span>,
                  onRowClick: item =>
                    RouterPush(
                      history,
                      RouteMap.ENTRY_DETAIL.replace(":entryId", `${item.id}`)
                    )
                },
                {
                  title: item => <i className="fas fa-tags p-0" />,
                  dataIndex: "tags",
                  key: "id",
                  width: 80,
                  render: item => <TagsContainer tags={item.tags} />
                },

                {
                  title: title => <i className="fas fa-heading" />,
                  dataIndex: "title",
                  key: "title",
                  width: "25%"
                },
                {
                  title: item => <i className="fas fa-keyboard" />,
                  dataIndex: "html",
                  key: "html"
                },
                {
                  title: item => <i className="fas fa-map-marker-alt" />,
                  key: "address"
                },
                {
                  title: () => <i className="far fa-eye" />,
                  key: "views",
                  width: 40,
                  render: item => <span className="Center">{item.views}</span>
                },
                {
                  title: () => <i className="fas fa-star" />,
                  key: "rating",
                  width: 40,
                  render: item => <span className="Center">{item.rating}</span>
                },
                {
                  title: () => <i className="fas fa-photo-video" />,
                  key: "EntryFiles",
                  width: 40,
                  render: item => (
                    <span className="Center">{item.EntryFiles.length}</span>
                  )
                },

                {
                  title: item => <i className="fas fa-calendar-day" />,
                  dataIndex: "date_created_by_author",
                  key: "date_created_by_author",
                  width: 100,
                  render: item => (
                    <Moment format="D MMM YY">
                      {item.date_created_by_author}
                    </Moment>
                  )
                }
              ]}
              data={entries}
            />
          </Row>
        ),
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_TABLE)
      },
      {
        tabId: RouteMap.ENTRIES_MAP,
        unMountOnExit: true,
        title: () => (
          <span>
            <i className="fas fa-map-marked-alt" />
          </span>
        ),
        render: () => (
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
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_MAP)
      }
    ]

    return (
      <BasicTabs
        fluid={
          activeTab === RouteMap.ENTRIES_TABLE ||
          activeTab === RouteMap.ENTRIES_MAP
        }
        activeTab={activeTab}
        tabs={tabs}
      />
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
)
