import { PureComponent } from "react"
import PropTypes from "prop-types"

class UseDebounce extends PureComponent {
  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    value: PropTypes.any,
    delay: PropTypes.number
  }

  static defaultProps = {
    delay: 400
  }

  getSnapshotBeforeUpdate() {
    clearTimeout(this.debounce)
    return null
  }

  componentDidUpdate() {
    const { onChangeCallback, value, delay } = this.props

    this.debounce = setTimeout(() => onChangeCallback(value), delay)
  }

  render() {
    return null
  }
}
export default UseDebounce
