import { lazy } from "react"

const DeepClone = arrayOrObj => JSON.parse(JSON.stringify(arrayOrObj))

const getObjectLength = obj => Object.keys(obj).length

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const getRandomFloat = (min, max, fix = 3) =>
  (Math.random() * (min - max) + max).toFixed(fix)

const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })))

const objectToArray = obj => Object.keys(obj).map(key => obj[key])

const removeKeyOrValueFromObject = (obj, keyOrValueToRemove) => {
  // console.log("removeKeyOrValueFromObject: ", keyOrValueToRemove)
  let newObj = DeepClone(obj)
  const keyFound = newObj[keyOrValueToRemove] ? true : false
  const isValue = !keyFound
  if (keyFound) {
    delete newObj[keyOrValueToRemove]
    // console.log("keyFound: ", newObj)
  } else if (isValue) {
    newObj = {}

    Object.keys(newObj).forEach(key => {
      if (newObj[key] !== keyOrValueToRemove) newObj[key] = newObj[key]
    })

    // console.log("ELSE: ", newObj)
  }
  return newObj
}

const isEquivalent = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2)

const isOnline = last_login =>
  new Date() - new Date(last_login) <= 1000 * 60 * 5

const findMaxInt = (arrayOfObjs, prop) =>
  Math.max(...arrayOfObjs.map(e => e[prop]))

const sortedMap = map =>
  new Map([...map.entries()].sort().sort((a, b) => b[1] - a[1]))

const removeArrayDuplicates = array => [...new Set(array)]

const removeAttributeDuplicates = (array, objAttr = "id") => {
  let map = new Map()

  for (let i = 0; i < array.length; i++) {
    try {
      map.set(array[i][objAttr], array[i])
    } catch (e) {}
  }

  return [...map.values()]
}

const isSubset = (arr1, arr2) => arr2.every(e => arr1.includes(e))

const TopKFrequentStrings = (arrayOfObjs, prop, k) => {
  let map = new Map()
  for (let i = 0; i < arrayOfObjs.length; i++) {
    const s = arrayOfObjs[i][prop]
    if (s != undefined && s.length > 0)
      map.has(s) ? map.set(s, map.get(s) + 1) : map.set(s, 1)
  }

  const newArray = [...sortedMap(map).keys()].slice(0, k)
  if (newArray.length == 1) return newArray[0]
  else return newArray
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
        })
    )

const getCanvasImageBase64 = (img, outputFormat = "image/jpeg", quality = 1) =>
  new Promise((resolve, reject) => {
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL(outputFormat, quality)
    resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""))
  })

const getImageBase64 = image =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (!image) reject(image)
    reader.readAsDataURL(image)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const htmlToArrayOfBase64 = html => {
  const [first, ...data] = html.split("data:")
  const arrayOfBase64 = data.map(e => `data:${e.split('"')[0]}`)
  return arrayOfBase64
}

const htmlToArrayOfFiles = (html, filename) =>
  htmlToArrayOfBase64(html).map(base64 => {
    const file = getFileFromBase64(base64, filename)
    return file
  })

const getImageBlob = image =>
  new Promise((resolve, reject) => resolve(window.URL.createObjectURL(image)))

const getFileFromBase64 = (dataurl, filename) => {
  if (!dataurl.includes("data")) return dataurl
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    type = mime.split("/")[1],
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
      .map(i =>
        typeof i.value === "number" ? i.value : i.value.replace("|", "")
      )
      .join("|")
  }
  if (typeof objectArray == "object") {
    return objectArray.value
  }
  return objectArray
}

const splitStrings = value => {
  if (!value) return value
  switch (typeof value) {
    case "string":
      return value.split("|").map(i => (i = { value: i, label: i }))
    case "number":
      return { value, label: value }
    default:
      return value
  }
}

const getMostRecent = (reduxData, newData) => {
  const reduxDataLastUpdated = new Date(
    reduxData.lastUpdated || reduxData.date_updated
  )
  const newDataLastUpdated = new Date(newData.date_updated)

  // console.log(newDataLastUpdated - reduxDataLastUpdated)
  // console.log(newDataLastUpdated - 0 > reduxDataLastUpdated - 0)

  if (newDataLastUpdated > reduxDataLastUpdated) {
    delete reduxData.lastUpdated
    return { ...reduxData, ...newData }
  } else {
    return { ...newData, ...reduxData }
  }
}

const mergeJson = (reduxData, newData) => {
  // console.log(newData, reduxData)
  // Order matters. You want to merge the reduxData into the newData
  const allData = reduxData.concat(newData)
  let mergeMap = {}

  for (let i = 0; i < allData.length; i++) {
    const item = allData[i]
    const { id } = item

    if (!mergeMap[id]) {
      mergeMap[id] = item
    } else {
      // Merge
      mergeMap[id] = getMostRecent(mergeMap[id], item)
    }
  }

  return objectToArray(mergeMap)
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
      console.log("readmultifiles: ", result)
    }
    reader.readAsBinaryString(file)
  })
}

const lazyLoadWithTimeOut = (min, max, componentPath) =>
  lazy(() => {
    return new Promise(resolve =>
      setTimeout(resolve, getRandomInt(min, max))
    ).then(
      () =>
        // Math.floor(Math.random() * 10) >= 4 ?
        import(componentPath)
      // : Promise.reject(new Error())
    )
  })

const addDynamicScript = (scriptId, url, callback = null) => {
  const head = document.getElementsByTagName("head")[0]
  const existingScript = document.getElementById(scriptId)

  if (!existingScript) {
    const script = document.createElement("script")
    script.type = "text/javascript"
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

const capitalize = string => {
  if (typeof string === "string" || string instanceof String)
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

const debounce = (func, delay = 400) => {
  let debounceTimer
  return function(...args) {
    const context = this
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

const throttled = (func, delay = 1000) => {
  let lastCall = 0
  return function(...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func(...args)
  }
}
export {
  DeepClone,
  getObjectLength,
  getRandomInt,
  getRandomFloat,
  arrayToObject,
  objectToArray,
  removeKeyOrValueFromObject,
  isEquivalent,
  isOnline,
  findMaxInt,
  sortedMap,
  removeArrayDuplicates,
  removeAttributeDuplicates,
  isSubset,
  TopKFrequentStrings,
  getUrlImageBase64,
  getCanvasImageBase64,
  getImageBase64,
  htmlToArrayOfBase64,
  htmlToArrayOfFiles,
  getImageBlob,
  getFileFromBase64,
  joinStrings,
  splitStrings,
  mergeJson,
  importTextFileEntries,
  readmultifiles,
  lazyLoadWithTimeOut,
  addDynamicScript,
  capitalize,
  debounce,
  throttled
}
