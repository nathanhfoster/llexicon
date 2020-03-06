import React, { useState, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { NavItem, NavLink, DropdownItem } from "reactstrap"
import { NavLink as RouterNavLink, withRouter } from "react-router-dom"
import { RouterLinkPush } from "../../../routes"
import "./styles.css"

const NavItemLink = ({
  dropdownItem,
  route,
  title,
  icon,
  onClick,
  history,
  onClickCallback,
  render
}) => {
  const [reRender, forceUpdate] = useState(false)

  const renderNavLink = useMemo(
    () =>
      render || (
        <NavItem key={title} tag="div">
          <NavLink
            activeClassName="active"
            className="Navlink"
            tag={RouterNavLink}
            to={RouterLinkPush(history, route)}
            onClick={() => {
              forceUpdate(!reRender)
              onClick && onClick()
              onClickCallback && onClickCallback()
            }}
          >
            {icon}
            <span className="NavBarLink">{title}</span>
          </NavLink>
        </NavItem>
      ),
    [title]
  )

  return dropdownItem ? (
    <DropdownItem className="Navlink">{renderNavLink}</DropdownItem>
  ) : (
    renderNavLink
  )
}

NavItemLink.propTypes = {
  dropdownItem: PropTypes.bool.isRequired,
  route: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.object,
  onClick: PropTypes.func,
  onClickCallback: PropTypes.func,
  render: PropTypes.object
}

const isEqual = (prevProps, nextProps) => prevProps.title === nextProps.title

NavItemLink.defaultProps = { dropdownItem: false }

export default withRouter(memo(NavItemLink, isEqual))
