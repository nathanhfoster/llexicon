import React from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';

const ShareWhatsApp = props => (
  <ShareUrlLinks
    {...props}
    href='https://api.whatsapp.com/send/'
    phone=''
    app_absent='0'
    parameterString='phone, text, app_absent'
  >
    <i className='fab fa-whatsapp' />
  </ShareUrlLinks>
);

ShareWhatsApp.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

ShareWhatsApp.defaultProps = {
  title: 'WhatsApp',
  text: `Check this out: ${window.location.origin}`,
};

export default ShareWhatsApp;
