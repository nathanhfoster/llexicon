import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import { withRouter, NavLink as RouterNavLink } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { RouteMap } from "../../ReactRouter/Routes"
import PropTypes from "prop-types"
import "./styles.css"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Media
} from "reactstrap"

import { UserLogout } from "../../actions/User"
import Hamburger from "./Hamburger"
import Logo from "../../images/Logo.png"

const mapStateToProps = ({ User, Window }) => ({ User, Window })

const mapDispatchToProps = { UserLogout }

class NavBar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true
    }
  }

  static propTypes = {
    User: PropTypes.object,
    UserLogout: PropTypes.func.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { User } = props
    this.setState({ User })
  }

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed })

  closeHamburgerMenu = () => this.setState({ collapsed: true })

  renderNavLinks = () => {
    const {
      User: { id },
      UserLogout
    } = this.props
    const { CALENDAR, ENTRIES, SETTINGS, LOGIN } = RouteMap
    const LoggedInLinks = [
      this.renderNavlink(
        CALENDAR,
        "CALENDAR",
        <i className="fas fa-calendar-alt NavBarImage"></i>
      ),
      ,
      this.renderNavlink(
        SETTINGS,
        "SETTINGS",
        <i className="fas fa-cog NavBarImage" />
      ),
      this.renderNavlink(
        LOGIN,
        "LOG OUT",
        <i className="fas fa-sign-out-alt NavBarImage" />,
        UserLogout
      )
    ]
    const NotLoggedInLinks = [
      this.renderNavlink(
        ENTRIES,
        "ENTRIES",
        <i className="fas fa-feather-alt NavBarImage" />
      ),
      this.renderNavlink(
        LOGIN,
        "LOGIN",
        <i className="fas fa-sign-in-alt NavBarImage" />
      )
    ]
    return id ? LoggedInLinks : NotLoggedInLinks
  }

  renderNavlink = (route, title, icon, onClick) => {
    const { history } = this.props
    return (
      <NavItem key={title}>
        <NavLink
          activeClassName="active"
          className="Navlink"
          tag={RouterNavLink}
          to={RouterLinkPush(history, route)}
          onClick={() => {
            onClick && onClick()
            this.closeHamburgerMenu()
          }}
        >
          {icon}
          <span className="NavBarLink">{title}</span>
        </NavLink>
      </NavItem>
    )
  }

  renderBrandOrExlporeAndUniversities = isMobile =>
    isMobile ? this.renderSonderBrand : this.renderExlporeAndUniversities

  render() {
    const { collapsed } = this.state
    const { Window, history } = this.props
    const { User } = this.state
    const { isMobile } = Window
    const UserName =
      User.token && (User.first_name || User.username).toUpperCase()
    const UserPicture = User.uploaded_picture || User.picture
    const { HOME } = RouteMap
    return (
      <Navbar light className="NavBar" color="light" fixed="top" expand="md">
        <NavbarBrand
          className="Logo"
          tag={RouterNavLink}
          to={RouterLinkPush(history, HOME)}
          onClick={() => this.closeHamburgerMenu()}
        >
          <i className="fas fa-plus NavBarImage" />
          <span className="NavBarLink">Entry</span>
        </NavbarBrand>
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            collapsed={collapsed}
          />
        )}
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="ml-auto" navbar>
            {this.renderNavLinks()}
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
)
