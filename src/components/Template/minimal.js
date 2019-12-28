import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import "./styles.css"

class Template extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

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
export default Template
åç