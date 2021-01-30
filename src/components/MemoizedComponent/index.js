import React, { memo } from 'react'
import PropTypes from 'prop-types'

export const MemoizedComponent = ({ Component, children, ...componentProps }) =>
  children ? (
    <Component {...componentProps}>{children}</Component>
  ) : (
    <Component {...componentProps} />
  )

MemoizedComponent.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
    PropTypes.symbol,
    PropTypes.object,
    PropTypes.elementType,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
    PropTypes.symbol,
    PropTypes.object,
    PropTypes.elementType,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.arrayOf(PropTypes.symbol),
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.elementType),
  ]),
}

MemoizedComponent.defaultProps = {
  Component: <div>Change This Component Prop</div>,
  children: undefined,
}

export default memo(MemoizedComponent)
