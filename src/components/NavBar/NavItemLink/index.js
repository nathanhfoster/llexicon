import React, { memo } from "react"
import PropTypes from "prop-types"
import { NavItem, NavLink, DropdownItem } from "reactstrap"
import { NavLink as RouterNavLink, withRouter } from "react-router-dom"
import { RouterLinkPush } from "store/reducers/router/actions"
import "./styles.css"

const NavItemLink = ({
  dropdownItem,
  route,
  title,
  icon,
  onClick,
  onClickCallback,
  render,
}) => {
  const handleCLick = () => {
    onClick && onClick()
    onClickCallback && onClickCallback()
  }

  const renderNavLink = () =>
    render || (
      <NavItem key={title} tag={"div"}>
        <NavLink
          activeClassName="active"
          className="Navlink"
          tag={RouterNavLink}
          to={RouterLinkPush(route)}
          onClick={handleCLick}
        >
          {icon}
          <span className="NavBarLink">{title}</span>
        </NavLink>
      </NavItem>
    )

  return dropdownItem ? (
    <DropdownItem className="Navlink">{renderNavLink()}</DropdownItem>
  ) : (
    renderNavLink()
  )
}

NavItemLink.propTypes = {
  dropdownItem: PropTypes.bool.isRequired,
  route: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  onClickCallback: PropTypes.func,
  render: PropTypes.node,
}

NavItemLink.defaultProps = { dropdownItem: false }

export default withRouter(memo(NavItemLink))
