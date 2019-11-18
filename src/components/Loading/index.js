import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Progress } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class Loading extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currentIndex, dataLength } = props
    const percentage = (currentIndex / dataLength) * 100
    const percentageDone = new Number(percentage)
    const progressColor = this.getColor(percentageDone)

    return { percentageDone, progressColor }
  }

  static propTypes = {
    currentIndex: PropTypes.number.isRequired,
    dataLength: PropTypes.number.isRequired
  }

  static defaultProps = { currentIndex: 77, dataLength: 100 }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  getColor = percentageDone => {
    if (percentageDone === 100) return "success"
    if (percentageDone >= 75) return "info"
    if (percentageDone >= 50) return "warning"
    if (percentageDone <= 25) return "danger"
  }

  render() {
    const { percentageDone, progressColor } = this.state
    return (
      <div>
        <Progress color={progressColor} value={percentageDone} />
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Loading)
)
