import React, { memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
import { RouteMap } from "../../routes"
import "./styles.css"

const mapStateToProps = ({ App: { version } }) => ({ version })

const Footer = ({ version }) => (
  <Container fluid tag="footer" className="MainFooter">
    <Row>
      <Col xs={12}>
        <Link to="/privacy-policy">
          <i className="fas fa-user-secret" /> Privacy policy
        </Link>
      </Col>
    </Row>
    <Row className="Center">
      <Col xs={12}>App Version: {version}</Col>
    </Row>
    <Row className="Center">
      <Col xs={12}>&copy; {new Date().getFullYear()} Nathan Foster</Col>
    </Row>
  </Container>
)

Footer.propTypes = { version: PropTypes.number.isRequired }

export default reduxConnect(mapStateToProps)(Footer)
