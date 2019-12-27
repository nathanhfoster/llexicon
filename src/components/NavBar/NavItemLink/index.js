import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { NavItem, NavLink, DropdownItem } from "reactstrap"
import { NavLink as RouterNavLink, withRouter } from "react-router-dom"
import { RouterLinkPush } from "../../../ReactRouter/Routes"
import "./styles.css"

class NavItemLink extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    dropdownItem: PropTypes.bool.isRequired,
    route: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onClickCallback: PropTypes.func,
    render: PropTypes.object
  }

  static defaultProps = { dropdownItem: false }

  renderNavLink = ({
    route,
    title,
    icon,
    onClick,
    history,
    onClickCallback,
    render
  }) => {
    return render || (
      <NavItem key={title}>
        <NavLink
          activeClassName="active"
          className="Navlink"
          tag={RouterNavLink}
          to={RouterLinkPush(history, route)}
          onClick={() => {
            onClick && onClick()
            onClickCallback()
          }}
        >
          {icon}
          <span className="NavBarLink">{title}</span>
        </NavLink>
      </NavItem>
    )
  }

  render() {
    const { dropdownItem, ...restOfProps } = this.props

    return dropdownItem ? (
      <DropdownItem className="Navlink">
        {this.renderNavLink(restOfProps)}
      </DropdownItem>
    ) : (
      this.renderNavLink(restOfProps)
    )
  }
}
export default withRouter(NavItemLink)
