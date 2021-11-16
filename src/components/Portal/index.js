import { useRef, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const GET_ELEMENT_BY_ID_LIMIT = 3

const Portal = ({ id, isOpen, className, children }) => {

  const getElementByIdCount = useRef(0)
  const [parentNode, setParentNode] = useState(null)

  useLayoutEffect(() => {
    if (!parentNode && getElementByIdCount.current < GET_ELEMENT_BY_ID_LIMIT) {
      const node = document.getElementById(id)
      setParentNode(node)
      getElementByIdCount.current++
    }
  }, [parentNode, id])

  useLayoutEffect(() => {
    if (parentNode && className) {
      parentNode.className = className
    }
  }, [parentNode, className])

  if (isOpen === false) return null

  return parentNode ? ReactDOM.createPortal(children, parentNode, id) : null
}

Portal.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

Portal.defaultProps = {
  id: 'portal-root',
  isOpen: true,
}

export default Portal
