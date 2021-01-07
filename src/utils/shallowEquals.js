const shallowEquals = (a, b, logging = false) => {
  if (a === b) return true
  if (!(a || b)) return true
  // if ((!a && b) || (!b && a)) return false;

  for (var key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      logging && console.log('!(key in b) || a[key] !== b[key]: ', a[key], b[key])
      return false
    }
  }

  for (var key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      logging && console.log('!(key in a) || a[key] !== b[key]: ', a[key], b[key])

      return false
    }
  }

  return true
}

export default shallowEquals
