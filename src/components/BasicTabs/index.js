import React, { Component } from "react"
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
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

class BasicTabs extends Component {
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
        unMountOnExit: PropTypes.bool,
        title: PropTypes.oneOfType([
          PropTypes.string.isRequired,
          PropTypes.func
        ]),
        render: PropTypes.func.isRequired,
        onClickCallback: PropTypes.func
      }).isRequired
    )
  }

  static defaultProps = {
    fluid: false,
    tabs: [
      { tabId: 1, title: "1", render: () => <div>render 1</div> },
      { tabId: 2, title: "2", render: () => <div>render 2</div> },
      { tabId: 3, title: "3", render: () => <div>render 3</div> }
    ]
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeTab, tabs, fluid } = nextProps

    return { tabs, activeTab: activeTab || prevState.activeTab, fluid }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  handleTabChanged = activeTab => this.setState({ activeTab })

  renderNavItems = (activeTab, tabs) =>
    tabs.map(tab => {
      const { tabId, title, onClickCallback } = tab
      const titleFunction = typeof title === "function" ? true : false
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
            {titleFunction ? title(tab) : title}
          </NavLink>
        </NavItem>
      )
    })

  renderTabs = (activeTab, tabs) =>
    tabs.map(tab => {
      const { tabId, render, unMountOnExit, className } = tab
      const shouldNotRender = unMountOnExit === true && activeTab !== tabId
      return shouldNotRender ? null : (
        <TabContent key={tabId} activeTab={activeTab} className={className}>
          <TabPane tabId={tabId}>{render(tab)}</TabPane>
        </TabContent>
      )
    })

  render() {
    const { containerClassname } = this.props
    const { activeTab, tabs, fluid } = this.state

    return (
      <Container
        fluid={fluid}
        className={`BasicTabs Container ${containerClassname}`}
      >
        <Row>
          <Nav tabs>{this.renderNavItems(activeTab, tabs)}</Nav>
        </Row>
        {this.renderTabs(activeTab, tabs)}
      </Container>
    )
  }
}
export default BasicTabs
