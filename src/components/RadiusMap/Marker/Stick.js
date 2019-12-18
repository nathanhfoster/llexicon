import React, { Fragment, memo } from 'react'
import PropTypes from 'prop-types'
import { history } from 'store'
import { SvgIcon } from '@material-ui/core'
import { ZoomIn } from '@material-ui/icons'
import {
  K_CIRCLE_SIZE,
  K_BORDER_WIDTH,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover
} from './styles'

import { DEFAULT_POLYGON_MIN_ZOOM } from '../constants'

const infoClick = ({ $dimensionKey, center, selectSite, setMapCenterBoundsZoom }) => {
  selectSite($dimensionKey)
  setMapCenterBoundsZoom({ center })
  history.push(`/v2/projects/${$dimensionKey}`)
}

const zoomClick = ({ center, setMapCenterBoundsZoom }) =>
  setMapCenterBoundsZoom({ center, zoom: DEFAULT_POLYGON_MIN_ZOOM })

const clientNameCharacterStyle = {
  fontFamily: 'Arial Bold'
}

const infoStyle = {
  fontFamily: 'Comic Sans MS'
}

const zoomStyle = {
  fontSize: 14
}

const ClientNameCharacter = clientName => {
  return (
    <span style={clientNameCharacterStyle}>
      <SvgIcon>
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
      </SvgIcon>
    </span>
  )
  // if (!clientName) clientName = 'P'
  // return <span style={clientNameCharacterStyle}>{clientName.charAt(0).toUpperCase()}</span>
}

const Info = props => (
  <span style={infoStyle} onClick={() => infoClick(props)}>
    i
  </span>
)

const Zoom = props => (
  <span style={zoomStyle} onClick={() => zoomClick(props)}>
    <ZoomIn />
  </span>
)

const Stick = props => {
  const { clientName, shouldShowPreview, inGroup, zoom } = props
  let text = ClientNameCharacter(clientName)
  let circleStyle = locationCircleStyle
  let stickStyle = locationStickStyle

  const zoomOffset = DEFAULT_POLYGON_MIN_ZOOM - 3

  if (shouldShowPreview) {
    if (zoom <= zoomOffset) text = Zoom(props)
    else text = Info(props)
    circleStyle = locationCircleStyleHover
    stickStyle = locationStickStyleHover
  }

  return (
    <Fragment>
      <div style={circleStyle}>{text}</div>
      <div style={stickStyle} />
    </Fragment>
  )
}

Stick.propTypes = {
  $dimensionKey: PropTypes.string,
  clientName: PropTypes.string,
  shouldShowPreview: PropTypes.bool,
  inGroup: PropTypes.bool,
  center: PropTypes.arrayOf(PropTypes.number.isRequired),
  selectSite: PropTypes.func.isRequired,
  setMapCenterBoundsZoom: PropTypes.func.isRequired
}

export default memo(Stick)
