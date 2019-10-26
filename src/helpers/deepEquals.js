const hashObject = object => {
  const objectString = JSON.stringify(object);
  let hashMap = {};

  for (let i = 0; i < objectString.length; i++) {
    const char = objectString.charAt(i);
    hashMap[char] = hashMap[char] + i || i;
  }

  const hash = Object.keys(hashMap).reduce(
    (count, key) => count + hashMap[key],
    0
  );

  return hash;
};

export default (a, b) => {
  if (!(a && b)) return false;
  const obj1Hash = hashObject(a);
  const obj2Hash = hashObject(b);

  return obj1Hash === obj2Hash;
};
