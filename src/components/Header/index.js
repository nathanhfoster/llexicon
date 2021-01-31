import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

export const Header = ({ children, className, fill, color, center, href, ...restOfProps }) => {
  const styles = useMemo(() => {
    const defaultColor = color || !href ? 'var(--secondaryColor)' : ''
    return {
      backgroundColor: fill,
      color: defaultColor,
      ...restOfProps,
    }
  }, [color, fill, href, restOfProps])

  const cName = useMemo(() => {
    let name = 'Header'

    if (center) {
      name += ` Center`
    }

    if (className) {
      name += ` ${className}`
    }

    return name
  }, [center, className])

  return href ? (
    <a className={cName} style={styles} href={href}>
      {children}
    </a>
  ) : (
    <div className={cName} style={styles}>
      {children}
    </div>
  )
}
Header.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string.isRequired,
  fill: PropTypes.string,
  color: PropTypes.string.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  center: PropTypes.bool,
  href: PropTypes.string,
}

Header.defaultProps = {
  children: <h1>Header</h1>,
  className: 'Header',
  fill: '',
  fontSize: '2em',
  center: true,
}

export default memo(Header)
