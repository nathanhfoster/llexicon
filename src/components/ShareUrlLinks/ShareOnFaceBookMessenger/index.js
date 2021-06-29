import React from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';
import { FacebookMessenger } from '../../../images/SVG';

const ShareOnFaceBookMessenger = ({ url, ...restOfProps }) => (
  <ShareUrlLinks
    {...restOfProps}
    href='https://www.facebook.com/dialog/send'
    app_id={583933058891864}
    link={url}
    redirect_uri={`https%3A%2F%2Fecocart.io%2Fshare%2F1d1084`}
    parameterString='app_id, link, redirect_uri'
  >
    <i className='fab fa-facebook-messenger' />
  </ShareUrlLinks>
);

ShareOnFaceBookMessenger.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
};

ShareOnFaceBookMessenger.defaultProps = {
  title: 'Facebook Messenger',
  text: 'Facebook Messenger',
  url: window.location.origin,
};

export default ShareOnFaceBookMessenger;
