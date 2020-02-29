import React, { Fragment } from "react"
import { useLocation } from "react-router-dom"
import { RouteMap } from "../../routes"
import { ViewPortContainer } from ".."
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
      <ViewPortContainer className="BackgroundImage">
        {/* <Media src={bgImage} /> */}
        <StarGenerator />
      </ViewPortContainer>
      {background}
    </Fragment>
  )
}

export default BackgroundImage
