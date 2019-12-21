import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import "./styles.css"

class RatingStar extends PureComponent {
  constructor(props) {
    super(props)

    const { filled } = props

    this.state = { filled }
  }

  static propTypes = {
    value: PropTypes.number,
    filled: PropTypes.bool.isRequired,
    onClickCallback: PropTypes.func,
    onMouseEnterCallback: PropTypes.func,
    onMouseLeaveCallback: PropTypes.func
  }

  static defaultProps = {
    filled: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, filled } = nextProps
    return { value, filled }
  }

  handleMouseEnter = () => {
    const { onMouseEnterCallback } = this.props
    const { value } = this.state
    if (onMouseEnterCallback) {
      onMouseEnterCallback(value)
    } else {
      this.setState({ filled: true })
    }
  }

  handleMouseLeave = () => {
    const { onMouseLeaveCallback } = this.props
    const { value } = this.state
    if (onMouseLeaveCallback) {
      onMouseLeaveCallback(value)
    } else {
      this.setState({ filled: false })
    }
  }

  handleOnClick = () => {
    const { onClickCallback } = this.props
    const { value } = this.state
    if (onClickCallback) {
      onClickCallback(value)
    }
  }

  render() {
    const { onClickCallback } = this.props
    const { value, filled } = this.state
    return (
      <span>
        <i
          className={`${
            filled ? "fas" : "far"
          } fa-star fa-2x pt-3 pb-3 pl-1 pr-1 RatingStar`}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleOnClick}
        />
      </span>
    )
  }
}

export default RatingStar
