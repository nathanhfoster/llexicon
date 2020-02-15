import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveReduxState } from "../../redux/Persister/actions"
import { UseDebounce } from "../../components"

const mapStateToProps = ({ Persister: { lastUpdated, shouldDelay } }) => ({
  lastUpdated,
  shouldDelay
})

const mapDispatchToProps = { saveReduxState }

const Persister = ({ saveReduxState, lastUpdated, shouldDelay }) => (
  <UseDebounce
    onChangeCallback={saveReduxState}
    value={lastUpdated}
    delay={shouldDelay ? 1600 : 0}
  />
)

Persister.propTypes = {
  saveReduxState: PropTypes.func.isRequired,
  lastUpdated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persister)
