import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import { withRouter, NavLink as RouterNavLink } from "react-router-dom"
import { Button } from "reactstrap"
import { RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
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
  NavLink
} from "reactstrap"
import { SetCalendar } from "../../actions/Calendar"
import { GetUserEntriesByDate } from "../../actions/Entries"

import { UserLogout } from "../../actions/User"
import Hamburger from "./Hamburger"
import Logo from "../../images/Logo.png"

const mapStateToProps = ({ User, Window }) => ({ User, Window })

const mapDispatchToProps = { UserLogout, SetCalendar, GetUserEntriesByDate }

class NavBar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true
    }
  }

  static propTypes = {
    User: PropTypes.object,
    UserLogout: PropTypes.func.isRequired,
    SetCalendar: PropTypes.func.isRequired,
    GetUserEntriesByDate: PropTypes.func.isRequired
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
      this.renderNavlink(
        ENTRIES,
        "ENTRIES",
        <i className="fas fa-feather-alt NavBarImage" />
      ),
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
        CALENDAR,
        "CALENDAR",
        <i className="fas fa-calendar-alt NavBarImage"></i>
      ),
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

  handleTodayClick = () => {
    const { SetCalendar, GetUserEntriesByDate } = this.props
    const activeDate = new Date()
    // GetUserEntriesByDate(activeDate)
    SetCalendar({ activeDate })
  }

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
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            collapsed={collapsed}
          />
        )}
        <NavbarBrand>
          <i
            className="fas fa-plus NavBarImage NavBarLink"
            onClick={() => {
              console.log("sjdgfbjksbgkbnk")
              RouterPush(history, HOME)
              this.closeHamburgerMenu()
            }}
          >
            {" "}
            Entry
          </i>

          <i
            className="fas fa-calendar-day NavBarImage NavBarLink ml-4"
            onClick={this.handleTodayClick}
          >
            {" "}
            Today
          </i>
        </NavbarBrand>
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
