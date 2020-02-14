import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveReduxState } from "./persist"
import { UseDebounce } from "../../components"

const mapStateToProps = ({ Persister: { _lastUpdated, shouldDelay } }) => ({
  _lastUpdated,
  shouldDelay
})

const mapDispatchToProps = { saveReduxState }

const Persister = ({ saveReduxState, _lastUpdated, shouldDelay }) => (
  <UseDebounce
    onChangeCallback={saveReduxState}
    value={_lastUpdated}
    delay={shouldDelay ? 1600 : 0}
  />
)

Persister.propTypes = {
  saveReduxState: PropTypes.func.isRequired,
  _lastUpdated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persister)
