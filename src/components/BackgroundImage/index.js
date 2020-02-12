import React, { Fragment, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Media } from "reactstrap"
import { useLocation } from "react-router-dom"
import { nebulus, nebulus2, nebulus3 } from "../../images/AWS"
import { RouteMap } from "../ReactRouter/Routes"
import StarGenerator from "./StarGenerator"
import BackgroundObjects from "./BackgroundObjects"
import Rocket from "./Rocket"
import Earth from "./Earth"
import Moon from "./Moon"
import "./styles.css"

const RocketEarthMoon = () => (
  <BackgroundObjects>
    <Rocket />
    <Earth />
    <Moon />
  </BackgroundObjects>
)

const backgroundImageRouteMap = route => {
  switch (route) {
    case RouteMap.HOME:
      return RocketEarthMoon()
    case RouteMap.SUPPORT:
      return RocketEarthMoon()
    default:
      return null
  }
}

const BackgroundImage = () => {
  const { pathname } = useLocation()
  const background = backgroundImageRouteMap(pathname)

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
export default memo(BackgroundImage)
