import React from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';
import { Twitter } from '../../../images/SVG';

const ShareOnTwitter = props => (
  <ShareUrlLinks
    {...props}
    href='https://twitter.com/intent/tweet'
    parameterString='text'
    dataAction='share/whatsapp/share'
  >
    <i className='fab fa-twitter' />
  </ShareUrlLinks>
);

ShareOnTwitter.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

ShareOnTwitter.defaultProps = {
  title: 'Twitter',
  text: `Check this out: ${window.location.origin}`,
};

export default ShareOnTwitter;
