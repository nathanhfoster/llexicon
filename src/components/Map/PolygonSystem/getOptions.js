// Bright Green
export const DEFAULT_STROKE = '#32ff7e'
// Orange
export const SELECTED_COLOR = '#f39c12'
// Green
export const ATTACHED_COLOR = '#2ecc71'
// Red
export const NOT_ATTACHED_OR_SELECTED_COLOR = '#e74c3c'

const getOptions = ({
  $dimensionKey,
  id,
  $hover,
  options,
  _attached,
  _selected,
  hoveredChildKey,
  $onMouseAllow,
  zoom
}) => {
  if (id === 'userDefinedPolygon') {
    // console.log(options)
    return {
      ...options
      // onMouseEnter: () => $onMouseAllow(true),
      // onMouseLeave: () => $onMouseAllow(false)
    }
  }

  let newOptions = {
    stroke: DEFAULT_STROKE,
    strokeWidth: 1,
    strokeOpacity: 1,
    fillOpacity: 0.45
  }

  const detachedMetaMapSite = !(_attached || _selected)

  const exisitingProjectSite = _attached === false && _selected === false

  if (_selected) {
    newOptions.fill = SELECTED_COLOR
  } else if (_attached) {
    newOptions.fill = ATTACHED_COLOR
  } else if (detachedMetaMapSite) {
    // Don't render
    // newOptions.fillOpacity = 0
    // newOptions.strokeOpacity = 0
    newOptions.fillOpacity = 0.3
    newOptions.fill = NOT_ATTACHED_OR_SELECTED_COLOR
  } else if (exisitingProjectSite) {
    newOptions.fillOpacity = 0.3
    newOptions.fill = NOT_ATTACHED_OR_SELECTED_COLOR
  }

  // Not using $hover so that the other smaller maps don't change opacity when sites are hovered.
  if ($dimensionKey === hoveredChildKey) {
    newOptions.fillOpacity = 0.9
  }

  if (zoom < 15) newOptions.fillOpacity = 1

  return newOptions

  // TODO fix polygon onHover
  // return {
  //   ...newOptions,
  //   onMouseEnter: () => $onMouseAllow(true),
  //   onMouseLeave: () => $onMouseAllow(false),
  //   onClick: () => console.log('CLICKED on: ', id, $dimensionKey)
  // }
}

export default getOptions
