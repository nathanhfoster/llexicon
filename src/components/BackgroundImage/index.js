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
    <Rocket zIndex={-1} />
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

const mapStateToProps = ({
  User: {
    Settings: { show_animated_background },
  },
  Window: { innerHeight, innerWidth },
}) => ({
  show_animated_background,
  starLength: Math.ceil((innerHeight + innerWidth) / 10),
})

const BackgroundImage = ({
  show_animated_background,
  starLength,
  location: { pathname },
}) => {
  const background = backgroundImageRouteMap(pathname)

  return (
    <Fragment>
      <div className="BackgroundImage">
        {/* <Media src={bgImage} /> */}
        {show_animated_background && <StarGenerator length={starLength} />}
      </div>
      {show_animated_background && background}
    </Fragment>
  )
}

export default withRouter(reduxConnect(mapStateToProps)(BackgroundImage))
