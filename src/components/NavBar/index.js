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
import AddToHomeScreen from "../AddToHomeScreen/"
import NavItemLink from "./NavItemLink"
import { Logo } from "../../images/AWS"

const {
  HOME,
  NEW_ENTRY,
  CALENDAR,
  ENTRIES_DETAILED,
  ENTRIES_MINIMAL,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  LOGIN,
  SETTINGS
} = RouteMap

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

  componentDidMount() {
    this.handleTodayClick()
  }

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed })

  closeHamburgerMenu = () => this.setState({ collapsed: true })

  renderNavLinks = links =>
    links.map((link, i) =>
      link.links ? (
        this.renderDropDownMenu(`Dropdown-${i}`, link.icon, link.links)
      ) : (
        <NavItemLink
          key={i}
          {...link}
          onClickCallback={this.closeHamburgerMenu}
        />
      )
    )

  renderDropDownMenu = (key, icon, links) => (
    <UncontrolledDropdown key={key} nav inNavbar>
      <DropdownToggle nav caret>
        {icon}
      </DropdownToggle>
      <DropdownMenu right>{this.renderNavLinks(links)}</DropdownMenu>
    </UncontrolledDropdown>
  )

  handleTodayClick = () => {
    const { SetCalendar, GetUserEntriesByDate } = this.props
    const activeDate = new Date()
    // GetUserEntriesByDate(activeDate)
    SetCalendar({ activeDate })
  }

  render() {
    const { collapsed } = this.state
    const { UserId, isInStandalone, isMobile } = this.props

    const navLinks = [
      {
        route: HOME,
        icon: (
          <span className="NavBarLink">
            <i className="fas fa-home NavBarImage" />
            HOME
          </span>
        )
      },
      {
        icon: (
          <span className="NavBarLink">
            <i className="fas fa-book NavBarImage" />
            ENTRIES
          </span>
        ),
        links: [
          {
            dropdownItem: true,
            route: NEW_ENTRY,
            title: "NEW ENTRY",
            icon: <i className="fas fa-feather-alt NavBarImage" />
          },
          {
            dropdownItem: true,
            route: CALENDAR,
            title: "CALENDAR",
            icon: <i className="fas fa-calendar-alt NavBarImage" />
          },
          {
            dropdownItem: true,
            route: ENTRIES_DETAILED,
            title: "DETAILED",
            icon: <i className="fas fa-newspaper NavBarImage" />
          },
          {
            dropdownItem: true,
            route: ENTRIES_MINIMAL,
            title: "MINIMAL",
            icon: <i className="fas fa-th-list NavBarImage" />
          },
          {
            dropdownItem: true,
            route: ENTRIES_TABLE,
            title: "TABLE",
            icon: <i className="fas fa-table NavBarImage" />
          },
          {
            dropdownItem: true,
            route: ENTRIES_MAP,
            title: "MAP",
            icon: <i className="fas fa-map-marked-alt NavBarImage" />
          }
        ]
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
      },
      {
        icon: <i className="fas fa-ellipsis-v" />,
        links: [
          {
            dropdownItem: true,
            route: SETTINGS,
            title: "SETTINGS",
            icon: <i className="fas fa-cog NavBarImage" />
          },
          {
            render: !isInStandalone && (
              <Fragment>
                <DropdownItem divider />
                <DropdownItem>
                  <AddToHomeScreen onClickCallback={this.closeHamburgerMenu} />
                </DropdownItem>
              </Fragment>
            )
          }
        ]
      }
    ]

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
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
