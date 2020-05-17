import { useEffect, memo } from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import "./styles.css"

const Portal = ({ children, domNodeId }) => {
  const window = document.getElementById(domNodeId)
  const domNode = document.createElement("div")

  useEffect(() => {
    window.appendChild(domNode)
    return () => {
      window.removeChild(domNode)
    }
  }, [])

  return domNode ? ReactDOM.createPortal(children, domNode) : null
}

Portal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  domNodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
}

Portal.defaultProps = {
  domNodeId: "portal-root",
  isOpen: true,
}

export default memo(Portal)
