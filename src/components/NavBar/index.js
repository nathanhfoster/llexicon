import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
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
  NavLink
} from "reactstrap"

import { Logout } from "../../actions/User"
import Hamburger from "../Hamburger/Hamburger"
const mapStateToProps = ({ User, Window }) => ({ User, Window })

const mapDispatchToProps = { Logout }

class NavBar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true
    }
  }

  static propTypes = {
    User: PropTypes.object,
    Logout: PropTypes.func.isRequired
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
    this.setState({})
  }

  toggleHamburgerMenu = () =>
    this.setState({ collapsed: !this.state.collapsed })

  closeHamburgerMenu = () => this.setState({ collapsed: true })

  renderNavLinks = () => [this.renderNavlink(RouteMap.SETTINGS, "SETTINGS", 1)]

  renderNavlink = (route, title, key) => {
    const { history } = this.props
    return (
      <NavItem key={key}>
        <NavLink
          className="Navlink"
          tag={Link}
          to={RouterLinkPush(history, route)}
          onClick={() => this.closeHamburgerMenu()}
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
    const { User, Window, history, Logout } = this.props
    const { isMobile } = Window
    const UserName =
      User.token && (User.first_name || User.username).toUpperCase()
    const UserPicture = User.uploaded_picture || User.picture
    return (
      <Navbar className="NavBar" fixed="top" expand="md">
        <NavbarBrand
          className="Logo py-0 mx-auto"
          tag={Link}
          to={RouterLinkPush(history, RouteMap.HOME)}
          onClick={() => this.closeHamburgerMenu()}
        >
          <i className="fas fa-book NavBarImage" />
        </NavbarBrand>
        {isMobile && (
          <NavbarToggler
            tag={Hamburger}
            onClick={() => this.toggleHamburgerMenu()}
            className="Hamburger"
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
