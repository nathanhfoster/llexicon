const GOOGLE_MAP_CONTROL_POSITIONS = {
  BOTTOM: 11,
  BOTTOM_CENTER: 11,
  BOTTOM_LEFT: 10,
  BOTTOM_RIGHT: 12,
  CENTER: 13,
  LEFT: 5,
  LEFT_BOTTOM: 6,
  LEFT_CENTER: 4,
  LEFT_TOP: 5,
  RIGHT: 7,
  RIGHT_BOTTOM: 9,
  RIGHT_CENTER: 8,
  RIGHT_TOP: 7,
  TOP: 2,
  TOP_CENTER: 2,
  TOP_LEFT: 1,
  TOP_RIGHT: 3
}

const GOOGLE_MAP_TYPE_CONTROL_STYLE = {
  DEFAULT: 0,
  HORIZONTAL_BAR: 1,
  DROPDOWN_MENU: 2,
  INSET: 3,
  INSET_LARGE: 4
}

const GOOGLE_MAP_TYPE_ID = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain"
}

const CENTER_OF_US = [39.8097343, -98.5556199]
const DEFAULT_ZOOM = 4

const DEFAULT_MARKER_MIN_ZOOM = 0
const DEFAULT_MARKER_MAX_ZOOM = 14
const DEFAULT_POLYGON_MIN_ZOOM = 15
const DEFAULT_POLYGON_MAX_ZOOM = 22
const DEFAULT_PARLAY_MIN_ZOOM = 15
const DEFAULT_PARLAY_MAX_ZOOM = 22

const DEFAULT_MAP_OPTIONS = {
  gestureHandling: "greedy",
  // scrollwheel: true, // gestureHandling handles this
  minZoom: 0,
  maxZoom: 22,
  disableDefaultUI: false,
  mapTypeControl: true,
  mapTypeId: GOOGLE_MAP_TYPE_ID.ROADMAP,

  mapTypeControlOptions: {
    style: GOOGLE_MAP_TYPE_CONTROL_STYLE.HORIZONTAL_BAR,
    position: GOOGLE_MAP_CONTROL_POSITIONS.TOP_LEFT,
    mapTypeIds: [
      GOOGLE_MAP_TYPE_ID.ROADMAP,
      GOOGLE_MAP_TYPE_ID.SATELLITE,
      GOOGLE_MAP_TYPE_ID.HYBRID,
      GOOGLE_MAP_TYPE_ID.TERRAIN
    ]
  },
  mapTypeControlOptions: {
    position: GOOGLE_MAP_CONTROL_POSITIONS.LEFT_BOTTOM
  },
  styles: [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    }
  ],
  scaleControl: true,
  streetViewControl: true,
  // tilt and rotateControl doesn't work for custom polygons right now
  tilt: 0,
  rotateControl: false,
  fullscreenControl: true,
  // zoomControl: true,
  zoomControlOptions: {
    position: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM
  },
  clickableIcons: false
}

export {
  GOOGLE_MAP_CONTROL_POSITIONS,
  GOOGLE_MAP_TYPE_CONTROL_STYLE,
  GOOGLE_MAP_TYPE_ID,
  CENTER_OF_US,
  DEFAULT_ZOOM,
  DEFAULT_MARKER_MIN_ZOOM,
  DEFAULT_MARKER_MAX_ZOOM,
  DEFAULT_POLYGON_MIN_ZOOM,
  DEFAULT_POLYGON_MAX_ZOOM,
  DEFAULT_PARLAY_MIN_ZOOM,
  DEFAULT_PARLAY_MAX_ZOOM,
  DEFAULT_MAP_OPTIONS
}
