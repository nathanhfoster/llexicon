import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { Progress } from "reactstrap"
import "./styles.css"

const colors = ["success", "info", "warning", "danger"]

const getColor = (percentage) => {
  if (percentage >= 90) return colors[3]
  if (percentage >= 75) return colors[2]
  if (percentage >= 50) return colors[1]
  if (percentage >= 25) return colors[0]

  return colors[3]
}

const getPercentageDone = (numerator, denominator) =>
  Number((numerator / denominator) * 100).toFixed(2)

const BasicProgress = ({ label, showPercentage, bars, ...restOfProps }) => {
  const percentage = getPercentageDone(restOfProps.value, restOfProps.max)
  const color = getColor(percentage)

  const renderLabel = !label || showPercentage ? `${percentage}%` : null

  const renderBars = bars.map(({ value, label, showPercentage }, i) => {
    const percentage = getPercentageDone(value, restOfProps.max)
    const color = getColor(percentage)

    const renderLabel = showPercentage ? `${label} ${percentage}%` : label

    return (
      <Progress bar color={colors[(i + 1) % colors.length]} value={value}>
        {renderLabel}
      </Progress>
    )
  })

  const shouldRenderMultipleBars = bars && bars.length > 0

  return (
    <Fragment>
      {label && <div className="text-center">{label}</div>}
      {shouldRenderMultipleBars ? (
        <Progress multi>{renderBars}</Progress>
      ) : (
        <Progress color={color} {...restOfProps}>
          {renderLabel}
        </Progress>
      )}
    </Fragment>
  )
}

BasicProgress.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showPercentage: PropTypes.bool,
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      showPercentage: PropTypes.bool,
    })
  ),

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

BasicProgress.defaultProps = { className: `BasicProgress`, bars: [] }

export default memo(BasicProgress)
