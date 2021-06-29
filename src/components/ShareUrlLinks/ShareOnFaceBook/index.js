import React from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';
import { Facebook } from '../../../images/SVG';

const ShareOnFacebook = ({ url, ...restOfProps }) => (
  <ShareUrlLinks
    {...restOfProps}
    href={`https://www.facebook.com/sharer/sharer.php`}
    u={url}
    parameterString='u'
  >
    <i className='fab fa-facebook-f' />
  </ShareUrlLinks>
);

ShareOnFacebook.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
};

ShareOnFacebook.defaultProps = { title: 'Facebook', text: 'Facebook', url: window.location.origin };

export default ShareOnFacebook;
