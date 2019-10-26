import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Container, Row, Col, Image } from "reactstrap";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class PageNotFound extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  render() {
    return (
      <Container className="PageNotFound Container">
        <Row className="pageNotFoundContainer">
          <Col className="pageNotFoundImage" md={4} xs={6}>
            <image src={null} responsive />
          </Col>
          <Col className="pageNotFoundMessage" md={8}>
            <h1>Page Not Found</h1>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PageNotFound);
