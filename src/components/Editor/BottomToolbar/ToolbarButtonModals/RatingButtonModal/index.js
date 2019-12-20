import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import RatingStar from "../../../../RatingStar"

import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class RatingButtonModal extends PureComponent {
  constructor(props) {
    super(props)
    const { rating } = props

    this.state = { rating, savedRating: false }
  }

  static propTypes = {
    rating: PropTypes.number.isRequired,
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { rating, savedRating } = prevState

    const ButtonIcon = () =>
      new Array(rating === 0 ? 1 : rating).fill(<i className="fas fa-star" />)

    return { rating, savedRating, ButtonIcon }
  }

  handleClick = () => {}

  handleCancel = () => {
    this.setState({ rating: this.props.rating })
  }

  handleSave = () => {
    const { onChangeCallback } = this.props
    const { rating } = this.state

    onChangeCallback({ rating })
  }

  handleStarClicked = rating => {
    this.setState({ rating, savedRating: true })
  }

  handleMouseEnter = rating => {
    const { savedRating } = this.state

    if (!savedRating) {
      this.setState({ rating })
    }
  }

  handleMouseLeave = rating => {
    if (rating !== this.state.rating) {
      this.setState({ savedRating: false })
    }
    // this.setState({ rating: this.props.rating })
  }

  renderRating = rating => {
    let stars = []

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <RatingStar
          key={i}
          value={i}
          filled={i <= rating}
          onMouseEnterCallback={value => this.handleMouseEnter(value)}
          onMouseLeaveCallback={value => this.handleMouseLeave(value)}
          onClickCallback={value => this.handleStarClicked(value)}
        />
      )
    }

    return stars
  }

  render() {
    const { xs } = this.props
    const { rating, ButtonIcon } = this.state

    return (
      <ToolbarModal
        className="Center p-0"
        modalTitle="Add Rating"
        onClickCallback={this.handleClick}
        onCancelCallback={this.handleCancel}
        onSaveCallback={this.handleSave}
        ButtonIcon={ButtonIcon}
        buttonTitle="Add Rating"
        xs={xs}
      >
        <Container fluid className="RatingButtonModal p-0">
          {this.renderRating(rating)}
        </Container>
      </ToolbarModal>
    )
  }
}
export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(RatingButtonModal)
