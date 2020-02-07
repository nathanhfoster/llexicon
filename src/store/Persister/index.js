import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveReduxState } from "./persist"
import UseDebounce from "../../components/UseDebounce"

const mapStateToProps = ({ Persister: { _lastUpdated } }) => ({ _lastUpdated })

const mapDispatchToProps = { saveReduxState }

const Persister = ({ saveReduxState, _lastUpdated }) => (
  <UseDebounce
    onChangeCallback={saveReduxState}
    value={_lastUpdated}
    delay={1600}
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
