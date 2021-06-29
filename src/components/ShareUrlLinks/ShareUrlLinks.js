import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { getShareUrlParameters } from './utils';
import { omit } from '../../utils';

const ShareUrlLinks = ({
  href,
  parameterString,
  children,
  onClick,
  dataAction,
  ...restOfProps
}) => {
  const handleOnClick = e => {
    e.stopPropagation();
    if (onClick instanceof Function) {
      onClick(e);
    }
  };

  const [hrefWithParameters, buttonProps] = useMemo(() => {
    // Remove empty extra spaces and split
    const params = parameterString.replace(/\s+/g, '').trim().split(',');

    const parameters = getShareUrlParameters(restOfProps, params);
    const newHref = href ? `${href}?${parameters}` : '';

    // Omit the paramter props
    const buttonProps = omit(restOfProps, params);

    return [newHref, buttonProps];
  }, [href, parameterString]);

  return (
    <Button
      {...buttonProps}
      href={hrefWithParameters}
      onClick={handleOnClick}
      title={restOfProps.title}
      data-action={dataAction}
    >
      {children}
    </Button>
  );
};

ShareUrlLinks.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  href: PropTypes.string,
  active: PropTypes.bool,
  block: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'lg']),
  disabled: PropTypes.bool,
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'dark',
    'light',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-dark',
    'outline-light',
  ]),
  isButton: PropTypes.bool,
  children: PropTypes.node,
};

ShareUrlLinks.defaultProps = {
  target: '_blank',
  url: window.location.origin,
  type: 'button',
  variant: 'link',
  parameterString: '',
};

export default memo(ShareUrlLinks);
