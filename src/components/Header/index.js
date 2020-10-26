import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Header = ({ children, className, fill, color, center, ...restOfProps }) => {
  const styles = useMemo(
    () => ({
      backgroundColor: fill,
      color,
      ...restOfProps,
    }),
    [color, fill, restOfProps],
  )

  const cName = useMemo(() => {
    let name = 'Header'

    if (center) {
      name += ` Center`
    }

    if (className) {
      name += ` ${className}`
    }

    return name
  }, [])

  return (
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
}

Header.defaultProps = {
  children: <h1>Header</h1>,
  className: 'Header',
  fill: '',
  color: 'var(--secondaryColor)',
  fontSize: '2em',
  center: true,
}

export default memo(Header)
