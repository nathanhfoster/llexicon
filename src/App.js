import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import ReactRouter from "./ReactRouter";
import Footer from "./components/Footer";
import { saveState } from "./store/persist";
import { setWindow } from "./actions/App";
import { GetUserSettings } from "./actions/Settings";
import "./styles/index.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { setWindow, GetUserSettings, saveState };

export class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    User: PropTypes.objectOf(PropTypes.any),
    setWindow: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired
  };

  static defaultProps = {
    setWindow,
    GetUserSettings,
    saveState
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { User, GetUserSettings } = this.props;
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();

    if (User.token) GetUserSettings(User.token, User.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { saveState } = props;
    saveState();
    this.setState({});
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const { setWindow } = this.props;
    const { innerHeight, innerWidth } = window;
    const isMobile = innerWidth < 768;
    setWindow({ innerHeight, innerWidth, isMobile });
    this.setState({ height: innerHeight, width: innerWidth, isMobile });
  };

  render() {
    const { history } = this.props;
    const { pathname } = history.location;
    return pathname === "/" ? (
      <Redirect to="/home" />
    ) : (
      <div className="App">
        <NavBar />
        <ReactRouter />
        <Footer />
      </div>
    );
  }
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(App)
);
