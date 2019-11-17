import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import LogoImage from "../../ReactRouter/BackgroundImage/LogoImage"
import StarGenerator from "../../ReactRouter/BackgroundImage/StarGenerator"
import BackgroundObjects from "../../ReactRouter/BackgroundImage/BackgroundObjects"
import Rocket from "../../ReactRouter/BackgroundImage/Rocket"
import Earth from "../../ReactRouter/BackgroundImage/Earth"
import Moon from "../../ReactRouter/BackgroundImage/Moon"
import Astronaut from "../../ReactRouter/BackgroundImage/Astronaut"
import FourOFOur from "../../ReactRouter/BackgroundImage/FourOFour"
import MoonWithUfo from "../../ReactRouter/BackgroundImage/MoonWIthUfo"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class PageNotFound extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { stars: <StarGenerator /> }
  }

  static getDerivedStateFromProps(props, state) {
    return props
  }

  static propTypes = {}

  static defaultProps = { title: "Page Not Found" }

  componentDidMount() {}

  render() {
    const { title, stars } = this.state

    return (
      <div className="PageNotFound bg-purple">
        <div className="custom-navbar">
          <div className="brand-logo">
            <LogoImage />
          </div>
        </div>
        <div className="central-body">
          <FourOFOur />
          <a href="/home" className="btn-go-home">
            GO BACK HOME
          </a>
        </div>
        <BackgroundObjects>
          <Rocket />
          <div className="earth-moon">
            <Earth />
            <Moon />
          </div>
          <Astronaut />
        </BackgroundObjects>
        {stars}
        <MoonWithUfo />
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PageNotFound)
