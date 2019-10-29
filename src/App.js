import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Redirect } from "react-router-dom"
import NavBar from "./components/NavBar"
import ReactRouter from "./ReactRouter"
import Footer from "./components/Footer"
import { setWindow } from "./actions/App"
import { GetUserSettings } from "./actions/Settings"
import { SyncEntries } from "./actions/Entries"
import "./styles/index.css"

const mapStateToProps = ({ User }) => ({ UserId: User.id })

const mapDispatchToProps = {
  setWindow,
  GetUserSettings,
  SyncEntries
}

export class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.string,
    setWindow: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired
  }

  static defaultProps = {
    setWindow,
    GetUserSettings
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { GetUserSettings, UserId, SyncEntries } = this.props

    window.addEventListener("resize", this.updateWindowDimensions)
    this.updateWindowDimensions()

    if (UserId) {
      GetUserSettings()
      SyncEntries()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  componentWillUnmount() {
    const { UserId, SyncEntries } = this.props

    if (UserId) {
      SyncEntries()
    }

    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    const { setWindow } = this.props
    const { innerHeight, innerWidth } = window
    const isMobile = innerWidth < 768
    setWindow({ innerHeight, innerWidth, isMobile })
    this.setState({ height: innerHeight, width: innerWidth, isMobile })
  }

  render() {
    const { history } = this.props
    const { pathname } = history.location
    return pathname === "/" ? (
      <Redirect to="/home" />
    ) : (
      <div className="App">
        <NavBar />
        <ReactRouter />
        <Footer />
      </div>
    )
  }
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(App)
)
