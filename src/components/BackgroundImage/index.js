import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { RouteMap } from '../../redux/router/actions'
import { Media } from 'reactstrap'
import StarGenerator from './StarGenerator'
import BackgroundObjects from './BackgroundObjects'
import Rocket from './Rocket'
import Earth from './Earth'
import Moon from './Moon'
import CrecentMoon from './CrecentMoon'
import './styles.css'

const { ROOT, ABOUT, HOME, SUPPORT } = RouteMap
const ROUTES_TO_RENDER_ROCKET_EARTH_MOON = [ROOT, ABOUT, HOME, SUPPORT]

const BACKGROUND_IMAGE =
  'https://steamuserimages-a.akamaihd.net/ugc/1490082213003709148/10EB3DC850188A66E73C17AD9538DF8A1FE5FD9F/'

const mapStateToProps = ({
  User: {
    Settings: { show_animated_background },
  },
  Window: { innerHeight, innerWidth },
  router: {
    location: { pathname },
  },
}) => ({
  show_animated_background,
  starLength: Math.ceil((innerHeight + innerWidth) / 5),
  pathname,
})

const BackgroundImage = ({ show_animated_background, starLength, pathname }) => {
  const renderRocketEarthMoon = useMemo(
    () => (
      <BackgroundObjects>
        <Rocket zIndex={-1} />
        <Earth />
        <Moon />
      </BackgroundObjects>
    ),
    [],
  )
  const renderStars = useMemo(() => <StarGenerator length={starLength} />, [starLength])

  return (
    <Fragment>
      <div className='BackgroundImage'>
        {/* <Media src={BACKGROUND_IMAGE} style={{ opacity: 0.1 }} /> */}
        {show_animated_background && renderStars}
      </div>
      {show_animated_background &&
        ROUTES_TO_RENDER_ROCKET_EARTH_MOON.includes(pathname) &&
        renderRocketEarthMoon}
    </Fragment>
  )
}

export default reduxConnect(mapStateToProps)(BackgroundImage)
