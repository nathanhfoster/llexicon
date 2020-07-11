import { useState } from "react"

const useScrollable = (threshold = false) => {
  const [reachedBottom, setReachedBottom] = useState(false)

  const setReachedBottomCallback = ({
    target: { scrollHeight, scrollTop, clientHeight },
  }) => {
    const scrollOffset = clientHeight / 4

    const reachedBottom =
      threshold && scrollHeight - scrollTop <= clientHeight + scrollOffset

    if (reachedBottom) {
      setReachedBottom(true)
    } else {
      setReachedBottom(false)
    }
  }

  return [reachedBottom, setReachedBottomCallback]
}

export default useScrollable
