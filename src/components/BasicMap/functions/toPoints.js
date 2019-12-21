const TILE_SIZE = 256

const world2Screen = ({ x, y }, zoom, heading, tilt = 0) => {
  const scale = Math.pow(2, zoom)
  const scaledTile = scale * TILE_SIZE
  // const zX = Math.cos(tilt)
  // const zY = Math.sin(tilt)
  // console.log('tilt: ', tilt)
  // console.log('zY', zY)
  // console.log('y: ', y)
  // console.log('y / zY: ', x / zY)
  x = x * scaledTile
  y = y * scaledTile

  // console.log({ x, y })
  return { x, y }
}

const latLng2World = ({ lat, lng }) => {
  let sin = Math.sin((lat * Math.PI) / 180)
  let x = lng / 360 + 0.5
  let y = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI

  y =
    y < -1 // eslint-disable-line
      ? -1
      : y > 1
        ? 1
        : y
  return { x, y }
}

export default (lat, lng, zoom, heading, tilt) => {
  const coords = latLng2World({ lat, lng })
  return world2Screen(coords, zoom, heading, tilt)
}

const world2LatLng = ({ x, y }) => {
  const n = Math.PI - 2 * Math.PI * y

  return {
    lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    lng: x * 360 - 180
  }
}
