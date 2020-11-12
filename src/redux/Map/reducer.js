import { AppActionTypes } from 'redux/App/types'
import { MapActionTypes } from './types'

const CENTER_OF_US = { lat: 39.8097343, lng: -98.5556199 }

const DEFAULT_STATE_MAP = {
  center: CENTER_OF_US,
  bounds: {
    nw: {
      lat: 63.35282888490272,
      lng: -144.61030739999998,
    },
    se: {
      lat: 4.391784211865868,
      lng: -52.50093239999998,
    },
    sw: {
      lat: 4.391784211865868,
      lng: -144.61030739999998,
    },
    ne: {
      lat: 63.35282888490272,
      lng: -52.50093239999998,
    },
  },
  zoom: 4,
}

const Map = (state = DEFAULT_STATE_MAP, action) => {
  const { type, payload } = action

  switch (type) {
    case MapActionTypes.MAP_SET_BOUNDS_CENTER_ZOOM:
      return { ...state, ...payload }

    case MapActionTypes.MAP_RESET:
      return DEFAULT_STATE_MAP

    case AppActionTypes.LOAD_PERSISTED_STATE:
      return payload?.Map || state

    default:
      return state
  }
}

export { DEFAULT_STATE_MAP, Map }
