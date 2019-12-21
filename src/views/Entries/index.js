import React, { Component, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Row, Button, ButtonGroup } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import TagsContainer from "../../components/TagsContainer"

import { SyncEntries, GetAllUserEntries, GetUserEntries } from "../../actions/Entries"
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
  Window: {
    innerHeight,
    screen: { availHeight },
    navBarHeight
  }
}) => ({
  UserId: User.id,
  entries: items
    .filter(item => !item.shouldDelete)
    .sort((a, b) => new Date(b.date_created_by_author) - new Date(a.date_created_by_author)),
  nextEntryPage: next,
  entriesSearch: search,
  viewPortHeight: innerHeight - navBarHeight
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntries, GetUserEntries }

class Entries extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    SyncEntries: PropTypes.func.isRequired,
    GetAllUserEntries: PropTypes.func.isRequired,
    GetUserEntries: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      entries,
      nextEntryPage,
      viewPortHeight,
      history,
      location: { pathname }
    } = nextProps

    if (pathname === RouteMap.ENTRIES) {
      RouterPush(history, RouteMap.ENTRIES_MINIMAL)
    }

    const tabContainerHeight = 54

    const loadButtonContainerHeight = 38

    const minimalEntriesListHeight = viewPortHeight - tabContainerHeight - loadButtonContainerHeight

    const detailedEntriesListHeight = viewPortHeight - tabContainerHeight

    let listItemHeight = detailedEntriesListHeight / 2

    if (detailedEntriesListHeight / 3 > listItemHeight) listItemHeight = detailedEntriesListHeight / 3

    return {
      entries,
      nextEntryPage,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab: pathname
    }
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
    const { SyncEntries, GetUserEntries, entriesSearch } = this.props
    const { nextEntryPage } = this.state

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

  render() {
    const { history } = this.props
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
        tabId: RouteMap.ENTRIES_MINIMAL,
        title: () => (
          <span>
            <i className="fas fa-th-list" /> Timeline
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

              <Button color="accent" onClick={this.GetAllEntries} disabled={!nextEntryPage}>
                <i className="fas fa-cloud-download-alt" /> Load All
              </Button>
            </Row>
          </Fragment>
        ),
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_MINIMAL)
      },
      {
        tabId: RouteMap.ENTRIES_DETAILED,
        title: () => (
          <span>
            <i className="fas fa-feather-alt" /> Entries
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
        tabId: RouteMap.ENTRIES_TABLE,
        title: () => (
          <span>
            <i className="fas fa-table" /> Table
          </span>
        ),
        render: () => (
          <Row>
            <BasicTable
              columns={[
                {
                  title: () => <i className="fas fa-star" />,
                  key: "rating",
                  width: 20,
                  onRowClick: item =>
                    RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${item.id}`))
                },
                {
                  title: "Tags",
                  dataIndex: "tags",
                  key: "id",
                  width: 100,
                  render: item => <TagsContainer tags={item.tags} overflowX="auto" />
                },

                {
                  title: "Title",
                  dataIndex: "title",
                  key: "title",
                  width: "25%"
                },
                {
                  title: "Body",
                  dataIndex: "html",
                  key: "html"
                  // width: '25%'
                },
                {
                  title: "Location",
                  key: "address"
                  // width: '25%'
                },
                {
                  title: () => <i className="far fa-eye" />,
                  key: "views",
                  width: 40
                },

                {
                  title: "Date",
                  dataIndex: "date_created_by_author",
                  key: "date_created_by_author",
                  width: 100,
                  render: item => <Moment format="D MMM YY">{item.date_created_by_author}</Moment>
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
        title: () => (
          <span>
            <i className="fas fa-map-marked-alt" /> Map
          </span>
        ),
        render: () => (
          <Row>
            <BasicMap renderUserLocation />
          </Row>
        ),
        onClickCallback: () => RouterPush(history, RouteMap.ENTRIES_MAP)
      }
    ]

    return <BasicTabs activeTab={activeTab} tabs={tabs} />
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Entries))
