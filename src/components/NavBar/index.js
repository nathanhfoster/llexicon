import React, { useState } from "react"
import { connect as reduxConnect } from "react-redux"
import { RouteMap } from "../../routes"
import PropTypes from "prop-types"
import "./styles.css"
import {
  Collapse,
  Button,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"
import StarSearch from "../StarSearch"
import { GetUserEntriesByDate } from "../../redux/Entries/actions"
import { UserLogout } from "../../redux/User/actions"
import Hamburger from "./Hamburger"
import NavItemLink from "./NavItemLink"
import { Logo } from "../../images/AWS"
import Support from "../../views/Support"

const {
  HOME,
  NEW_ENTRY,
  CALENDAR,
  ENTRIES_DETAILED,
  ENTRIES_MINIMAL,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  ENTRIES_CARDS,
  LOGIN,
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SUPPORT,
  PRIVACY_POLICY
} = RouteMap

const mapStateToProps = ({
  User: { id },
  Window: { isMobile, isInStandalone }
}) => ({
  UserId: id,
  isMobile,
  isInStandalone
})

const mapDispatchToProps = {
  UserLogout,
  GetUserEntriesByDate
}

const NavBar = ({ UserId, isInStandalone, isMobile, UserLogout }) => {
  const [collapsed, setCollapse] = useState(true)

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
          route: ENTRIES_CARDS,
          title: "CARDS",
          icon: <i className="fas fa-columns NavBarImage" />
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
        <i className={`fas fa-sign-${UserId ? "out" : "in"}-alt NavBarImage`} />
      ),
      onClick: UserId ? UserLogout : null
    },

    {
      icon: (
        <span className="NavBarLink">
          <i className="fas fa-ellipsis-v NavBarImage" />
        </span>
      ),
      links: [
        {
          icon: (
            <span className="NavBarLink">
              <i className="fas fa-cog NavBarImage" />
              SETTINGS
            </span>
          ),
          links: [
            {
              // dropdownItem: true,
              route: SETTINGS_PROFILE,
              title: "PROFILE",
              icon: <i className="fas fa-user-circle NavBarImage" />
            },
            {
              // dropdownItem: true,
              route: SETTINGS_PREFERENCES,
              title: "PREFERENCES",
              icon: <i className="fas fa-sliders-h NavBarImage" />
            },
            {
              // dropdownItem: true,
              route: SETTINGS_ENTRIES,
              title: "ENTRIES",
              icon: <i className="fas fa-book NavBarImage" />
            }
          ]
        },
        {
          dropdownItem: true,
          route: SUPPORT,
          title: "SUPPORT",
          icon: <i className="fas fa-satellite NavBarImage" />
        },
        {
          dropdownItem: true,
          route: PRIVACY_POLICY,
          title: "PRIVACY POLICY",
          icon: <i className="fas fa-user-secret NavBarImage" />
        }
      ]
    }
  ]

  const toggleHamburgerMenu = () => setCollapse(!collapsed)

  const closeHamburgerMenu = () => setCollapse(true)

  const renderDropDownMenu = (key, icon, links) => (
    <UncontrolledDropdown key={key} nav inNavbar tag="div">
      <DropdownToggle nav caret>
        {icon}
      </DropdownToggle>
      <DropdownMenu right>{renderNavLinks(links)}</DropdownMenu>
    </UncontrolledDropdown>
  )

  const renderNavLinks = navLinks =>
    navLinks.map((link, i) =>
      link.links ? (
        renderDropDownMenu(`Dropdown-${i}`, link.icon, link.links)
      ) : (
        <NavItemLink key={i} {...link} onClickCallback={closeHamburgerMenu} />
      )
    )

  return (
    <Navbar className="NavBar" fixed="top" expand="md">
      {isMobile && (
        <NavbarToggler
          tag={Hamburger}
          onClick={toggleHamburgerMenu}
          collapsed={collapsed}
        />
      )}

      <StarSearch />

      <Collapse isOpen={!collapsed} navbar>
        <Nav className="ml-auto" navbar>
          {renderNavLinks(navLinks)}
        </Nav>
      </Collapse>
    </Navbar>
  )
}

Navbar.propTypes = {
  UserId: PropTypes.number,
  UserLogout: PropTypes.func,
  GetAllEntries: PropTypes.func
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
