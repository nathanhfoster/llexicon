import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { saveState } from "./persist"

const mapStateToProps = ({ Persistor: { lastUpdated } }) => ({ lastUpdated })

const mapDispatchToProps = { saveState }

export class Persistor extends Component {
  constructor(props) {
    super(props)

    const { lastUpdated } = props
    this.state = { lastUpdated }
  }

  static propTypes = { lastUpdated: PropTypes.string.isRequired }

  static defaultProps = { lastUpdated: new Date() }

  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { lastUpdated } = nextState
    const previouslyUpdated = this.state.lastUpdated
    const updateInterval = 1000
    const shouldPersist =
      new Date(lastUpdated) - new Date(previouslyUpdated) > updateInterval

    return shouldPersist
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { lastUpdated } = props

    this.setState({ lastUpdated })
  }

  componentWillUnmount() {
    const { saveState } = this.props
    saveState()
  }

  persistReduxStore = lastUpdated => {
    const { saveState } = this.props
    saveState()
  }

  render() {
    this.persistReduxStore()
    return <noscript />
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Persistor)
