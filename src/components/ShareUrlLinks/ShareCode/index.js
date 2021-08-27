import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ShareUrlLinks from '../ShareUrlLinks';
import { isAFunction } from 'utils';

const ShareCode = ({ isOpen, showButton, value, onClick, ...restOfProps }) => {
  const handleOnShareButtonClick = useCallback(() => {
    if (isAFunction(onClick)) {
      onClick();
    }
  }, [onClick]);

  return (
    <ShareUrlLinks {...restOfProps} onClick={handleOnShareButtonClick}>
      <i className='fas fa-code' />
    </ShareUrlLinks>
  );
};

ShareCode.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  showButton: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

ShareCode.defaultProps = { title: 'Code', isOpen: undefined, showButton: false };

export default ShareCode;
