import deepEquals from "./deepEquals"
import { removeArrayDuplicates } from "./"

const propsThatDiffer = (prevProps, nextProps, memoProps, logging = false) => {
  let differentProps = []

  const allProps = removeArrayDuplicates(
    Object.keys(prevProps).concat(Object.keys(nextProps))
  )

  const props = memoProps || allProps

  for (let i = 0, { length } = props; i < length; i++) {
    const prop = props[i]
    const prevValue = prevProps[prop]
    const nextValue = nextProps[prop]
    if (!deepEquals(prevValue, nextValue, logging)) {
      differentProps.push([prop, prevValue, nextValue])
    }
  }

  return differentProps
}

export default propsThatDiffer
