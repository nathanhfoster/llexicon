import deepEquals from "./deepEquals"

const memoizeProps = (prevProps, nextProps, memoProps, logging = false) => {
  if (!memoProps) return deepEquals(prevProps, nextProps, logging)
  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (!deepEquals(prevProps[prop], nextProps[prop], logging)) {
      return false
    }
  }

  return true
}

export default memoizeProps
