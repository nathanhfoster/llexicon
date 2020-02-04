import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"

const getInitialState = ({}) => {
  return {}
}

const Template = props => {
  const [state, setState] = useState(getInitialState(props))

  const {} = state

  return <div className="Template Container">Template</div>
}

Template.propTypes = {}

Template.defaultProps = {}

export default memo(Template)
