import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import { withRouter, NavLink as RouterNavLink } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { RouteMap } from "../../ReactRouter/routes"
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
    const LoggedInLinks = [
      this.renderNavlink(RouteMap.ENTRIES, "ENTRIES"),
      this.renderNavlink(RouteMap.SETTINGS, "SETTINGS"),
      this.renderNavlink(RouteMap.LOGIN, "LOG OUT", UserLogout)
    ]
    const NotLoggedInLinks = [this.renderNavlink(RouteMap.LOGIN, "LOGIN")]
    return id ? LoggedInLinks : NotLoggedInLinks
  }

  renderNavlink = (route, title, onClick) => {
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
          {title}
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
    return (
      <Navbar light className="NavBar" color="light" fixed="top" expand="md">
        <NavbarBrand
          className="Logo"
          tag={RouterNavLink}
          to={RouterLinkPush(history, RouteMap.HOME)}
          onClick={() => this.closeHamburgerMenu()}
        >
          <i className="fas fa-feather-alt NavBarImage" />
          Add Entry
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
