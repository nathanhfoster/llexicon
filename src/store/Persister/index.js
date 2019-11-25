import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveReduxState } from "./persist"
import UseDebounce from "../../components/UseDebounce"

const mapStateToProps = ({ Persister: { lastUpdated } }) => ({ lastUpdated })

const mapDispatchToProps = { saveReduxState }

class Persister extends PureComponent {
  static propTypes = {
    saveReduxState: PropTypes.func.isRequired,
    lastUpdated: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { lastUpdated } = nextProps

    return { lastUpdated }
  }

  componentWillUnmount() {
    const { saveReduxState } = this.props
    saveReduxState()
  }

  render() {
    const { saveReduxState } = this.props
    const { lastUpdated } = this.state
    return (
      <UseDebounce callback={value => saveReduxState()} value={lastUpdated} />
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persister)
