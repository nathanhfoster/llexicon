import { useEffect } from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import "./styles.css"

const Portal = ({ children, domNodeId }) => {
  const modalRoot = document.getElementById(domNodeId)
  const domNode = document.createElement("div")

  useEffect(() => {
    modalRoot.appendChild(domNode)
  }, [])

  useEffect(() => {
    return () => {
     setTimeout(() => modalRoot && modalRoot.removeChild(domNode), 200)
    }
  })

  return ReactDOM.createPortal(children, domNode)
}

Portal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  domNodeId: PropTypes.string.isRequired,
}

Portal.defaultProps = {
  domNodeId: "portal-root",
}

export default Portal
