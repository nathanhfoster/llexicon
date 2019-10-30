import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveState } from "./persist"

const mapStateToProps = ({ Persister: { lastUpdated } }) => ({ lastUpdated })

const mapDispatchToProps = { saveState }

export class Persister extends PureComponent {
  constructor(props) {
    super(props)
    this.interval = null

    const { lastUpdated } = props
    this.state = { lastUpdated }
  }

  static propTypes = {
    lastUpdated: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired
  }

  static defaultProps = { lastUpdated: new Date(), persistInterval: 1000 }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval)
    this.getState(nextProps)
  }

  getState = props => {
    const { lastUpdated, persistInterval } = props

    //this.interval = setInterval(() => this.persistReduxStore(), persistInterval)

    this.persistReduxStore()

    this.setState({ lastUpdated })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    const { saveState } = this.props
    saveState()
  }

  persistReduxStore = () => {
    const { saveState } = this.props
    saveState()
  }

  render() {
    return <noscript />
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persister)
