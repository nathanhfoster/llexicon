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
  Button,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText
} from "reactstrap"
import { SetCalendar } from "../../actions/Calendar"
import { GetUserEntriesByDate } from "../../actions/Entries"
import { UserLogout } from "../../actions/User"
import Hamburger from "./Hamburger"
import Logo from "../../images/Logo.png"
import AddToHomeScreenModal from "../AddToHomeScreen/"

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
                <AddToHomeScreenModal
                  onClickCallback={this.closeHamburgerMenu}
                />
              </DropdownItem>
            </Fragment>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  renderNavLinks = () => {
    const { UserId } = this.state
    const { UserLogout } = this.props
    const { CALENDAR, ENTRIES, LOGIN } = RouteMap
    const LoggedInLinks = [
      this.renderNavlink(
        CALENDAR,
        "CALENDAR",
        <i className="fas fa-calendar-alt NavBarImage"></i>
      ),
      this.renderNavlink(
        ENTRIES,
        "ENTRIES",
        <i className="fas fa-book NavBarImage" />
      ),

      this.renderNavlink(
        LOGIN,
        "Logout",
        <i className="fas fa-sign-out-alt NavBarImage" />,
        UserLogout
      ),
      this.optionsMenu()
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
        <i className="fas fa-book NavBarImage" />
      ),

      this.renderNavlink(
        LOGIN,
        "LOGIN",
        <i className="fas fa-sign-in-alt NavBarImage" />
      ),
      this.optionsMenu()
    ]
    return UserId ? LoggedInLinks : NotLoggedInLinks
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
    const { history } = this.props
    const { collapsed, isMobile } = this.state
    const { HOME } = RouteMap
    return (
      <Navbar className="NavBar" fixed="top" expand="md">
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            collapsed={collapsed}
          />
        )}
        <InputGroup
          className="EntryInput pl-2"
          style={{ maxWidth: isMobile ? "calc(100% - 42px)" : 550 }}
        >
          <Input placeholder="Search the stars..." />
          <InputGroupAddon addonType="append">
            <InputGroupText
              tag={Button}
              color="primary"
              style={{ color: "white", padding: "0 8px" }}
            >
              <i
                className="fas fa-feather-alt NavBarImage NavBarLink"
                onClick={() => {
                  RouterPush(history, HOME)
                  this.closeHamburgerMenu()
                }}
              ></i>
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <InputGroupText
              tag={Button}
              color="primary"
              style={{ color: "white", padding: "0 8px" }}
            >
              <i
                className="fas fa-calendar-day NavBarImage NavBarLink"
                onClick={this.handleTodayClick}
              ></i>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        {/* <i className="fab fa-wpexplorer NavBarImage NavBarLink" /> */}

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
