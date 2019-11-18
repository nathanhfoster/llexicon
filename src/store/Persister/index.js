import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveReduxState } from "./persist"

const mapStateToProps = ({ Persister: { lastUpdated } }) => ({ lastUpdated })

const mapDispatchToProps = { saveReduxState }

class Persister extends PureComponent {
  constructor(props) {
    super(props)
    this.interval = null

    const { lastUpdated } = props
    this.state = { lastUpdated }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { saveReduxState, persistInterval } = nextProps
    //this.interval = setInterval(() => this.persistReduxStore(), persistInterval)

    saveReduxState()
    return nextProps
  }

  static propTypes = {
    lastUpdated: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired
  }

  static defaultProps = { lastUpdated: new Date(), persistInterval: 1000 }

  componentDidUpdate(prevProps, prevState) {
    clearInterval(this.interval)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return <noscript />
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persister)
