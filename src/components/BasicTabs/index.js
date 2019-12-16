import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import "./styles.css"

class BasicTabs extends PureComponent {
  constructor(props) {
    super(props)
    const { defaultTab, tabs } = props
    let firstTabId = null

    if (tabs.length > 0) {
      firstTabId = tabs[0].tabId
    }

    this.state = { activeTab: defaultTab || firstTabId }
  }

  static propTypes = {
    containerClassname: PropTypes.string,
    defaultTab: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        title: PropTypes.string.isRequired,
        Component: PropTypes.any.isRequired,
        onClickCallback: PropTypes.func
      }).isRequired
    )
  }

  static defaultProps = {
    tabs: [
      { tabId: 1, title: "1", Component: () => <div>Component 1</div> },
      { tabId: 2, title: "2", Component: () => <div>Component 2</div> },
      { tabId: 3, title: "3", Component: () => <div>Component 3</div> }
    ]
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeTab, tabs } = nextProps

    return { tabs, activeTab: activeTab || prevState.activeTab }
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  handleTabChanged = activeTab => this.setState({ activeTab })

  renderNavItems = (activeTab, tabs) =>
    tabs.map(tab => {
      const { tabId, title, onClickCallback } = tab
      return (
        <NavItem key={tabId}>
          <NavLink
            className={`${activeTab === tabId ? "active" : ""}`}
            onClick={() =>
              onClickCallback
                ? onClickCallback(tabId)
                : this.handleTabChanged(tabId)
            }
          >
            {title}
          </NavLink>
        </NavItem>
      )
    })

  renderTabs = (activeTab, tabs) =>
    tabs.map(tab => {
      const { tabId, Component, className } = tab
      return (
        <Row
          tag={TabContent}
          key={tabId}
          activeTab={activeTab}
          className={className}
        >
          <TabPane tabId={tabId}>
            <Component />
          </TabPane>
        </Row>
      )
    })

  render() {
    const { containerClassname } = this.props
    const { activeTab, tabs } = this.state

    return (
      <Container className={`BasicTabs Container ${containerClassname}`}>
        <Row>
          <Nav tabs>{this.renderNavItems(activeTab, tabs)}</Nav>
        </Row>
        {this.renderTabs(activeTab, tabs)}
      </Container>
    )
  }
}
export default BasicTabs
