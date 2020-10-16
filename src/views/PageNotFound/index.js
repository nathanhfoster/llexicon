import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import ApiStatusResponse from "./ApiStatusResponse"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import StarGenerator from "../../components/BackgroundImage/StarGenerator"
import BackgroundObjects from "../../components/BackgroundImage/BackgroundObjects"
import Rocket from "../../components/BackgroundImage/Rocket"
import Earth from "../../components/BackgroundImage/Earth"
import Moon from "../../components/BackgroundImage/Moon"
import Astronaut from "../../components/BackgroundImage/Astronaut"
import MoonUfo from "../../components/BackgroundImage/MoonUfo"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const PageNotFound = () => (
  <div className="PageNotFound bg-purple">
    <div className="custom-navbar">
      <div className="brand-logo">
        <LogoImage />
      </div>
    </div>
    <ApiStatusResponse />
    <BackgroundObjects>
      <Rocket />
      <div className="earth-moon">
        <Earth />
        <Moon />
      </div>
      <Astronaut />
    </BackgroundObjects>
    <StarGenerator position="absolute" />
    <MoonUfo />
  </div>
)

PageNotFound.propTypes = {
  title: PropTypes.string,
  history: PropTypes.object,
}

PageNotFound.defaultProps = {}

export default reduxConnect(mapStateToProps)(PageNotFound)
