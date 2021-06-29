import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';

const ShareOnEmail = ({ recipients, ...restOfProps }) => {
  const to = useMemo(() => {
    if (Array.isArray(recipients)) {
      return recipients.reduce((acc, r, i) => {
        const hasNextRecipient = recipients.length - i > 0;
        acc += `${r}${hasNextRecipient ? ',' : ''}`;
        return acc;
      }, '');
    }

    return recipients;
  }, [recipients]);

  return (
    <ShareUrlLinks {...restOfProps} href={`mailto:${to}`} parameterString='subject, body'>
      <i className='fas fa-envelope' />
    </ShareUrlLinks>
  );
};

ShareOnEmail.propTypes = {
  title: PropTypes.string,
  recipients: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  subject: PropTypes.string,
  body: PropTypes.string,
};

ShareOnEmail.defaultProps = { title: 'Email', recipients: '' };

export default ShareOnEmail;
