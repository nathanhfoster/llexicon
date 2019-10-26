import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, FormGroup, Label, Input, Tooltip } from "reactstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import { GetUserSettings, PostSettings, SetSettings } from "../../actions/Settings";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { GetUserSettings, PostSettings, SetSettings };

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { ShowFooterTooltip: false, ShowPushMessagesTooltip: false };
  }

  static propTypes = {
    Settings: PropTypes.object,
    ShowFooterTooltip: PropTypes.bool,
    ShowPushMessagesTooltip: PropTypes.bool,
    GetUserSettings: PropTypes.func.isRequired,
    PostSettings: PropTypes.func.isRequired,
    SetSettings: PropTypes.func.isRequired
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { User, GetUserSettings } = this.props;
    if (User.token) GetUserSettings(User.token, User.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User } = props;
    this.setState({ User });
  };

  toggleTooltip = e => this.setState({ [e.target.id]: !this.state[e.target.id] });

  render() {
    const { PostSettings, SetSettings } = this.props;
    const { User, ShowFooterTooltip, ShowPushMessagesTooltip } = this.state;
    const { Settings } = User;
    const { show_footer, push_messages } = Settings;
    return (
      <Container className="Settings Container">
        <Row>
          <h1 className="pageHeader">SETTINGS</h1>
        </Row>
        <Row>
          <h2 className="headerBanner">Appearance</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  disabled={!User.id}
                  checked={show_footer}
                  onClick={() =>
                    !Settings.id
                      ? PostSettings(User.token, {
                          user: User.id,
                          show_footer: !show_footer
                        })
                      : SetSettings(User.token, Settings.id, {
                          show_footer: !show_footer
                        })
                  }
                />
                <span className="checkBoxText" id="ShowFooterTooltip">
                  Show footer
                </span>
                <Tooltip
                  placement="right"
                  isOpen={ShowFooterTooltip}
                  target="ShowFooterTooltip"
                  toggle={this.toggleTooltip}
                >
                  Toggles the view of the footer
                </Tooltip>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  disabled={!User.id}
                  checked={push_messages}
                  onClick={() =>
                    !Settings.id
                      ? PostSettings(User.token, {
                          user: User.id,
                          push_messages: !push_messages
                        })
                      : SetSettings(User.token, Settings.id, {
                          push_messages: !push_messages
                        })
                  }
                />
                <span className="checkBoxText" id="ShowPushMessagesTooltip">
                  Push messages
                </span>
                <Tooltip
                  placement="right"
                  isOpen={ShowPushMessagesTooltip}
                  target="ShowPushMessagesTooltip"
                  toggle={this.toggleTooltip}
                >
                  Toggles frequent fetches of messages
                </Tooltip>
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings);
