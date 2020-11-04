import React, { useEffect } from 'react'
import { render } from 'react-dom'

const useMapControl = (map, controlPosition, children, width) => {
  useEffect(() => {
    if (map && controlPosition) {
      render(
        <div style={{ width }} ref={el => map.controls[controlPosition].push(el)}>
          {children}
        </div>,
        document.createElement('div'),
      )
    }
    return () => {
      if (map && controlPosition) {
        map.controls[controlPosition].clear()
      }
    }
  }, [map, controlPosition, width])
}

export default useMapControl
