import React, { memo } from 'react'
import PropTypes from 'prop-types'

export const MetaTags = ({ title, siteName, url, description, image }) => (
  <html lang='en'>
    <head>
      <meta property='og:type' content='website' />
      <meta property='og:locale' content='en_US' />
      <meta property='og:locale:alternate' content='fr_EU' />

      <meta property='og:title' content={title} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:url' content={url} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
    </head>
  </html>
)

MetaTags.propTypes = {
  title: PropTypes.string,
  siteName: PropTypes.string,
  url: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
}

MetaTags.defaultProps = {
  title: 'Astral Tree',
  siteName: 'Astral Tree',
  url: 'https://www.astraltree.com',
  description:
    'Capture the essence of your life with a free online journal and diary app',
  image:
    'https://www.seekpng.com/png/full/43-433493_tree-of-life-constellation-icon-icon.png',
}

export default memo(MetaTags)
