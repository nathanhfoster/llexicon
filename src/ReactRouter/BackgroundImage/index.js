import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Media } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { nebulus, nebulus2, nebulus3 } from "../../images/AWS"
import StarGenerator from "./StarGenerator"
import "./styles.css"

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

  static getDerivedStateFromProps(props, state) {
    const { history, location, match, Window, Settings } = props
    const stars = <StarGenerator />

    return {
      history,
      location,
      match,
      Window,
      Settings,
      stars
    }
  }

  static propTypes = {}

  static defaultProps = {}

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  backgroundImageRouteMap = route => {
    switch (route) {
      case "/home":
        return nebulus2
      case "/calendar":
        return nebulus3
      default:
        return nebulus
    }
  }

  backgroundMobileImageRouteMap = route => {
    switch (route) {
      case "/home":
        return nebulus2
      case "/calendar":
        return nebulus2
      case "/login":
        return nebulus3
      default:
        return nebulus3
    }
  }

  render() {
    const {
      history,
      location,
      match,
      Window: { isMobile },
      Settings: { show_footer },
      stars
    } = this.state
    const { pathname } = location
    const bgImage = isMobile
      ? this.backgroundImageRouteMap(pathname)
      : this.backgroundImageRouteMap(pathname)
    return (
      <div
        className="BackgroundImage"
        style={
          {
            //   top: "var(--navBarHeight)",
            //   bottom: show_footer ? "var(--footerHeight)" : 0
          }
        }
      >
        {/* <Media src={bgImage} /> */}
        {stars}
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(BackgroundImage)
)
