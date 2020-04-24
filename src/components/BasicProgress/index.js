import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { Progress } from "reactstrap"
import "./styles.css"

const getColor = (percentageDone) => {
  if (percentageDone === 100) return "success"
  if (percentageDone >= 75) return "info"
  if (percentageDone >= 50) return "warning"
  if (percentageDone <= 25) return "danger"
}

const BasicProgress = ({ title, showPercentage, ...restOfProps }) => {
  const percentageDone = Number(
    (restOfProps.value / restOfProps.max) * 100
  ).toFixed(2)
  const color = getColor(percentageDone)

  return (
    <Fragment>
      {title && <div className="text-center">{title}</div>}
      {(!title || showPercentage) && (
        <div className="text-center">{percentageDone}</div>
      )}
      <Progress {...restOfProps} color={color} />
    </Fragment>
  )
}

BasicProgress.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showPercentage: PropTypes.bool,

  bar: PropTypes.bool,
  multi: PropTypes.bool,
  tag: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  animated: PropTypes.bool,
  striped: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  barClassName: PropTypes.string,
}

BasicProgress.defaultProps = { currentIndex: 77, dataLength: 100 }

export default memo(BasicProgress)
