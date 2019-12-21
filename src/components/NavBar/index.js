import React, { PureComponent, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import { withRouter, NavLink as RouterNavLink } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import { RouteMap } from "../../ReactRouter/Routes"
import PropTypes from "prop-types"
import "./styles.css"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"
import StarSearch from "../StarSearch"
import { SetCalendar } from "../../actions/Calendar"
import { GetUserEntriesByDate } from "../../actions/Entries"
import { UserLogout } from "../../actions/User"
import Hamburger from "./Hamburger"
import Logo from "../../images/Logo.png"
import AddToHomeScreen from "../AddToHomeScreen/"

const mapStateToProps = ({
  User: { id },
  Window: { isMobile, isInStandalone }
}) => ({
  UserId: id,
  isMobile,
  isInStandalone
})

const mapDispatchToProps = { UserLogout, SetCalendar, GetUserEntriesByDate }

class NavBar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true
    }
  }

  static propTypes = {
    UserId: PropTypes.number,
    UserLogout: PropTypes.func.isRequired,
    SetCalendar: PropTypes.func.isRequired,
    GetUserEntriesByDate: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {
    this.handleTodayClick()
  }

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed })

  closeHamburgerMenu = () => this.setState({ collapsed: true })

  optionsMenu = () => {
    const { isMobile, isInStandalone } = this.state
    const { SETTINGS } = RouteMap
    return (
      <UncontrolledDropdown key="DropDown" nav inNavbar>
        <DropdownToggle nav caret>
          <i className="fas fa-ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem className="Navlink">
            {this.renderNavlink(
              SETTINGS,
              "SETTINGS",
              <i className="fas fa-cog NavBarImage" />
            )}
          </DropdownItem>
          {!isInStandalone && (
            <Fragment>
              <DropdownItem divider />
              <DropdownItem>
                <AddToHomeScreen onClickCallback={this.closeHamburgerMenu} />
              </DropdownItem>
            </Fragment>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  renderNavLinks = () => {
    const { UserId } = this.state
    const { UserLogout, history } = this.props
    const { NEW_ENTRY, CALENDAR, ENTRIES_DETAILED, LOGIN } = RouteMap
    const Links = [
      this.renderNavlink(
        NEW_ENTRY,
        "NEW ENTRY",
        <i className="fas fa-feather-alt NavBarImage NavBarLink" />
      ),
      this.renderNavlink(
        CALENDAR,
        "CALENDAR",
        <i className="fas fa-calendar-alt NavBarImage"></i>
      ),
      this.renderNavlink(
        ENTRIES_DETAILED,
        "ENTRIES",
        <i className="fas fa-book NavBarImage" />
      ),
      UserId
        ? this.renderNavlink(
            LOGIN,
            "LOGOUT",
            <i className="fas fa-sign-out-alt NavBarImage" />,
            UserLogout
          )
        : this.renderNavlink(
            LOGIN,
            "LOGIN",
            <i className="fas fa-sign-in-alt NavBarImage" />
          ),
      this.optionsMenu()
    ]

    return Links
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
    const { collapsed, isMobile } = this.state
    return (
      <Navbar className="NavBar" fixed="top" expand="md">
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            collapsed={collapsed}
          />
        )}

        <StarSearch />

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
