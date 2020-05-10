import React, { useState, useEffect, useRef, useMemo, memo } from "react"
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
} from "reactstrap"
import { isType } from "../../helpers"
import "./styles.css"

const getInitialState = (activeTab, defaultTab, tabs) => {
  let firstTabId = null

  if (tabs.length > 0) {
    firstTabId = tabs[0].tabId
  }

  return defaultTab || activeTab || firstTabId
}

const BasicTabs = ({ className, defaultTab, fluid, tabs, ...restOfProps }) => {
  const [activeTab, setActiveTab] = useState(
    getInitialState(restOfProps.activeTab, defaultTab, tabs)
  )

  const mounted = useRef()

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
    } else {
      setActiveTab(restOfProps.activeTab)
    }
  }, [restOfProps.activeTab])

  const handleTabChanged = (activeTab) => setActiveTab(activeTab)

  const [renderTabs, renderTabPanes] = useMemo(() => {
    let tabsToRender = []
    let tabPanesToRender = []

    for (let i = 0, { length } = tabs; i < length; i++) {
      const tab = tabs[i]
      const {
        tabId,
        title,
        onClickCallback,
        render,
        mountTabOnlyWhenActive,
        className,
      } = tab
      const onTab = activeTab === tabId
      const titleIsObject = Boolean(typeof title === isType.OBJECT)

      tabsToRender.push(
        <NavItem key={tabId} title={titleIsObject ? title.name : title}>
          <NavLink
            className={`BasicTabsNavLink p-2 px-sm-3 py-sm-2 ${
              onTab ? "active" : ""
            }`}
            onClick={() =>
              onClickCallback ? onClickCallback(tabId) : handleTabChanged(tabId)
            }
          >
            {titleIsObject ? title.render : title}
          </NavLink>
        </NavItem>
      )

      const shouldNotRenderTabPane =
        mountTabOnlyWhenActive === true && activeTab !== tabId

      tabPanesToRender.push(
        <TabContent key={tabId} activeTab={activeTab}>
          {shouldNotRenderTabPane ? null : (
            <TabPane tabId={tabId} className={className}>
              {render}
            </TabPane>
          )}
        </TabContent>
      )
    }

    return [tabsToRender, tabPanesToRender]
  }, [activeTab, tabs])

  return (
    <Container fluid={fluid} className={`${className} Container`}>
      <Row>
        <Col tag={Nav} tabs xs={12}>
          {renderTabs}
        </Col>
      </Row>
      {renderTabPanes}
    </Container>
  )
}

BasicTabs.propTypes = {
  className: PropTypes.string,
  defaultTab: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      mountTabOnlyWhenActive: PropTypes.bool,
      title: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.shape({ name: PropTypes.string, render: PropTypes.node }),
      ]),
      render: PropTypes.node.isRequired,
      onClickCallback: PropTypes.func,
    }).isRequired
  ),
}

BasicTabs.defaultProps = {
  className: "BasicTabs",
  fluid: false,
  tabs: new Array(3).fill().map((i) => {
    const index = i + 1
    return {
      tabId: index,
      title: `${index}`,
      render: <div>`Tab ${index}`</div>,
    }
  }),
}

export default memo(BasicTabs)
