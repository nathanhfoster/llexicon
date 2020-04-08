import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouteMap } from "../../routes"
import StarGenerator from "./StarGenerator"
import BackgroundObjects from "./BackgroundObjects"
import Rocket from "./Rocket"
import Earth from "./Earth"
import Moon from "./Moon"
import CrecentMoon from "./CrecentMoon"
import "./styles.css"

const RocketEarthMoon = () => (
  <BackgroundObjects>
    <Rocket />
    <Earth />
    <Moon />
  </BackgroundObjects>
)

const backgroundImageRouteMap = (route) => {
  switch (route) {
    case RouteMap.ROOT:
      return RocketEarthMoon()
    case RouteMap.ABOUT:
      return RocketEarthMoon()
    case RouteMap.HOME:
      return RocketEarthMoon()
    case RouteMap.SUPPORT:
      return RocketEarthMoon()
    default:
      return null
  }
}

const mapStateToProps = ({ Window: { innerHeight, innerWidth } }) => ({
  starLength: Math.ceil((innerHeight + innerWidth) / 5),
})

const BackgroundImage = ({ location: { pathname }, starLength }) => {
  const background = backgroundImageRouteMap(pathname)

  return (
    <Fragment>
      <div className="BackgroundImage">
        {/* <Media src={bgImage} /> */}
        <StarGenerator length={starLength} />
      </div>
      {background}
    </Fragment>
  )
}

export default withRouter(reduxConnect(mapStateToProps)(BackgroundImage))
