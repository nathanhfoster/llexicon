import deepEquals from "./deepEquals"

const memoizeProps = (prevProps, nextProps, memoProps) => {
  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (!deepEquals(prevProps[prop], nextProps[prop])) {
      return false
    }
  }

  return true
}

export default memoizeProps
