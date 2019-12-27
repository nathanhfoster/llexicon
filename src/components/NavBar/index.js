import React, { PureComponent, Fragment } from "react"
import { connect as reduxConnect } from "react-redux"
import { RouteMap } from "../../ReactRouter/Routes"
import PropTypes from "prop-types"
import "./styles.css"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
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
import NavItemLink from "./NavItemLink"

const { NEW_ENTRY, CALENDAR, ENTRIES_DETAILED, LOGIN, SETTINGS } = RouteMap

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
    const { UserId, UserLogout, isMobile, isInStandalone } = nextProps
    const navLinks = [
      {
        route: NEW_ENTRY,
        title: "NEW ENTRY",
        icon: <i className="fas fa-feather-alt NavBarImage NavBarLink" />
      },
      {
        route: CALENDAR,
        title: "CALENDAR",
        icon: <i className="fas fa-calendar-alt NavBarImage" />
      },
      {
        route: ENTRIES_DETAILED,
        title: "ENTRIES",
        icon: <i className="fas fa-book NavBarImage" />
      },
      {
        route: LOGIN,
        title: UserId ? "LOGOUT" : "LOGIN",
        icon: (
          <i
            className={`fas fa-sign-${UserId ? "out" : "in"}-alt NavBarImage`}
          />
        ),
        onClick: UserId ? UserLogout : null
      }
    ]
    return { UserId, UserLogout, isMobile, isInStandalone, navLinks }
  }

  componentDidMount() {
    this.handleTodayClick()
  }

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed })

  closeHamburgerMenu = () => this.setState({ collapsed: true })

  renderNavLinks = links =>
    links.map(link => (
      <NavItemLink {...link} onClickCallback={this.closeHamburgerMenu} />
    ))

  handleTodayClick = () => {
    const { SetCalendar, GetUserEntriesByDate } = this.props
    const activeDate = new Date()
    // GetUserEntriesByDate(activeDate)
    SetCalendar({ activeDate })
  }

  render() {
    const { collapsed, isMobile, isInStandalone, navLinks } = this.state
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
            {this.renderNavLinks(navLinks)}
            <UncontrolledDropdown key="DropDown" nav inNavbar>
              <DropdownToggle nav caret>
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu right>
                <NavItemLink
                  dropdownItem
                  route={SETTINGS}
                  title="SETTINGS"
                  icon={<i className="fas fa-cog NavBarImage" />}
                  onClickCallback={this.closeHamburgerMenu}
                />

                {!isInStandalone && (
                  <Fragment>
                    <DropdownItem divider />
                    <DropdownItem>
                      <AddToHomeScreen
                        onClickCallback={this.closeHamburgerMenu}
                      />
                    </DropdownItem>
                  </Fragment>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
