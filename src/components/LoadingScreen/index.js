import React, { PureComponent } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import "./styles.css";

class LoadingScreen extends PureComponent {
  render() {
    return (
      <Container fluid className="LoadingScreen Container">
        <Row>
          <Col xs={12}>
            <Media src="https://s3.us-east-2.amazonaws.com/esl-images/logos/Radius.png" />
            Loading...
          </Col>
        </Row>
      </Container>
    );
  }
}
export default LoadingScreen;