import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { Media } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { nebulus, nebulus2, nebulus3 } from "../../images/AWS"
import { RouteMap } from "../../ReactRouter/Routes"
import StarGenerator from "./StarGenerator"
import BackgroundObjects from "./BackgroundObjects"
import Rocket from "./Rocket"
import Earth from "./Earth"
import Moon from "./Moon"
import "./styles.css"

const backgroundImageRouteMap = route => {
  switch (route) {
    case RouteMap.HOME:
      return (
        <BackgroundObjects>
          <Rocket />
          <Earth />
          <Moon />
        </BackgroundObjects>
      )
    default:
      return null
  }
}

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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { history, location, match, Window, Settings } = nextProps

    const { pathname } = location
    const background = backgroundImageRouteMap(pathname)

    return {
      history,
      location,
      match,
      Window,
      Settings,
      background
    }
  }

  render() {
    const {
      Window: { isMobile },
      Settings: { show_footer },
      background
    } = this.state

    return (
      <Fragment>
        <div className="BackgroundImage">
          {/* <Media src={bgImage} /> */}
          <StarGenerator />
        </div>
        {background}
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(BackgroundImage)
)
