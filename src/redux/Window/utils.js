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

export { isOnMobileBrowser, getWindowDimensions }
