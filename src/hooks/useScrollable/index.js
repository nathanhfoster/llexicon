import { useState, useCallback, useEffect } from 'react'
import { usePrevious } from 'hooks'
import { shallowEquals } from 'utils'

const useScrollable = ({ threshold = true, handleReachedBottom }) => {
  const [scrollProps, setScrollProps] = useState({
    scrollHeight: null,
    scrollTop: null,
    clientHeight: null,
    scrollOffset: null,
    reachedBottom: false,
  })

  const previousScrollProps = usePrevious(scrollProps)

  const handleOnScroll = useCallback(
    e => {
      if (!e) return
      const {
        target: { scrollHeight, scrollTop, clientHeight },
      } = e
      const scrollOffset = clientHeight / 4

      const reachedBottom = threshold && scrollHeight - scrollTop <= clientHeight + scrollOffset

      setScrollProps({
        scrollHeight,
        scrollTop,
        clientHeight,
        scrollOffset,
        reachedBottom,
      })
    },
    [threshold],
  )

  useEffect(() => {
    if (!previousScrollProps || !scrollProps) return

    const debounce = setTimeout(() => {
      if (scrollProps.reachedBottom && !shallowEquals(previousScrollProps, scrollProps)) {
        handleReachedBottom(scrollProps)
      }
    }, 200)

    return () => {
      clearTimeout(debounce)
    }
  }, [handleReachedBottom, previousScrollProps, scrollProps])

  return handleOnScroll
}

export default useScrollable
