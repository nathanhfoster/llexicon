import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { stripHtml } from 'utils'

const mapStateToProps = ({
  Entries: { item },
  router: {
    location: { pathname },
  },
}) => ({ entryDetail: item, pathname })

const HelmetContainer = ({ entryDetail, pathname }) => {
  const title = useMemo(() => {
    let title = 'Astral Tree'
    if (entryDetail?.title) {
      title = entryDetail.title
    }
    return title
  }, [entryDetail, pathname])

  const image = useMemo(() => {
    let image =
      'https://www.seekpng.com/png/full/43-433493_tree-of-life-constellation-icon-icon.png'
    if (entryDetail?.EntryFiles?.length > 0) {
      image = entryDetail.EntryFiles[0].url
    }

    return image
  }, [entryDetail])

  const url = useMemo(() => {
    let url = 'https://www.astraltree.com'

    if (entryDetail) {
      url = document.URL || window.location.href
    }

    return url
  }, [entryDetail])

  const description = useMemo(() => {
    let description = 'Capture the essence of your life with a free online journal and diary app'

    if (entryDetail?.html) {
      description = stripHtml(entryDetail.html).slice(0, 1000)
    }

    return description
  }, [entryDetail])

  const themeColor = useMemo(() => {
    let themeColor = '#29303b'
    return themeColor
  }, [])

  return (
    <Helmet>
      {/* Controlled */}
      <title>{title}</title>
      <meta name='apple-mobile-web-app-title' content={title} />
      <meta name='apple-mobile-web-app-status-bar-style' content={themeColor} />
      <meta name='msapplication-TileColor' content={themeColor} />
      <meta name='theme-color' content={themeColor} />
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content={title} />
      <meta property='og:url' content={url} />
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta
        property='og:image:secure_url'
        content='%PUBLIC_URL%/assets/android-chrome-512x512.png'
      />
      <link rel='canonical' href={url} />
      <link rel='mask-icon' href='%PUBLIC_URL%/assets/safari-pinned-tab.svg' color={themeColor} />

      {/* Uncontrolled */}
      <meta charSet='utf-8' />
      <meta name='google-site-verification' content='DA3iwihIocY8D3JG-RYePClt2-875l4DzElohuFij2Q' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
      />
      <meta property='og:type' content='website' />
      <meta property='og:locale' content='en_US' />
      <meta property='og:locale:alternate' content='fr_EU' />
      <base href='/' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />

      <script src='https://kit.fontawesome.com/d1e21014e5.js' crossorigin='anonymous'></script>
      <script
        type='text/javascript'
        src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDTKkZ7BWNgMkbjmagpiXbWgRHszSZfLHo&libraries=places'
      ></script>
    </Helmet>
  )
}

HelmetContainer.propTypes = { entryDetail: EntryPropTypes }

export default connect(mapStateToProps)(HelmetContainer)
