import deepEquals from "./deepEquals"

const memoProps = (prevProps, nextProps) => memoProps => {
  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (!deepEquals(prevProps[prop], nextProps[prop])) {
      return true
    }
  }

  return false
}

export default memoProps
