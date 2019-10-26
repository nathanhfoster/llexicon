const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

const objectToArray = obj => Object.keys(obj).map(key => obj[key]);

const DeepCopy = arrayOrObj => JSON.parse(JSON.stringify(arrayOrObj));

const isEquivalent = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

const isOnline = last_login =>
  new Date() - new Date(last_login) <= 1000 * 60 * 5;

const findMaxInt = (arrayOfObjs, prop) =>
  Math.max(...arrayOfObjs.map(e => e[prop]));

const sortedMap = map =>
  new Map([...map.entries()].sort().sort((a, b) => b[1] - a[1]));

const RemoveArrayDuplicates = array => [...new Set(array)];

const isSubset = (arr1, arr2) => arr2.every(e => arr1.includes(e));

const TopKFrequentStrings = (arrayOfObjs, prop, k) => {
  let map = new Map();
  for (let i = 0; i < arrayOfObjs.length; i++) {
    const s = arrayOfObjs[i][prop];
    if (s != undefined && s.length > 0)
      map.has(s) ? map.set(s, map.get(s) + 1) : map.set(s, 1);
  }

  const newArray = [...sortedMap(map).keys()].slice(0, k);
  if (newArray.length == 1) return newArray[0];
  else return newArray;
};

const getImageBase64 = image => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (!image) reject(image);
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const getImageBase64ToFile = async (dataurl, filename) => {
  if (!dataurl.includes("data")) return dataurl;
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return await new File([u8arr], filename, { type: mime });
};

const joinStrings = objectArray => {
  if (!objectArray || objectArray.length < 1) {
    return objectArray;
  }
  if (Array.isArray(objectArray)) {
    return objectArray
      .map(i =>
        typeof i.value === "number" ? i.value : i.value.replace("|", "")
      )
      .join("|");
  }
  if (typeof objectArray == "object") {
    return objectArray.value;
  }
  return objectArray;
};

const splitStrings = value => {
  if (!value) return value;
  switch (typeof value) {
    case "string":
      return value.split("|").map(i => (i = { value: i, label: i }));
    case "number":
      return { value, label: value };
    default:
      return value;
  }
};

export {
  getRandomInt,
  arrayToObject,
  objectToArray,
  DeepCopy,
  isEquivalent,
  isOnline,
  findMaxInt,
  sortedMap,
  RemoveArrayDuplicates,
  isSubset,
  TopKFrequentStrings,
  getImageBase64,
  getImageBase64ToFile,
  joinStrings,
  splitStrings
};
