import React, { useState, useEffect, useRef, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { isType } from '../../../utils'
import { useSwipeable } from 'react-swipeable'
import './styles.css'

const getInitialState = (activeTab, defaultTab, tabs) => {
  let firstTabId = null

  if (tabs.length > 0) {
    firstTabId = tabs[0].tabId
  }

  return defaultTab || activeTab || firstTabId
}

export const BasicTabs = ({ className, defaultTab, fluid, tabs, onClick, ...restOfProps }) => {
  const [activeTab, setActiveTab] = useState(
    getInitialState(restOfProps.activeTab, defaultTab, tabs),
  )

  const mounted = useRef()

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
    } else {
      setActiveTab(restOfProps.activeTab)
    }
  }, [restOfProps.activeTab])

  const handleTabChanged = activeTab => setActiveTab(activeTab)

  const { renderTabs, renderTabPanes, previousTab, nextTab } = useMemo(() => {
    let tabsToRender = []
    let tabPanesToRender = []
    let previousTab = null
    let nextTab = null

    for (let i = 0, { length } = tabs; i < length; i++) {
      const tab = tabs[i]
      const {
        tabId,
        title,
        width,
        onClick: onTabClick,
        render,
        mountTabOnlyWhenActive = true,
        className,
      } = tab

      const onTab = activeTab === tabId
      const titleIsObject = Boolean(typeof title === isType.OBJECT)
      const navStyle = width ? { flex: `0 0 ${width}${typeof width === 'number' ? 'px' : ''}` } : {}

      // For react-swipeable
      if (onTab) {
        const hasPreviousIndex = !previousTab && i > 0
        const hasNextIndex = !nextTab && i + 1 < length

        if (hasPreviousIndex) {
          previousTab = tabs[i - 1].tabId
        }

        if (hasNextIndex) {
          nextTab = tabs[i + 1].tabId
        }
      }

      tabsToRender.push(
        <NavItem key={tabId} title={titleIsObject ? title.name : title} style={navStyle}>
          <NavLink
            className={`BasicTabsNavLink py-2 px-3 ${onTab ? 'active' : ''}`}
            onClick={() =>
              onTabClick ? onTabClick(tabId) : onClick ? onClick(tabId) : handleTabChanged(tabId)
            }
          >
            {titleIsObject ? title.render : title}
          </NavLink>
        </NavItem>,
      )

      const shouldNotRenderTabPane = mountTabOnlyWhenActive === true && activeTab !== tabId

      tabPanesToRender.push(
        <TabContent key={tabId} activeTab={activeTab}>
          {shouldNotRenderTabPane ? null : (
            <TabPane tabId={tabId} className={className}>
              {render}
            </TabPane>
          )}
        </TabContent>,
      )
    }

    return {
      renderTabs: tabsToRender,
      renderTabPanes: tabPanesToRender,
      previousTab,
      nextTab,
      onClick,
    }
  }, [activeTab, tabs])

  const handlers = useSwipeable({
    onSwipedLeft: () => handleTabChanged(nextTab),
    onSwipedRight: () => handleTabChanged(previousTab),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    delta: 128,
  })

  return (
    <Container className={`${className} Container`} fluid={fluid}>
      <div {...handlers}>
        <Row>
          <Col className='BasicTabsNav' tag={Nav} tabs xs={12}>
            {renderTabs}
          </Col>
        </Row>
      </div>

      {renderTabPanes}
    </Container>
  )
}

BasicTabs.propTypes = {
  className: PropTypes.string,
  defaultTab: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      mountTabOnlyWhenActive: PropTypes.bool,
      title: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.shape({ name: PropTypes.string, render: PropTypes.node }),
      ]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      render: PropTypes.node.isRequired,
      onClick: PropTypes.func,
    }).isRequired,
  ),
}

BasicTabs.defaultProps = {
  className: 'BasicTabs',
  fluid: false,
  tabs: new Array(3).fill().map(i => {
    const index = i + 1
    return {
      tabId: index,
      title: `${index}`,
      render: <div>`Tab ${index}`</div>,
    }
  }),
}

export default memo(BasicTabs)
