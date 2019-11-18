import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { setWindow } from "./actions/App"
import { GetUserSettings } from "./actions/Settings"
import "./styles/index.css"

const mapStateToProps = ({ User: { id } }) => ({
  UserId: id
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
    GetUserSettings: PropTypes.func.isRequired
  }

  static defaultProps = {
    setWindow,
    GetUserSettings
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {
    const { GetUserSettings, UserId } = this.props

    window.addEventListener("resize", this.updateWindowDimensions)
    this.updateWindowDimensions()

    if (UserId) {
      GetUserSettings()
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    const { setWindow } = this.props
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
        // orientation: { angle, onchange, type },
        pixelDepth,
        width
      },
      matchMedia,
      navigator: {
        appCodeName,
        appName,
        appVersion,
        bluetooth,
        clipboard,
        // connection: {
        //   downlink,
        //   effectiveType,
        //   // onchange,
        //   rtt,
        //   saveDate
        // },
        cookieEnabled,
        credentials,
        deviceMemory,
        doNotTrack,
        geolocation,
        hardwareConcurrency,
        keyboard,
        language,
        languages,
        locks,
        maxTouchPoints,
        mediaCapabilities,
        // mediaDevices: { ondevicechange },
        // mediaSession: { metadata, playbackState },
        mimeTypes,
        onLine,
        permissions,
        platform,
        plugins,
        // presentation: { defaultRequest, receiver },
        product,
        productSub,
        // serviceWorker: { controller, oncontrollerchange, onmessage },
        storage,
        usb,
        // userActivation: { hasBeenActive, isActive },
        userAgent,
        vendor,
        vendorSub
      },
      performance
    } = window
    const isMobile = innerWidth < 768
    setWindow({
      innerHeight,
      innerWidth,
      screen: {
        availHeight,
        availLeft,
        availTop,
        availWidth,
        colorDepth,
        height,
        // orientation: { angle, onchange, type },
        pixelDepth,
        width
      },
      matchMedia,
      navigator: {
        appCodeName,
        appName,
        appVersion,
        bluetooth,
        clipboard,
        // connection: {
        //   downlink,
        //   effectiveType,
        //   // onchange,
        //   rtt,
        //   saveDate
        // },
        cookieEnabled,
        credentials,
        deviceMemory,
        doNotTrack,
        geolocation,
        hardwareConcurrency,
        keyboard,
        language,
        languages,
        locks,
        maxTouchPoints,
        mediaCapabilities,
        // mediaDevices: { ondevicechange },
        // mediaSession: { metadata, playbackState },
        mimeTypes,
        onLine,
        permissions,
        platform,
        plugins,
        // presentation: { defaultRequest, receiver },
        product,
        productSub,
        // serviceWorker: { controller, oncontrollerchange, onmessage },
        storage,
        usb,
        // userActivation: { hasBeenActive, isActive },
        userAgent,
        vendor,
        vendorSub
      },
      performance,
      isMobile,
      navBarHeight: isMobile ? 46 : 68,
      footerHeight: isMobile ? 52 : 70,
      isInStandalone: matchMedia("(display-mode: standalone)").matches,
      isOnMobileBrowser: this.isOnMobileBrowser(window.navigator.userAgent)
    })
  }

  isOnMobileBrowser = userAgent =>
    /iPhone|iPad|iPod|Android|Windows/i.test(userAgent)

  render() {
    return <noscript />
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
