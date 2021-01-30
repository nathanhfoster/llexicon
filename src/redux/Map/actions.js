import actions from '../actionTypes'

export const SetMapBoundsCenterZoom = payload => ({
  type: actions.MAP_SET_BOUNDS_CENTER_ZOOM,
  payload,
})

export const ResetMap = () => ({ type: actions.MAP_RESET })
