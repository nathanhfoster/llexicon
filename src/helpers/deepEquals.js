var isArray = Array.isArray
var keyList = Object.keys
var hasProp = Object.prototype.hasOwnProperty
var hasElementType = typeof Element !== "undefined"

const deepEquals = (a, b, logging = false) => {
  if (a === b) return true

  if (a && b && typeof a == "object" && typeof b == "object") {
    var arrA = isArray(a),
      arrB = isArray(b),
      i,
      length,
      key

    if (arrA && arrB) {
      length = a.length
      if (length != b.length) {
        logging && console.log("length != b.length ", length, b.length)
        return false
      }
      for (i = length; i-- !== 0; )
        if (!deepEquals(a[i], b[i], logging)) {
          logging && console.log("!deepEquals(a[i], b[i]) ", a[i], b[i])
          return false
        }
      return true
    }

    if (arrA != arrB) {
      logging && console.log("arrA != arrB ", arrA, arrB)
      return false
    }

    var dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA != dateB) {
      logging && console.log("dateA != dateB ", dateA, dateB)
      return false
    }
    if (dateA && dateB) return a.getTime() == b.getTime()

    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp
    if (regexpA != regexpB) {
      logging && console.log("regexpA != regexpB ", regexpA, regexpB)
      return false
    }
    if (regexpA && regexpB) return a.toString() == b.toString()

    var keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) {
      logging &&
        console.log("length !== keyList(b).length ", length, keyList(b).length)
      return false
    }

    for (i = length; i-- !== 0; )
      if (!hasProp.call(b, keys[i])) {
        logging && console.log("!hasProp.call(b, keys[i])", b, keys[i])
        return false
      }

    // custom handling for DOM elements
    if (hasElementType && a instanceof Element) {
      logging &&
        console.log("hasElementType && a instanceof Element", hasElementType, a)
      return false
    }

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
        if (!deepEquals(a[key], b[key], logging)) {
          logging && console.log("!deepEquals(a[key], b[key])", a[key], b[key])
          return false
        }
      }
    }

    return true
  }
  const strictEquality = a !== a && b !== b
  logging &&
    console.log("strictEquality ", strictEquality, "a !== a && b !== b ", a, b)
  return strictEquality
}

export default deepEquals
