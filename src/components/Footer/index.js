import React, { memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
import { RouteMap } from "../../routes"
import "./styles.css"
// Must be the same number as the one in the /public/version.txt file
export const LATEST_APP_VERSION = 1.001

const Footer = () => (
  <Container fluid tag="footer" className="MainFooter">
    <Row>
      <Col xs={12}>
        <Link to="/privacy-policy">
          <i className="fas fa-user-secret" /> Privacy policy
        </Link>
      </Col>
    </Row>
    <Row className="Center">
      <Col xs={12}>App Version: {LATEST_APP_VERSION}</Col>
    </Row>
    <Row className="Center">
      <Col xs={12}>&copy; {new Date().getFullYear()} Nathan Foster</Col>
    </Row>
  </Container>
)

Footer.propTypes = {}

export default memo(Footer)
