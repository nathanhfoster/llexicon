import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import RatingStar from "../../../../RatingStar"
import RatingIcon from "../../../../RatingIcon"

import "./styles.css"

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

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const ratingChanged =
      prevProps.rating !== this.props.rating &&
      this.props.rating !== this.state.rating

    if (ratingChanged) {
      return this.props.rating
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, rating) {
    if (rating) {
      this.setState({ rating })
    }
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
    const { rating } = this.state

    const ButtonIcon = () => <RatingIcon rating={rating} />

    return (
      <ToolbarModal
        className="Center p-0"
        title="Add Rating"
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
export default RatingButtonModal
