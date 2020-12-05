import { lazy } from 'react'
import ReactGA from 'react-ga'
import MomentJS from 'moment'

const isType = {
  UNDEFINED: 'undefined',
  NULL: 'object',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  BIG_INT: 'bigint',
  STRING: 'string',
  SYMBOL: 'symbol',
  FUNCTION: 'function',
  OBJECT: 'object',
}

const DOCUMENT_FORMAT = {
  xml: 'XML',
  pdf: 'PDF',
  txt: 'TXT',
  json: 'JSON',
  csv: 'CSV',
  url: 'URL',
  gif: 'GIF',
  png: 'PNG',
  jpg: 'JPG',
  jpeg: 'JPG',
  doc: 'DOC',
  docx: 'DOCX',
  xls: 'XLS',
  xlsx: 'XLXS',
  msg: 'MSG',
}

const DOCUMENT_MIME_TYPE = {
  XML: 'application/xml',
  PDF: 'application/pdf',
  TXT: 'text/plain',
  JSON: 'application/json',
  CSV: 'text/csv',
  URL: 'text/url',
  GIF: 'image/gif',
  PNG: 'image/png',
  JPG: 'image/jpeg',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

Number.prototype.toFixedNumber = function (digits, base) {
  let pow = Math.pow(base || 10, digits)
  return Math.round(this * pow) / pow
}

const DeepClone = arrayOrObj => JSON.parse(JSON.stringify(arrayOrObj))

const getObjectLength = obj => Object.keys(obj).length

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getRandomFloat = (min, max, fix = 3) => (Math.random() * (min - max) + max).toFixedNumber(fix)

const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })))

const objectToArray = obj => Object.values(obj)

const removeKeyOrValueFromObject = (obj, keyOrValueToRemove) => {
  let newObj = DeepClone(obj)
  const keyFound = newObj[keyOrValueToRemove] ? true : false
  const isValue = !keyFound
  if (keyFound) {
    delete newObj[keyOrValueToRemove]
  } else if (isValue) {
    newObj = {}

    Object.keys(newObj).forEach(key => {
      if (newObj[key] !== keyOrValueToRemove) newObj[key] = newObj[key]
    })
  }
  return newObj
}

const mapObject = (object = {}, props = []) => {
  if (typeof props === 'string') {
    if (object[props]) {
      const value = object[props]
      return value
    }
  } else if (Array.isArray(props)) {
    const newObject = props.reduce((result, prop) => {
      if (object[prop]) {
        result[prop] = object[prop]
        return result
      } else {
        return result
      }
    }, {})

    return newObject
  }

  return object
}

const isEquivalent = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

const isOnline = last_login => new Date() - new Date(last_login) <= 1000 * 60 * 5

const findMaxInt = (arrayOfObjs, prop) => Math.max(...arrayOfObjs.map(e => e[prop]))

const sortedMap = map => new Map([...map.entries()].sort().sort((a, b) => b[1] - a[1]))

const removeArrayDuplicates = array => [...new Set(array)]

const removeAttributeDuplicates = (array, objAttr = 'id', props) => {
  let map = new Map()

  if (props) {
    for (let i = 0, { length } = array; i < length; i++) {
      try {
        const newItem = mapObject(array[i], props)
        map.set(array[i][objAttr], newItem)
      } catch (e) {}
    }
  } else {
    for (let i = 0, { length } = array; i < length; i++) {
      try {
        map.set(array[i][objAttr], array[i])
      } catch (e) {}
    }
  }

  return [...map.values()]
}

const filterMapArray = (array = [], uniqueKey = 'id', props) => {
  if (!uniqueKey && !props) {
    return array
  }

  if (uniqueKey) {
    return removeAttributeDuplicates(array, uniqueKey, props)
  } else if (props) {
    const mappedArray = array.map(item => (item = mapObject(item, props)))
    return mappedArray
  }

  return array
}

const isSubset = (arr1, arr2) => arr2.every(e => arr1.includes(e))

const TopKFrequentStrings = (arrayOfObjs, prop = 'id', k = arrayOfObjs.length) => {
  if (!arrayOfObjs) return []
  let map = new Map()
  for (let i = 0, { length } = arrayOfObjs; i < length; i++) {
    const s = arrayOfObjs[i][prop]
    if (s != undefined && s.length > 0) map.has(s) ? map.set(s, map.get(s) + 1) : map.set(s, 1)
  }

  const newArray = [...sortedMap(map).keys()].slice(0, k)
  return newArray
}

const getUrlImageBase64 = url =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }),
    )

const getCanvasImageBase64 = (img, outputFormat = 'image/jpeg', quality = 1) =>
  new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    let dataURL = canvas.toDataURL(outputFormat, quality)
    resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''))
  })

const getImageBase64 = image =>
  new Promise((resolve, reject) => {
    let reader = new FileReader()
    if (!image) reject(image)
    reader.readAsDataURL(image)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const exportJSON = (data, name = 'formattedJson') => {
  const fileName = `${name}.json`
  // const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
  // let downloadAnchorNode = document.createElement('a')
  // downloadAnchorNode.setAttribute('href', dataStr)
  // downloadAnchorNode.setAttribute('download', fileName)
  // document.body.appendChild(downloadAnchorNode) // required for firefox
  // downloadAnchorNode.click()
  // downloadAnchorNode.remove()

  if (!data) {
    alert('No data')
    return
  }

  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4)
  }

  let blob = new Blob([data], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

const loadJSON = file =>
  new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = ({ target: { result } }) => {
      const json = JSON.parse(result)
      return resolve(json)
    }
    reader.onerror = error => reject(error)
  })

const htmlToArrayOfBase64 = html => {
  const [first, ...data] = html.split('data:')
  const arrayOfBase64 = data.reduce((result, e) => {
    const url = `data:${e.split('"')[0]}`
    return isDecodable(url, { allowMime: true }) ? result.concat(url) : result
  }, [])

  return arrayOfBase64
}

const isDecodable = (str, opts) => {
  if (str instanceof Boolean || typeof str === 'boolean') {
    return false
  }

  if (!(opts instanceof Object)) {
    opts = {}
  }

  if (opts.allowEmpty === false && str === '') {
    return false
  }

  let regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?'
  let mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)'

  if (opts.mimeRequired === true) {
    regex = mimeRegex + regex
  } else if (opts.allowMime === true) {
    regex = mimeRegex + '?' + regex
  }

  if (opts.paddingRequired === false) {
    regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
  }

  return new RegExp('^' + regex + '$', 'gi').test(str)
}

const htmlToArrayOfFiles = (html, filename) =>
  htmlToArrayOfBase64(html).map(base64 => {
    const file = getFileFromBase64(base64, filename)
    return file
  })

const getImageBlob = image =>
  new Promise((resolve, reject) => resolve(window.URL.createObjectURL(image)))

const getFileFromBase64 = (dataurl, filename) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    type = mime.split('/')[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${type}`, { type: mime })
}

const joinStrings = objectArray => {
  if (!objectArray || objectArray.length < 1) {
    return objectArray
  }
  if (Array.isArray(objectArray)) {
    return objectArray
      .map(i => (typeof i.value === 'number' ? i.value : i.value.replace('|', '')))
      .join('|')
  }
  if (typeof objectArray == 'object') {
    return objectArray.value
  }
  return objectArray
}

const splitStrings = value => {
  if (!value) return value
  switch (typeof value) {
    case 'string':
      return value.split('|').map(i => (i = { value: i, label: i }))
    case 'number':
      return { value, label: value }
    default:
      return value
  }
}

const importTextFileEntries = files => {}

const readmultifiles = e => {
  const files = e.currentTarget.files
  Object.keys(files).forEach(i => {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = e => {
      const { result } = reader
      //server call for uploading or reading the files one-by-one
      //by using 'reader.result' or 'file'
      console.log('readmultifiles: ', result)
    }
    reader.readAsBinaryString(file)
  })
}

const lazyDelay = time => promiseResult =>
  new Promise(resolve => setTimeout(() => resolve(promiseResult), time))

const lazyLoadWithTimeOut = (min, max, componentPath) =>
  lazy(() => {
    return new Promise(resolve => setTimeout(resolve, getRandomInt(min, max))).then(
      () =>
        // Math.floor(Math.random() * 10) >= 4 ?
        import(componentPath),
      // : Promise.reject(new Error())
    )
  })

const addDynamicScript = (scriptId, url, callback = null) => {
  const head = document.getElementsByTagName('head')[0]
  const existingScript = document.getElementById(scriptId)

  if (!existingScript) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url // URL for the third-party library being loaded.
    script.id = scriptId // e.g. googleMaps, parlay
    head.appendChild(script)

    // Use if you need to run code after script is loaded
    script.onload = () => {
      if (callback) callback()
    }
  }

  if (existingScript && callback) callback()
}

const capitalizeFirstLetter = string => {
  if (typeof string === 'string' || string instanceof String)
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

const debounce = (func, delay = 400) => {
  let debounceTimer
  return function (...args) {
    const context = this
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

const throttled = (func, delay = 1000) => {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func(...args)
  }
}

const copyStringToClipboard = s => {
  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(s)
      .then(text => {
        // Success!
        return text
      })
      .catch(error => {
        console.log('Something went wrong', error)
        return error
      })
  } else {
    // Create new element
    let el = document.createElement('textarea')
    // Set value (string to be copied)
    el.value = s
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '')
    document.body.appendChild(el)
    // Select text inside element
    el.select()
    // Copy text to clipboard
    document.execCommand('copy')
    // Remove temporary element
    document.body.removeChild(el)
  }
}

const cleanObject = (obj, truthyCheck = false) => {
  for (const key in obj) {
    if (truthyCheck && !obj[key]) {
      delete obj[key]
    } else if (
      obj[key] === null ||
      obj[key] === undefined ||
      (Array.isArray(obj[key]) && obj[key].length === 0)
    ) {
      delete obj[key]
    }
  }
  return obj
}

const stripHtml = html => {
  let tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const fuzzySearch = (s, p, caseSensitive = false, maxLength = 1000) => {
  // s = s.substr(0, maxLength)
  // p = p.substr(0, maxLength)
  if (!caseSensitive) {
    s = s.toUpperCase()
    p = p.toUpperCase()
  }
  // p = p.replace(" ", "*")
  // p = `*${p.split("").join("*")}*`
  const m = s.length
  const n = p.length
  let i = 0
  let j = 0
  const stack = []
  while (i < m) {
    if (s[i] === p[j] || p[j] === '?') {
      i += 1
      j += 1
    } else if (p[j] === '*') {
      stack.push([i + 1, j])
      j += 1
    } else if (stack.length) {
      ;[i, j] = stack.pop()
    } else {
      return false
    }
  }
  while (j < n) {
    if (p[j] !== '*') {
      return false
    }
    j += 1
  }
  return true
}

const replaceAll = (str, mapObj) => {
  let re = new RegExp(Object.keys(mapObj).join('|'), 'gi')

  return str.replace(re, matched => mapObj[matched.toLowerCase()])
}

const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

const stringMatch = (s1, s2, caseSensitive = false) => {
  s1 = s1 || ''
  s2 = s2 || ''
  const flags = caseSensitive ? 'g' : 'gi'
  const cleanString = escapeRegExp(s2)

  const regexMatch = new RegExp(cleanString, flags)

  return s1.match(regexMatch)
}

const formatBytes = (bytes, decimals = 2) => {
  if (0 === bytes) return '0B'
  const fix = 0 > decimals ? 0 : decimals
  const d = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, d)).toFixed(fix))}${
    ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  }`
}

const getStringBytes = object => parseInt(JSON.stringify(object).split(/%..|./).length - 1)

const shareUrl = ({ url, title, text }) => {
  if (!navigator.share) return
  navigator
    .share({
      url,
      title,
      text,
    })
    .then(response => {
      console.log('Successfully shared: ', response)
      ReactGA.event({
        category: 'Share Url',
        action: 'User shared a url!',
        value: url,
      })
    })
    .catch(error => {
      console.log(error)
    })
}

const shareFile = file => {
  let filesArray = [file]
  if (!navigator.canShare || !navigator.canShare({ files: filesArray })) return
  navigator
    .share({
      files: filesArray,
      title: 'My File',
      text: 'Here, Sharing my files. Keep it safe',
    })
    .then(() => {
      console.log('Share was successful.')
      ReactGA.event({
        category: 'Share File',
        action: 'User shared a file!',
      })
    })
    .catch(error => console.log('Sharing failed', error))
}

const deepParseJson = jsonString => {
  // if not stringified json rather a simple string value then JSON.parse will throw error
  // otherwise continue recursion
  if (typeof jsonString === 'string') {
    if (!isNaN(Number(jsonString))) {
      // if a numeric string is received, return itself
      // otherwise JSON.parse will convert it to a number
      return jsonString
    }
    try {
      return deepParseJson(JSON.parse(jsonString))
    } catch (err) {
      return jsonString
    }
  } else if (Array.isArray(jsonString)) {
    // if an array is received, map over the array and deepParse each value
    return jsonString.map(val => deepParseJson(val))
  } else if (typeof jsonString === 'object' && jsonString !== null) {
    // if an object is received then deepParse each element in the object
    // typeof null returns 'object' too, so we have to eliminate that
    return Object.keys(jsonString).reduce((obj, key) => {
      obj[key] = deepParseJson(jsonString[key])
      return obj
    }, {})
  } else {
    // otherwise return whatever was received
    return jsonString
  }
}

// Only usable served with HTTPS
const getSHA256 = async message => {
  const encoder = new TextEncoder()
  const msgUint8 = encoder.encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

const showFile = (blob, name, extension) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  let newBlob = new Blob([blob], { type: DOCUMENT_MIME_TYPE[extension] })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob)
    return
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob)
  let link = document.createElement('a')
  link.href = data
  link.download = `${name}.${extension}`
  link.click()
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data)
  }, 100)
}

const differenceBetweenStrings = (s1, s2) => {
  if (typeof s1 !== isType.STRING) {
    s1 = JSON.stringify(s1)
  }
  if (typeof s2 !== isType.STRING) {
    s2 = JSON.stringify(s2)
  }
  return s2.split('').reduce((diff, val, i) => (val != s1.charAt(i) ? (diff += val) : diff), '')
}

const isAFunction = value => value instanceof Function || typeof value === isType.FUNCTION

const isObject = value => {
  const type = typeof value
  return value != null && (type === isType.OBJECT || isAFunction(value))
}

const shallowEquals = (a, b) => {
  if (a === b) return true
  if (!(a || b)) return true
  // if ((!a && b) || (!b && a)) return false;

  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false
    }
  }

  for (const key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false
    }
  }

  return true
}

const getValidDate = s => {
  const date = new Date(s)

  if (typeof date === isType.STRING || date.getTime() !== date.getTime()) {
    return null
  }

  return date
}

const getLocalDateTimeNoSeconds = (date, displaySeconds = false) => {
  // 2020-11-10T19:38
  return MomentJS(date).format(`YYYY-MM-DDTHH:mm${displaySeconds ? ':ss' : ''}`)

  // return new Date(date.getTime(), + new Date().getTimezoneOffset() * -60 * 1000)
  //   .toISOString()
  //   .slice(0, 19)
}

const nFormatter = (num, digits = 0) => {
  var si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

export {
  isType,
  DOCUMENT_FORMAT,
  DOCUMENT_MIME_TYPE,
  DeepClone,
  getObjectLength,
  getRandomInt,
  getRandomFloat,
  arrayToObject,
  objectToArray,
  removeKeyOrValueFromObject,
  mapObject,
  isEquivalent,
  isOnline,
  findMaxInt,
  sortedMap,
  removeArrayDuplicates,
  removeAttributeDuplicates,
  filterMapArray,
  isSubset,
  TopKFrequentStrings,
  getUrlImageBase64,
  getCanvasImageBase64,
  getImageBase64,
  exportJSON,
  loadJSON,
  htmlToArrayOfBase64,
  isDecodable,
  htmlToArrayOfFiles,
  getImageBlob,
  getFileFromBase64,
  joinStrings,
  splitStrings,
  importTextFileEntries,
  readmultifiles,
  lazyDelay,
  lazyLoadWithTimeOut,
  addDynamicScript,
  capitalizeFirstLetter,
  debounce,
  throttled,
  copyStringToClipboard,
  cleanObject,
  stripHtml,
  fuzzySearch,
  replaceAll,
  stringMatch,
  formatBytes,
  getStringBytes,
  shareUrl,
  shareFile,
  deepParseJson,
  getSHA256,
  showFile,
  differenceBetweenStrings,
  isAFunction,
  isObject,
  shallowEquals,
  getValidDate,
  getLocalDateTimeNoSeconds,
  nFormatter,
}
