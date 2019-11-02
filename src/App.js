import React, { PureComponent, lazy} from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Redirect } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { setWindow } from "./actions/App"
import { GetUserSettings } from "./actions/Settings"
import "./styles/index.css"
const ReactRouter = lazy(() => import("./ReactRouter"))

const mapStateToProps = ({ User: { id, Settings } }) => ({
  UserId: id,
  Settings
})

const mapDispatchToProps = {
  setWindow,
  GetUserSettings
}

export class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    setWindow: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired,
    Settings: PropTypes.object
  }

  static defaultProps = {
    setWindow,
    GetUserSettings
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { GetUserSettings, UserId } = this.props

    window.addEventListener("resize", this.updateWindowDimensions)
    this.updateWindowDimensions()

    if (UserId) {
      GetUserSettings()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    const {
      setWindow,
      Settings: { show_footer }
    } = this.props
    const {
      innerHeight,
      innerWidth,
      screen: {
        availHeight,
        availLeft,
        availTop,
        availWidth,
        colorDepth,
        height,
        orientation: { angle, onchange, type },
        pixelDepth,
        width
      },
      performance
    } = window

    const isMobile = innerWidth < 768

    const navbarHeight = isMobile
      ? "var(--navBarHeightMobile)"
      : "var(--navBarHeight)"

    const footerHeight = show_footer
      ? "0px"
      : isMobile
      ? "var(--footerHeightMobile)"
      : "var(--footerHeight)"

    setWindow({
      innerHeight,
      innerWidth,
      isMobile,
      navbarHeight,
      footerHeight,
      screen: {
        availHeight,
        availLeft,
        availTop,
        availWidth,
        colorDepth,
        height,
        orientation: { angle, onchange, type },
        pixelDepth,
        width
      },
      performance
    })
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
