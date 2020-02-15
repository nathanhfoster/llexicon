import { useEffect } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { SetWindow, SetAppVersion } from "./redux/App/actions"
import { GetUserSettings } from "./redux/User/actions"
import { SetCalendar } from "./redux/Calendar/Calendar"
import {
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
} from "./redux/Entries/actions"

const FIFTEEN_MINUTES = 1000 * 60 * 15

const mapStateToProps = ({ User: { id } }) => ({
  UserId: id
})

const mapDispatchToProps = {
  SetWindow,
  GetUserSettings,
  SetAppVersion,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
}

const App = ({
  GetUserSettings,
  UserId,
  SetAppVersion,
  SetWindow,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
}) => {
  useEffect(() => {
    const activeDate = new Date()

    SetCalendar({ activeDate })

    SetAppVersion()

    setInterval(() => SetAppVersion(), FIFTEEN_MINUTES)

    const handleResize = () => SetWindow(getWindowDimensions())

    window.addEventListener("resize", handleResize)

    handleResize()

    if (UserId) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))))
      GetUserSettings()
      GetUserEntryTags()
    }

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isOnMobileBrowser = userAgent =>
    /iPhone|iPad|iPod|Android|Windows/i.test(userAgent)

  const getWindowDimensions = () => {
    const isClient = typeof window === "object"
    if (!isClient) return undefined
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

    return {
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
      isOnMobileBrowser: isOnMobileBrowser(window.navigator.userAgent)
    }
  }

  return null
}

App.propTypes = {
  UserId: PropTypes.number,
  SetWindow: PropTypes.func.isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
