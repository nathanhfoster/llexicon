import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import { RouteMap } from "../ReactRouter/Routes"
import "./styles.css"

const mapStateToProps = ({ User }) => ({
  isOpen: User.Settings.show_footer,
  shouldRenderSettingsLink: User.token ? true : false
})

const Footer = ({ isOpen, shouldRenderSettingsLink }) => 
  (
    <Collapse
      tag="footer"
      className="MainFooter"
      isOpen={isOpen}
      // onEntering={setStatus("Opening")}
      // onEntered={setStatus("Opened")}
      // onExiting={setStatus("Closing")}
      // onExited={setStatus("Closed")}
    >
      <div>&copy; {new Date().getFullYear()} Nathan Foster</div>
      <div>
        <Link to="/privacy-policy">
          <i className="fas fa-user-secret" /> Privacy policy
        </Link>
        {shouldRenderSettingsLink && (
          <Link to={RouteMap.SETTINGS}>
            <i className="fas fa-cog" /> Remove footer
          </Link>
        )}
      </div>
    </Collapse>
  )

Footer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  shouldRenderSettingsLink: PropTypes.bool.isRequired
}

export default reduxConnect(mapStateToProps)(Footer)
