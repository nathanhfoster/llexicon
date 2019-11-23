import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import StarGenerator from "../../components/BackgroundImage/StarGenerator"
import BackgroundObjects from "../../components/BackgroundImage/BackgroundObjects"
import Rocket from "../../components/BackgroundImage/Rocket"
import Earth from "../../components/BackgroundImage/Earth"
import Moon from "../../components/BackgroundImage/Moon"
import Astronaut from "../../components/BackgroundImage/Astronaut"
import FourOFOur from "../../components/BackgroundImage/FourOFour"
import MoonWithUfo from "../../components/BackgroundImage/MoonWIthUfo"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class PageNotFound extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { stars: <StarGenerator /> }
  }

  static propTypes = {}

  static defaultProps = { title: "Page Not Found" }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

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
