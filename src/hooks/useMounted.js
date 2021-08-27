import { useEffect, useRef } from 'react'

/**
 * @param {Boolean=} - if you want to bypass some logic from an HOC
 * @returns {Boolean} - if the component is mounted to the DOM
 */
const useMounted = (initialValue = false) => {
  const mounted = useRef(initialValue)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  })

  return mounted.current
}

export default useMounted
