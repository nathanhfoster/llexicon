import React, { useMemo } from "react"
import { connect as reduxConnect } from "react-redux"
import { Helmet } from "react-helmet"
import { EntryPropTypes } from "redux/Entries/propTypes"
import { stripHtml } from "utils"

const mapStateToProps = ({ Entries: { item } }) => ({ entryDetail: item })

const HelmetContainer = ({ entryDetail }) => {
  const title = useMemo(() => {
    let title = "Astral Tree"
    if (entryDetail?.title) {
      title = entryDetail.title
    }
    return title
  }, [entryDetail])

  const image = useMemo(() => {
    let image =
      "https://www.seekpng.com/png/full/43-433493_tree-of-life-constellation-icon-icon.png"
    if (entryDetail?.EntryFiles.length > 0) {
      image = entryDetail.EntryFiles[0].url
    }

    return image
  }, [entryDetail])

  const url = useMemo(() => {
    let url = "https://www.astraltree.com"

    if (entryDetail) {
      url = document.URL || window.location.href
    }

    return url
  }, [entryDetail])

  const description = useMemo(() => {
    let description =
      "Capture the essence of your life with a free online journal and diary app"

    if (entryDetail?.html) {
      description = stripHtml(entryDetail.html).slice(0, 1000)
    }

    return description
  }, [entryDetail])

  const themeColor = useMemo(() => {
    let themeColor = "#29303b"
    return themeColor
  }, [])

  return (
    <Helmet>
      {/* Controlled */}
      <title>{title}</title>
      <meta name="apple-mobile-web-app-title" content={title} />
      <meta name="apple-mobile-web-app-status-bar-style" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="theme-color" content={themeColor} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={url} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta
        property="og:image:secure_url"
        content="%PUBLIC_URL%/assets/android-chrome-512x512.png"
      />
      <link rel="canonical" href={url} />
      <link
        rel="mask-icon"
        href="%PUBLIC_URL%/assets/safari-pinned-tab.svg"
        color={themeColor}
      />

      {/* Uncontrolled */}
      <meta charSet="utf-8" />
      <meta
        name="google-site-verification"
        content="DA3iwihIocY8D3JG-RYePClt2-875l4DzElohuFij2Q"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_EU" />
      <base href="/" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      <link rel="shortcut icon" href="%PUBLIC_URL%/assets/favicon.ico?v=2" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        href="%PUBLIC_URL%/assets/apple-touch-icon.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="%PUBLIC_URL%/assets/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="%PUBLIC_URL%/assets/favicon-16x16.png"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900|Varela+Round&display=swap"
        rel="stylesheet"
      />
      {/* <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"
      integrity=""
      crossorigin="anonymous"
    />  */}
      <script
        src="https://kit.fontawesome.com/d1e21014e5.js"
        crossorigin="anonymous"
      ></script>
      {/* <script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find"></script> */}
      <script
        type="text/javascript"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDTKkZ7BWNgMkbjmagpiXbWgRHszSZfLHo&libraries=places"
      ></script>
    </Helmet>
  )
}

HelmetContainer.propTypes = { entryDetail: EntryPropTypes }

export default reduxConnect(mapStateToProps)(HelmetContainer)
