import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { RouteMap } from 'redux/router/actions'
import PropTypes from 'prop-types'

import { useSwipeable } from 'react-swipeable'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  NavItem,
} from 'reactstrap'
import { AddToHomeScreen, StarSearch } from '../'
import { GetUserEntriesByDate } from 'redux/Entries/actions'
import { UserLogout } from 'redux/User/actions'
import Hamburger from './Hamburger'
import NavItemLink from './NavItemLink'
import { Logo } from '../../images/AWS'
import Support from '../../views/Support'
import './styles.css'

const {
  ABOUT,
  ADMIN,
  HOME,
  NEW_ENTRY,
  ENTRIES_CALENDAR,
  ENTRIES_LIST,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  ENTRIES_FOLDERS,
  ENTRIES_MEDIA,
  ENTRIES_REDISCOVER,
  ENTRIES_MOST_VIEWED,
  ENTRIES_RANDOM,
  LOGIN,
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SETTINGS_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE,
  SUPPORT,
  PRIVACY_POLICY,
} = RouteMap

export const ENTRY_LINKS = [
  {
    dropdownItem: true,
    route: NEW_ENTRY,
    title: 'CREATE ENTRY',
    icon: <i className='fas fa-feather-alt NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_CALENDAR,
    title: 'CALENDAR',
    icon: <i className='fas fa-calendar-alt NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_FOLDERS,
    title: 'FOLDERS',
    icon: <i className='fas fa-folder NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_MEDIA,
    title: 'MEDIA',
    icon: <i className='fas fa-photo-video NavBarImage' />,
  },
  // {
  //   dropdownItem: true,
  //   route: ENTRIES_LIST,
  //   title: 'LIST',
  //   icon: <i className='fas fa-th-list NavBarImage' />,
  // },
  {
    dropdownItem: true,
    route: ENTRIES_TABLE,
    title: 'TABLE',
    icon: <i className='fas fa-table NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_MAP,
    title: 'MAP',
    icon: <i className='fas fa-map-marked-alt NavBarImage' />,
  },
]

export const ENTRY_LINKS_PAGES = [
  {
    dropdownItem: true,
    route: ENTRIES_REDISCOVER,
    title: 'REDISCOVER',
    icon: <i className='fab fa-searchengin NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_MOST_VIEWED,
    title: 'MOST VIEWED',
    icon: <i className='fas fa-fire-alt NavBarImage' />,
  },
  {
    dropdownItem: true,
    route: ENTRIES_RANDOM,
    title: 'RANDOM',
    icon: <i className='fas fa-random NavBarImage' />,
  },
]

export const ALL_ENTRY_LINKS = ENTRY_LINKS.concat(ENTRY_LINKS_PAGES)

const mapStateToProps = ({ User: { id, is_superuser }, Window: { isMobile } }) => ({
  userId: id,
  userIsSuperUser: is_superuser,
  isMobile,
})

const mapDispatchToProps = {
  UserLogout,
  GetUserEntriesByDate,
}

export const NavBar = ({
  userId,
  userIsSuperUser,
  isMobile,
  UserLogout,
  prompt,
  promptToInstall,
}) => {
  const [collapsed, setCollapse] = useState(true)

  const toggleHamburgerMenu = useCallback(() => setCollapse(current => !current), [])

  const closeHamburgerMenu = useCallback(() => setCollapse(true), [])

  const handlers = useSwipeable({
    onSwipedUp: () => setCollapse(true),
    onSwipedDown: () => setCollapse(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  const renderNavLinks = useMemo(() => {
    const renderDropDownMenu = (key, icon, links) => (
      <UncontrolledDropdown key={key} nav inNavbar tag='div'>
        <DropdownToggle nav caret>
          {icon}
        </DropdownToggle>
        <DropdownMenu right>{renderLinks(links)}</DropdownMenu>
      </UncontrolledDropdown>
    )

    const renderLinks = navLinks =>
      navLinks.map((link, i) =>
        link.links ? (
          renderDropDownMenu(`Dropdown-${i}`, link.icon, link.links)
        ) : (
          <NavItemLink key={i} {...link} closeHamburgerMenu={closeHamburgerMenu} />
        ),
      )

    const links = [
      {
        route: HOME,
        icon: (
          <span className='NavBarLink'>
            <i className='fas fa-home NavBarImage' />
            HOME
          </span>
        ),
      },
      {
        icon: (
          <span className='NavBarLink'>
            <i className='fas fa-book NavBarImage' />
            ENTRIES
          </span>
        ),
        links: ALL_ENTRY_LINKS,
      },
      {
        route: LOGIN,
        icon: (
          <span className='NavBarLink'>
            <i className={`fas fa-sign-${userId ? 'out' : 'in'}-alt NavBarImage`} />
            {userId ? 'LOGOUT' : 'LOGIN'}
          </span>
        ),
        onClick: userId ? UserLogout : null,
      },

      {
        icon: (
          <span className='NavBarLink'>
            <i className='fas fa-ellipsis-v NavBarImage' />
          </span>
        ),
        links: [
          {
            icon: (
              <span className='NavBarLink'>
                <i className='fas fa-cog NavBarImage' />
                SETTINGS
              </span>
            ),
            links: [
              {
                dropdownItem: true,
                route: SETTINGS_ENTRIES,
                title: 'ENTRIES',
                icon: <i className='fas fa-book NavBarImage' />,
              },
              {
                dropdownItem: true,
                route: SETTINGS_PROFILE,
                title: 'PROFILE',
                icon: <i className='fas fa-user-circle NavBarImage' />,
              },
              {
                dropdownItem: true,
                route: SETTINGS_PREFERENCES,
                title: 'PREFERENCES',
                icon: <i className='fas fa-sliders-h NavBarImage' />,
              },
              {
                dropdownItem: true,
                route: SETTINGS_PUSH_NOTIFICATIONS,
                title: 'PUSH NOTIFICATIONS',
                icon: <i className='fas fa-bell NavBarImage' />,
              },

              {
                dropdownItem: true,
                route: SETTINGS_STORAGE,
                title: 'STORAGE',
                icon: <i className='fas fa-hdd NavBarImage' />,
              },
            ],
          },
          {
            dropdownItem: true,
            route: SUPPORT,
            title: 'SUPPORT',
            icon: <i className='fas fa-satellite NavBarImage' />,
          },
          {
            dropdownItem: true,
            route: PRIVACY_POLICY,
            title: 'PRIVACY POLICY',
            icon: <i className='fas fa-user-secret NavBarImage' />,
          },
          {
            dropdownItem: true,
            route: ABOUT,
            title: 'ABOUT',
            icon: <i className='fas fa-info-circle NavBarImage' />,
          },
          {
            render: (
              <NavItem key='AddToHomeScreen' className='Center px-2 m-0'>
                <AddToHomeScreen width='100%' prompt={prompt} promptToInstall={promptToInstall} />
              </NavItem>
            ),
          },
        ],
      },
    ]

    if (userIsSuperUser) {
      links.unshift({
        route: ADMIN,
        icon: (
          <span className='NavBarLink'>
            <i className='fas fa-user-lock NavBarImage' />
            ADMIN
          </span>
        ),
      })
    }

    return renderLinks(links)
  }, [prompt, promptToInstall, userId, userIsSuperUser])

  return (
    <div {...handlers}>
      <Navbar className='NavBar' fixed='top' expand='md'>
        {isMobile && (
          <NavbarToggler tag={Hamburger} onClick={toggleHamburgerMenu} collapsed={collapsed} />
        )}

        <StarSearch />

        <Collapse isOpen={!collapsed} navbar>
          <Nav className='ml-auto' navbar>
            {renderNavLinks}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

Navbar.propTypes = {
  userId: PropTypes.number,
  UserLogout: PropTypes.func,
  GetAllEntries: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
