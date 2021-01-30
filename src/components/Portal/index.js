import { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import "./styles.css"

export const Portal = ({ id, isOpen, className, children }) => {
  let parentNode = useMemo(() => document.getElementById(id), [id])

  const cachedChildren = useMemo(() => {
    let childrenNodes = []

    // while (parentNode.firstChild) {
    //   childrenNodes.push(parentNode.firstChild)
    //   parentNode.removeChild(parentNode.firstChild)
    // }
    return childrenNodes
  }, [parentNode])

  let portal = useMemo(() => {
    if (parentNode) {
      if (className) {
        parentNode.className = className
      }
    }
    return parentNode
  }, [parentNode, className])



  return portal ? ReactDOM.createPortal(children, portal, id) : null
}

Portal.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
}

Portal.defaultProps = {
  id: "portal-root",
  isOpen: true,
}

export default Portal
