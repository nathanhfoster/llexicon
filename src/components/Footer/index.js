import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Collapse } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import "./styles.css";
import "./stylesM.css";

const mapStateToProps = ({ User, Window }) => ({
  User,
  Window
});

const mapDispatchToProps = {};

class Footer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shouldShow: false,
      status: "Closed"
    };
  }

  static propTypes = {
    shouldShow: PropTypes.bool,
    Settings: PropTypes.object
  };

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

  setStatus = status => this.setState({ status });

  render() {
    const { User, history, location, match, isMobile } = this.props;
    const { Settings } = User;
    const { show_footer } = Settings;
    const { pathname } = location;
    const { status } = this.state;
    return (
      show_footer && (
        <Collapse
          className="MainFooter"
          isOpen={show_footer}
          onEntering={this.setStatus("Opening")}
          onEntered={this.setStatus("Opened")}
          onExiting={this.setStatus("Closing")}
          onExited={this.setStatus("Closed")}
        >
          <footer>
            <div>&copy; {new Date().getFullYear()} Nathan Foster</div>
            <div>
              <Link to="/privacy-policy">
                <i className="fas fa-user-secret" /> Privacy policy
              </Link>
              {User.token && (
                <Link to="/settings">
                  <i className="fas fa-cog" /> Remove footer
                </Link>
              )}
            </div>
          </footer>
        </Collapse>
      )
    );
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)
);
