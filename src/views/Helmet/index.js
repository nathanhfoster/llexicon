import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { EntryPropTypes } from 'redux/Entries/propTypes';
import { stripHtml } from 'utils';

const mapStateToProps = ({ Entries: { item } }) => ({ entryDetail: item });

const HelmetContainer = ({ entryDetail }) => {
  const { pathname } = useLocation();
  const title = useMemo(() => {
    let title = 'Astral Tree';
    if (pathname.includes('/entry/') && entryDetail?.title) {
      title = entryDetail.title;
    }
    return title;
  }, [entryDetail, pathname]);

  const image = useMemo(() => {
    let image =
      'https://www.seekpng.com/png/full/43-433493_tree-of-life-constellation-icon-icon.png';
    if (entryDetail?.EntryFiles?.length > 0) {
      image = entryDetail.EntryFiles[0].url;
    }

    return image;
  }, [entryDetail]);

  const url = useMemo(() => {
    let url = 'https://www.astraltree.com';

    if (entryDetail) {
      url = document.URL || window.location.href;
    }

    return url;
  }, [entryDetail]);

  const description = useMemo(() => {
    let description =
      'Capture the essence of your life with a free online journal and diary app';

    if (entryDetail?.html) {
      description = stripHtml(entryDetail.html).slice(0, 1000);
    }

    return description;
  }, [entryDetail]);

  const themeColor = useMemo(() => {
    let themeColor = '#29303b';
    return themeColor;
  }, []);

  return (
    <Helmet>
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
      <link
        rel='mask-icon'
        href='%PUBLIC_URL%/assets/safari-pinned-tab.svg'
        color={themeColor}
      />
    </Helmet>
  );
};

HelmetContainer.propTypes = { entryDetail: EntryPropTypes };

export default connect(mapStateToProps)(HelmetContainer);
