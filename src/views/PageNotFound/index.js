import React, { memo } from "react"
import PropTypes from "prop-types"
import { RouterGoBack } from "../../routes"
import { withRouter, Link } from "react-router-dom"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import StarGenerator from "../../components/BackgroundImage/StarGenerator"
import BackgroundObjects from "../../components/BackgroundImage/BackgroundObjects"
import Rocket from "../../components/BackgroundImage/Rocket"
import Earth from "../../components/BackgroundImage/Earth"
import Moon from "../../components/BackgroundImage/Moon"
import Astronaut from "../../components/BackgroundImage/Astronaut"
import Four0Four from "../../components/BackgroundImage/Four0Four"
import MoonUfo from "../../components/BackgroundImage/MoonUfo"
import "./styles.css"

const PageNotFound = ({ history, title }) => (
  <div className="PageNotFound bg-purple">
    <div className="custom-navbar">
      <div className="brand-logo">
        <LogoImage />
      </div>
    </div>
    <div className="central-body">
      <Four0Four />
      <div onClick={() => RouterGoBack(history)} className="btn-go-home">
        TAKE ME BACK
      </div>
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
    <MoonUfo />
  </div>
)

PageNotFound.defaultProps = { title: "Page Not Found" }

export default withRouter(memo(PageNotFound))
