import { useState, useLayoutEffect } from 'react'
import { usePrevious } from 'hooks'

const useScrollable = ({ threshold = true, handleReachedBottom }) => {
  const [scrollProps, setScrollProps] = useState({
    scrollHeight: null,
    scrollTop: null,
    clientHeight: null,
    scrollOffset: null,
    reachedBottom: false,
  })

  const previousScrollProps = usePrevious(scrollProps)

  const handleOnScroll = e => {
    if (!e) return
    const {
      target: { scrollHeight, scrollTop, clientHeight },
    } = e
    const scrollOffset = clientHeight / 4

    const reachedBottom = threshold && scrollHeight - scrollTop <= clientHeight + scrollOffset

    setScrollProps({ scrollHeight, scrollTop, clientHeight, scrollOffset, reachedBottom })
  }

  useLayoutEffect(() => {
    if (!previousScrollProps || !scrollProps) return
    if (
      scrollProps.reachedBottom &&
      (previousScrollProps.scrollHeight != scrollProps.scrollHeight ||
        previousScrollProps.scrollTop != scrollProps.scrollTop ||
        previousScrollProps.clientHeight != scrollProps.clientHeight ||
        previousScrollProps.scrollOffset != scrollProps.scrollOffset)
    ) {
      handleReachedBottom(scrollProps)
    }
  }, [handleReachedBottom, previousScrollProps, scrollProps])

  return handleOnScroll
}

export default useScrollable
