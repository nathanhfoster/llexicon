import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { RouteMap, RouterLinkPush } from "../../ReactRouter/Routes"
import { withRouter, Link } from "react-router-dom"
import { connect as reduxConnect } from "react-redux"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import StarGenerator from "../../components/BackgroundImage/StarGenerator"
import BackgroundObjects from "../../components/BackgroundImage/BackgroundObjects"
import Rocket from "../../components/BackgroundImage/Rocket"
import Earth from "../../components/BackgroundImage/Earth"
import Moon from "../../components/BackgroundImage/Moon"
import Astronaut from "../../components/BackgroundImage/Astronaut"
import FourOFOur from "../../components/BackgroundImage/FourOFour"
import MoonWithUfo from "../../components/BackgroundImage/MoonWithUfo"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class PageNotFound extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = { title: "Page Not Found" }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {}

  render() {
    const { history } = this.props
    const { title } = this.state

    return (
      <div className="PageNotFound bg-purple">
        <div className="custom-navbar">
          <div className="brand-logo">
            <LogoImage />
          </div>
        </div>
        <div className="central-body">
          <FourOFOur />
          <Link
            to={RouterLinkPush(history, RouteMap.HOME)}
            className="btn-go-home"
          >
            GO BACK HOME
          </Link>
        </div>
        <BackgroundObjects>
          <Rocket />
          <div className="earth-moon">
            <Earth />
            <Moon />
          </div>
          <Astronaut />
        </BackgroundObjects>
        <StarGenerator position="absolute" />
        <MoonWithUfo />
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(PageNotFound)
)
