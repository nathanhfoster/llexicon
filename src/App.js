import { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { SetWindow, SetAppVersion } from "./actions/App"
import { WatchUserLocation } from "./actions/User"
import { GetUserSettings } from "./actions/Settings"

const mapStateToProps = ({ User: { id } }) => ({
  UserId: id
})

const mapDispatchToProps = {
  SetWindow,
  WatchUserLocation,
  GetUserSettings,
  SetAppVersion
}

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.watchId = null
    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    SetWindow: PropTypes.func.isRequired,
    WatchUserLocation: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired
  }

  static defaultProps = {
    SetWindow,
    GetUserSettings
  }

  componentDidMount() {
    const {
      WatchUserLocation,
      GetUserSettings,
      UserId,
      SetAppVersion
    } = this.props

    SetAppVersion()

    // this.watchId = WatchUserLocation()

    window.addEventListener("resize", this.updateWindowDimensions)

    this.updateWindowDimensions()

    if (UserId) {
      GetUserSettings()
    }
  }

  componentWillUnmount() {
    const { WatchUserLocation } = this.props

    // WatchUserLocation(this.watchId)

    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    const { SetWindow } = this.props
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
    SetWindow({
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
      navBarHeight: isMobile ? 64 : 68,
      footerHeight: isMobile ? 52 : 70,
      isInStandalone: matchMedia("(display-mode: standalone)").matches,
      isOnMobileBrowser: this.isOnMobileBrowser(window.navigator.userAgent)
    })
  }

  isOnMobileBrowser = userAgent =>
    /iPhone|iPad|iPod|Android|Windows/i.test(userAgent)

  render() {
    return null
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
