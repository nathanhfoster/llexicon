import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

const getInitialState = ({}) => {
  return {}
}

const Template = props => {
  const [state, setState] = useState(getInitialState(props))

  const {} = state

  return (
    <Container className="Template Container">
      <Row>
        <Col xs={12}>Template</Col>
      </Row>
    </Container>
  )
}

Template.propTypes = {}

Template.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Template)
