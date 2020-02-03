import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class Template extends PureComponent {
  constructor(props) {
    super(props)

    // Identify props that can change from outsite and within the component and map them to state
    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    // Identify which properties have changed and compare them to the previous state
    // If there was a change return a new state object
    // Otherwise return null which means there was no state change
    return nextProps
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  render() {
    return (
      <Container className="Template Container">
        <Row>
          <Col xs={12}>Template</Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Template))
