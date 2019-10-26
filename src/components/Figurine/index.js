import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class Figurine extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {
    style: {
      position: "absolute",
      top: 200,
      left: 24,
      height: 36,
      width: 36,
      borderRadius: "50%",
      backgroundColor: "red"
    }
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { xPosition, yPosition } = props
    let { style } = props

    style = { ...style, top: yPosition, left: xPosition }

    this.setState({ style })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { style } = this.state
    return <div style={style}>Fig</div>
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Figurine)
)
