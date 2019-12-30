import React, { Component } from "react"
import PropTypes from "prop-types"
import { NavItem, NavLink, DropdownItem } from "reactstrap"
import { NavLink as RouterNavLink, withRouter } from "react-router-dom"
import { RouterLinkPush } from "../../../ReactRouter/Routes"
import "./styles.css"

class NavItemLink extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    dropdownItem: PropTypes.bool.isRequired,
    route: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.object,
    onClick: PropTypes.func,
    onClickCallback: PropTypes.func,
    render: PropTypes.object
  }

  static defaultProps = { dropdownItem: false }

  shouldComponentUpdate(nextProps, nextState) {
    const currentTitle = this.props.title
    const { title } = nextProps

    const titleChanged = currentTitle !== title

    return titleChanged
  }

  renderNavLink = ({
    route,
    title,
    icon,
    onClick,
    history,
    onClickCallback,
    render
  }) => {
    return (
      render || (
        <NavItem key={title}>
          <NavLink
            activeClassName="active"
            className="Navlink"
            tag={RouterNavLink}
            to={RouterLinkPush(history, route)}
            onClick={() => {
              this.forceUpdate()
              onClick && onClick()
              onClickCallback && onClickCallback()
            }}
          >
            {icon}
            <span className="NavBarLink">{title}</span>
          </NavLink>
        </NavItem>
      )
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
