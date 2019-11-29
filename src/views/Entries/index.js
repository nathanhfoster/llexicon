import React, { Component, createRef } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button } from "reactstrap";
import Entry from "../../components/Entry";
import { FixedSizeList } from "react-window";
import { SyncEntries, GetUserEntries } from "../../actions/Entries";
import EntryMinimal from "../../components/EntryMinimal";
import "./styles.css";

const mapStateToProps = ({
  User,
  Entries: { items, next },
  Window: {
    screen: { availHeight }
  }
}) => ({
  UserId: User.id,
  entries: items
    .filter(item => !item.shouldDelete)
    .sort((a, b) => new Date(b.date_created_by_author) - new Date(a.date_created_by_author)),
  nextEntryPage: next,
  viewPortHeight: availHeight
});

const mapDispatchToProps = { SyncEntries, GetUserEntries };

class Entries extends Component {
  constructor(props) {
    super(props);

    this.listRef = createRef();

    this.state = {
      activeTab: 1,
      listView: true,
      minXs: 6,
      minMd: 4,
      minLg: 3,
      minXl: 2
    };
  }

  static propTypes = {
    UserId: PropTypes.number,
    SyncEntries: PropTypes.func.isRequired,
    GetUserEntries: PropTypes.func.isRequired
  };

  static defaultProps = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entries, nextEntryPage, viewPortHeight } = nextProps;
    const { activeTab, listView, minXs, minMd, minLg, minXl } = prevState;

    const inputHeight = 46;

    const listHeight = viewPortHeight - inputHeight - 54;

    let listItemHeight = listHeight / 2;

    if (listHeight / 3 > listItemHeight) listItemHeight = listHeight / 3;

    return {
      entries,
      nextEntryPage,
      listHeight,
      listItemHeight,
      activeTab,
      listView,
      minXs,
      minMd,
      minLg,
      minXl
    };
  }

  componentDidMount() {
    const { UserId, SyncEntries, GetUserEntries } = this.props;
    if (UserId) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))));
    }
  }

  componentWillUnmount() {}

  handleDeleteEntry = id => {
    const { DeleteEntry } = this.props;
    DeleteEntry(id);
  };

  handleItemsRendered = ({ overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex }) => {
    const { entries } = this.state;
    const { length } = entries;
    const bottomOfListIndex = length === 0 ? length : length - 1;
    const reachedBottomOfList = bottomOfListIndex !== 0 && visibleStopIndex === bottomOfListIndex;
    // console.log("overscanStopIndex: ", overscanStopIndex)
    // console.log("visibleStopIndex: ", visibleStopIndex)
    // console.log("reachedBottomOfList: ", reachedBottomOfList)
    // console.log("---------------------------------------")

    if (reachedBottomOfList) {
      this.GetEntries();
    }
  };

  GetEntries = () => {
    const { SyncEntries, GetUserEntries } = this.props;
    const { nextEntryPage } = this.state;

    if (!nextEntryPage) return;

    const split = nextEntryPage.split(/\?page=(.*)/);
    const pageNumber = split[1];

    SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(pageNumber))));
  };

  renderMinimalEntries = entries => {
    const { listView, minXs, minMd, minLg, minXl } = this.state;
    return entries.map(entry => {
      return listView ? (
        <Col key={entry.id} xs={12} style={{ padding: 4 }}>
          <EntryMinimal {...entry} />
        </Col>
      ) : (
        <Col key={entry.id} xs={minXs} md={minMd} lg={minLg} xl={minXl} style={{ padding: 4 }}>
          <EntryMinimal {...entry} />
        </Col>
      );
    });
  };

  renderDetailedEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index];
    const { id, ...restOfProps } = entry;

    return (
      <Col key={id} style={{ ...style /* background: "red" */ }} xs={12} className="p-0">
        <Entry key={id} id={id} {...restOfProps} containerHeight={style.height} showDivider />
      </Col>
    );
  };

  handleListLayoutClick = () => {
    this.setState(currentState => ({ listView: !currentState.listView }));
  };

  render() {
    const { entries, listHeight, listItemHeight, activeTab, listView, nextEntryPage } = this.state;

    return (
      <Container className="Entries Container">
        <Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={`${activeTab === 1 ? "active" : ""}`}
                onClick={() => this.setState({ activeTab: 1 })}
              >
                <i
                  className={`MinimalEntryListToggle fas ${listView ? "fa-columns" : "fa-list-ul"}`}
                  onClick={this.handleListLayoutClick}
                />{" "}
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
            <Row>{this.renderMinimalEntries(entries)}</Row>
            {nextEntryPage && (
              <Row className="Center">
                <Button color="accent" onClick={this.GetEntries}>
                  <i className="fas fa-cloud-download-alt" /> Load More
                </Button>
              </Row>
            )}
          </TabPane>
        </TabContent>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={2}>
            <Row>
              <FixedSizeList
                ref={this.listRef}
                height={listHeight}
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
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries);
