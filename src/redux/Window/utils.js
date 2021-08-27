import { isAFunction } from 'utils'

export const isOnMobileBrowser = userAgent => /iPhone|iPad|iPod|Android|Windows/i.test(userAgent)

export const getConnectionProps = ({ downlink, effectiveType, onchange, rtt, saveDate }) => ({
  downlink,
  effectiveType,
  onchange,
  rtt,
  saveDate,
})

const getScreenProps = ({
  availHeight,
  availLeft,
  availTop,
  availWidth,
  colorDepth,
  height,
  // orientation: { angle, onchange, type },
  pixelDepth,
  width,
}) => ({
  availHeight,
  availLeft,
  availTop,
  availWidth,
  colorDepth,
  height,
  // orientation: { angle, onchange, type },
  pixelDepth,
  width,
})

export const getNavigatorProps = ({
  appCodeName,
  appName,
  appVersion,
  bluetooth,
  clipboard,
  connection,
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
  serviceWorker,
  storage,
  usb,
  // userActivation: { hasBeenActive, isActive },
  userAgent,
  vendor,
  vendorSub,
}) => ({
  appCodeName,
  appName,
  appVersion,
  bluetooth,
  clipboard,
  connection: connection ? getConnectionProps(connection) : {},
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
  serviceWorker,
  storage,
  usb,

  userAgent,
  vendor,
  vendorSub,
})

export const getWindowDimensions = () => {
  const isClient = typeof window === 'object'
  if (!isClient) return {}
  const { innerHeight, innerWidth, screen, matchMedia, navigator, performance } = window

  const isMobile = innerWidth < 768

  return {
    innerHeight,
    innerWidth,
    screen: screen ? getScreenProps(screen) : {},
    matchMedia,
    navigator: navigator ? getNavigatorProps(navigator) : {},
    performance,
    isMobile,
    // navBarHeight: isMobile ? 64 : 68,
    navBarHeight: 64,
    isInStandalone: isAFunction(matchMedia) && matchMedia('(display-mode: standalone)').matches,
    isOnMobileBrowser: isOnMobileBrowser(window.navigator.userAgent),
  }
}
