var isArray = Array.isArray
var keyList = Object.keys
var hasProp = Object.prototype.hasOwnProperty
var hasElementType = typeof Element !== "undefined"

const deepEquals = (a, b) => {
  if (a === b) return true

  if (a && b && typeof a == "object" && typeof b == "object") {
    var arrA = isArray(a),
      arrB = isArray(b),
      i,
      length,
      key

    if (arrA && arrB) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (!deepEquals(a[i], b[i])) return false
      return true
    }

    if (arrA != arrB) return false

    var dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA != dateB) return false
    if (dateA && dateB) return a.getTime() == b.getTime()

    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp
    if (regexpA != regexpB) return false
    if (regexpA && regexpB) return a.toString() == b.toString()

    var keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) return false

    for (i = length; i-- !== 0; ) if (!hasProp.call(b, keys[i])) return false

    // custom handling for DOM elements
    if (hasElementType && a instanceof Element) return false

    // custom handling for React
    for (i = length; i-- !== 0; ) {
      key = keys[i]
      if (key === "_owner" && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue
      } else {
        // all other properties should be traversed as usual
        if (!deepEquals(a[key], b[key])) return false
      }
    }

    return true
  }

  return a !== a && b !== b
}

const deepEqual = (previous, current) => {
  if (previous === current) return true
  if (!previous && current) return false
  if (previous && !current) return false
  if (!previous && !current) return false

  if (Array.isArray(previous)) {
    if (!Array.isArray(current)) return false
    if (previous.length !== current.length) return false

    for (let i = 0; i < previous.length; i++) {
      if (!deepEqual(current[i], previous[i])) {
        return false
      }
    }

    return true
  }

  if (typeof current === "object") {
    if (typeof previous !== "object") return false
    const prevKeys = Object.keys(previous)
    const currKeys = Object.keys(current)

    if (prevKeys.length !== currKeys.length) return false

    prevKeys.sort()
    currKeys.sort()

    for (let i = 0; i < prevKeys.length; i++) {
      if (prevKeys[i] !== currKeys[i]) return false
      const key = prevKeys[i]
      if (!deepEqual(previous[key], current[key])) return false
    }

    return true
  }

  return false
}

export default deepEquals
