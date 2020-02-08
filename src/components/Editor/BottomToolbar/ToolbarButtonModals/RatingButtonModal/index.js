import React, { useState, useRef, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { Container } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import RatingStar from "../../../../RatingStar"
import RatingIcon from "../../../../RatingIcon"
import "./styles.css"

const getInitialState = ({ rating }) => ({ rating, savedRating: false })

const RatingButtonModal = props => {
  const { xs, onChangeCallback } = props
  const [state, setState] = useState(getInitialState(props))
  const { rating, savedRating } = state

  const previousPropsRating = useRef(props.rating)
  const ratingChanged =
    previousPropsRating.current !== props.rating && props.ratring !== rating

  useEffect(() => {
    if (ratingChanged) {
      setState({ ...state, rating: props.rating })
    }
  }, [props.rating])

  const handleClick = () => {}

  const handleCancel = () => setState({ ...state, rating: props.rating })

  const handleSave = () => onChangeCallback({ rating })

  const handleStarClicked = rating =>
    setState({ ...state, rating, savedRating: true })

  const handleMouseEnter = rating => {
    if (!savedRating) {
      setState({ ...state, rating })
    }
  }

  const handleMouseLeave = leftRating => {
    if (leftRating !== state) {
      setState({ ...state, savedRating: false })
    }
  }

  const renderRating = () => {
    let stars = []

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <RatingStar
          key={i}
          value={i}
          filled={i <= rating}
          onMouseEnterCallback={handleMouseEnter}
          onMouseLeaveCallback={handleMouseLeave}
          onClickCallback={handleStarClicked}
        />
      )
    }

    return stars
  }

  return (
    <ToolbarModal
      className="Center p-0"
      title="Add Rating"
      onClickCallback={handleClick}
      onCancelCallback={handleCancel}
      onSaveCallback={handleSave}
      ButtonIcon={<RatingIcon rating={rating} />}
      buttonTitle="Add Rating"
      xs={xs}
    >
      <Container fluid className="RatingButtonModal p-0">
        {renderRating()}
      </Container>
    </ToolbarModal>
  )
}

RatingButtonModal.propTypes = {
  rating: PropTypes.number.isRequired,
  onChangeCallback: PropTypes.func.isRequired
}

export default memo(RatingButtonModal)
