import React, { memo } from "react"
import PropTypes from "prop-types"
import { Progress } from "reactstrap"
import "./styles.css"

const getColor = percentageDone => {
  if (percentageDone === 100) return "success"
  if (percentageDone >= 75) return "info"
  if (percentageDone >= 50) return "warning"
  if (percentageDone <= 25) return "danger"
}

const Loading = ({
  percentageDone,
  progressColor,
  currentIndex,
  dataLength
}) => {
  const percentage = (currentIndex / dataLength) * 100

  return (
    <div>
      <Progress color={getColor(progressColor)} value={new Number(percentageDone)} />
    </div>
  )
}

Loading.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired
}

Loading.defaultProps = { currentIndex: 77, dataLength: 100 }

export default memo(Loading)
