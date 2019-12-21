const getPolygonCenter = arrayOfPoints => {
  var x = arrayOfPoints.map(x => x[0])
  var y = arrayOfPoints.map(x => x[1])
  var cx = (Math.min(...x) + Math.max(...x)) / 2
  var cy = (Math.min(...y) + Math.max(...y)) / 2
  return [cx, cy]
}

export default getPolygonCenter
