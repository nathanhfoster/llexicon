import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import { useLocation } from "react-router-dom"
import { RouteMap } from "reducers//router/actions"
import { Media } from "reactstrap"
import StarGenerator from "./StarGenerator"
import BackgroundObjects from "./BackgroundObjects"
import Rocket from "./Rocket"
import Earth from "./Earth"
import Moon from "./Moon"
import CrecentMoon from "./CrecentMoon"
import "./styles.css"

const BACKGROUND_IMAGE =
  "https://steamuserimages-a.akamaihd.net/ugc/1490082213003709148/10EB3DC850188A66E73C17AD9538DF8A1FE5FD9F/"

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

const BackgroundImage = ({ show_animated_background, starLength }) => {
  const { pathname } = useLocation()
  const background = backgroundImageRouteMap(pathname)

  return (
    <Fragment>
      <div className="BackgroundImage">
        {/* <Media src={BACKGROUND_IMAGE} style={{ opacity: 0.1 }} /> */}
        {show_animated_background && <StarGenerator length={starLength} />}
      </div>
      {show_animated_background && background}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BackgroundImage)
