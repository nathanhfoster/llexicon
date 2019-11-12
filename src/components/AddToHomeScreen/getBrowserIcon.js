import React from "react"

const getBrowserIcon = (isOnMobileBrowser, browserUserAgent) => {
  if (!isOnMobileBrowser) {
    if (browserUserAgent.includes("Chrome")) {
      return <i className="fab fa-chrome" />
    }
    if (browserUserAgent.includes("Firefox")) {
      return <i className="fab fa-firefox" />
    }
    if (browserUserAgent.includes("Safari")) {
      return <i className="fab fa-safari" />
    }
    if (browserUserAgent.includes("Edge")) {
      return <i className="fab fa-edge" />
    }
    if (browserUserAgent.includes("Explorer")) {
      return <i className="fab fa-internet-explorer" />
    }
  } else {
    if (browserUserAgent.includes("Android")) {
      return <i className="fab fa-android" />
    }
    if (browserUserAgent.includes("Android")) {
      return <i className="fab fa-android" />
    }
    if (browserUserAgent.includes("iP")) {
      return <i className="fab fa-apple" />
    }
    if (browserUserAgent.includes("Windows")) {
      return <i className="fab fa-windows" />
    }
  }
  return <div>No Browser detected</div>
}

export default getBrowserIcon
