import { PureComponent } from "react"
import PropTypes from "prop-types"

class UseDebounce extends PureComponent {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    value: PropTypes.any,
    delay: PropTypes.number
  }

  static defaultProps = {
    delay: 3000
  }

  getSnapshotBeforeUpdate() {
    clearTimeout(this.debounce)
    return null
  }

  componentDidUpdate() {
    const { callback, value, delay } = this.props

    this.debounce = setTimeout(() => callback(value), delay)
  }

  render() {
    return null
  }
}
export default UseDebounce
