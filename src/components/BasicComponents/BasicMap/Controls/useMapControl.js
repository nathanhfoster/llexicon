import React, { useLayoutEffect, cloneElement } from 'react'
import { render } from 'react-dom'

const renderChildren = (children, props) =>
  Array.isArray(children)
    ? children.map(child => cloneElement(child, props))
    : cloneElement(children, props)

const useMapControl = ({ map, controlPosition, children, width }) => {
  useLayoutEffect(() => {
    if (map && controlPosition) {
      let divElement = document.createElement('div')
      render(
        <div
          style={{ width }}
          ref={element => {
            map.controls[controlPosition].push(element)
          }}
        >
          {renderChildren(children, { map, controlPosition })}
        </div>,
        divElement,
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
