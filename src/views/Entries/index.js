import React, { Component, createRef } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  ButtonGroup
} from "reactstrap"
import Entry from "../../components/Entry"
import { FixedSizeList } from "react-window"
import {
  SyncEntries,
  GetAllUserEntries,
  GetUserEntries
} from "../../actions/Entries"
import EntryMinimal from "../../components/EntryMinimal"
import "./styles.css"

const mapStateToProps = ({
  User,
  Entries: { items, next, search },
  Window: {
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
  nextEntryPage: next,
  entriesSearch: search,
  viewPortHeight: availHeight - navBarHeight
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntries, GetUserEntries }

class Entries extends Component {
  constructor(props) {
    super(props)

    this.minimalEntriesListRef = createRef()
    this.detailedEntriesListRef = createRef()

    this.state = {
      activeTab: 1
    }
  }

  static propTypes = {
    UserId: PropTypes.number,
    SyncEntries: PropTypes.func.isRequired,
    GetAllUserEntries: PropTypes.func.isRequired,
    GetUserEntries: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entries, nextEntryPage, viewPortHeight } = nextProps
    const { activeTab } = prevState

    const inputHeight = 46

    const minimalEntriesListHeight = viewPortHeight - 54 - 38 - 22

    const detailedEntriesListHeight = viewPortHeight - 54 - 22

    let listItemHeight = detailedEntriesListHeight / 2

    if (detailedEntriesListHeight / 3 > listItemHeight)
      listItemHeight = detailedEntriesListHeight / 3

    return {
      entries,
      nextEntryPage,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab
    }
  }

  componentDidMount() {
    const { UserId, SyncEntries, GetUserEntries } = this.props
    if (UserId) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))))
    }
  }

  componentWillUnmount() {}

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
      bottomOfListIndex !== 0 && visibleStopIndex === bottomOfListIndex
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

  renderMinimalEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index]

    return (
      <Col key={entry.id} xs={12} style={{ ...style, padding: 4 }}>
        <EntryMinimal {...entry} />
      </Col>
    )
  }

  renderDetailedEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index]
    const { id, ...restOfProps } = entry

    return (
      <Col
        key={id}
        style={{ ...style /* background: "red" */ }}
        xs={12}
        className="p-0"
      >
        <Entry
          key={id}
          id={id}
          {...restOfProps}
          containerHeight={style.height}
          bottomToolbarHidden
        />
      </Col>
    )
  }

  render() {
    const {
      entries,
      minimalEntriesListHeight,
      detailedEntriesListHeight,
      listItemHeight,
      activeTab,
      nextEntryPage
    } = this.state

    return (
      <Container className="Entries Container">
        <Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={`${activeTab === 1 ? "active" : ""}`}
                onClick={() => this.setState({ activeTab: 1 })}
              >
                Minimal
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${activeTab === 2 ? "active" : ""}`}
                onClick={() => this.setState({ activeTab: 2 })}
              >
                Detailed
              </NavLink>
            </NavItem>
          </Nav>
        </Row>

        <TabContent activeTab={activeTab}>
          <TabPane tabId={1}>
            <Row>
              <FixedSizeList
                ref={this.minimalEntriesListRef}
                height={minimalEntriesListHeight}
                width="100%"
                itemData={entries}
                itemCount={entries.length}
                itemSize={48}
                onItemsRendered={this.handleItemsRendered}
              >
                {this.renderMinimalEntries}
              </FixedSizeList>
              {/* {this.renderMinimalEntries(entries)} */}
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
          </TabPane>
        </TabContent>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={2}>
            <Row>
              <FixedSizeList
                ref={this.detailedEntriesListRef}
                height={detailedEntriesListHeight}
                width="100%"
                itemData={entries}
                itemCount={entries.length}
                itemSize={listItemHeight}
                onItemsRendered={this.handleItemsRendered}
              >
                {this.renderDetailedEntries}
              </FixedSizeList>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
