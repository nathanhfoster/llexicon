import { MapActionTypes } from "./types"
import ReactGA from "react-ga"

const SetMapBoundsCenterZoom = (payload) => ({
  type: MapActionTypes.MAP_SET_BOUNDS_CENTER_ZOOM,
  payload,
})

const ResetMap = () => ({ type: MapActionTypes.MAP_RESET })

export { SetMapBoundsCenterZoom, ResetMap }
