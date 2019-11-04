import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Media } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import "./styles.css"

import bg1 from "../../images/nebulus.jpg"
import bg2 from "../../images/nebulus2.jpg"
import bg3 from "../../images/nebulus3.jpg"
import bg4 from "../../images/nebulus.jpg"
import bg5 from "../../images/nebulus.jpg"
import bg6 from "../../images/nebulus.jpg"
import bg7 from "../../images/nebulus.jpg"

import bg1M from "../../images/nebulus.jpg"
import bg2M from "../../images/nebulus.jpg"
import bg3M from "../../images/nebulus.jpg"
import bg4M from "../../images/nebulus.jpg"
import bg5M from "../../images/nebulus.jpg"
import bg6M from "../../images/nebulus.jpg"
import bg7M from "../../images/nebulus.jpg"
// import bg1Mobile from './images/bg1-mobile.jpg'
// import bg2Mobile from './images/bg2-mobile.jpg'
// import bg3Mobile from './images/bg1-mobile.jpg'
// import bg4Mobile from './images/bg4-mobile.jpg'
// import bg5Mobile from './images/bg5-mobile.jpg'

const mapStateToProps = ({ Window, User: { Settings } }) => ({
  Window,
  Settings
})

const mapDispatchToProps = {}

class BackgroundImage extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { history, location, match, Window, Settings } = props

    this.setState({
      history,
      location,
      match,
      Window,
      Settings
    })
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  backgroundImageRouteMap = route => {
    switch (route) {
      case "/home":
        return bg5
      case "/calendar":
        return bg3
      case "/news/latest":
        return bg6
      case "/news/suggested":
        return bg6
      case "/news/popular":
        return bg6
      case "/news/my-docs":
        return bg6
      case "/guild/about":
        return bg4
      case "/guild/roster":
        return bg4
      case "/guild/charters":
        return bg4
      case "/guild/lore":
        return bg4
      case "/guild/contests":
        return bg4
      case "/guild/team":
        return bg4
      case "/guild/join":
        return bg4
      case "/guild/donate":
        return bg4
      case "/forums":
        return bg4
      case "/login":
        return bg2
      case "/media/galleries":
        return bg7
      case "/media/videos":
        return bg7
      case "/media/streams":
        return bg7
      case "/media/podcasts":
        return bg7
      case "/media/vot-network":
        return bg7
      default:
        return bg1
    }
  }

  backgroundMobileImageRouteMap = route => {
    switch (route) {
      case "/home":
        return bg1M
      case "/calendar":
        return bg3M
      case "/news":
        return bg4M
      case "/guild/about":
        return bg5M
      case "/guild/roster":
        return bg7M
      case "/guild/charters":
        return bg5M
      case "/guild/lore":
        return bg5M
      case "/guild/contests":
        return bg5M
      case "/guild/team":
        return bg5M
      case "/guild/join":
        return bg5M
      case "/login":
        return bg2M
      default:
        return bg6M
    }
  }

  render() {
    const {
      history,
      location,
      match,
      Window: { isMobile },
      Settings: { show_footer }
    } = this.state
    const { pathname } = location
    const bgImage = isMobile
      ? this.backgroundImageRouteMap(pathname)
      : this.backgroundImageRouteMap(pathname)
    return (
      <div
        className="BackgroundImage"
        style={{
        //   top: "var(--navBarHeight)",
        //   bottom: show_footer ? "var(--footerHeight)" : 0
        }}
      >
        <Media src={bgImage} />
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(BackgroundImage)
)
