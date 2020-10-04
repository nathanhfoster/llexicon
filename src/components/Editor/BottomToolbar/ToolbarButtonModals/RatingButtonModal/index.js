import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import ToolbarModal from '../../ToolbarModal'
import { RatingStar, RatingIcon } from '../../../../'
import './styles.css'

const getInitialState = ({ rating }) => ({ rating, savedRating: false })

const RatingButtonModal = props => {
  const { xs, onChangeCallback } = props
  const [state, setState] = useState(getInitialState(props))
  const { rating, savedRating } = state

  const previousPropsRating = useRef(props.rating)
  const ratingChanged = previousPropsRating.current !== props.rating && props.ratring !== rating

  useEffect(() => {
    if (ratingChanged) {
      setState(prevState => ({ ...prevState, rating: props.rating }))
    }
  }, [props.rating])

  const handleClick = useCallback(() => {}, [])

  const handleCancel = useCallback(
    () =>
      setState(prevState => ({
        ...prevState,
        rating: props.rating,
        savedRating: false,
      })),
    [],
  )

  const handleSave = useCallback(() => onChangeCallback({ rating }), [])

  const handleStarClicked = useCallback(
    rating => setState(prevState => ({ ...prevState, rating, savedRating: true })),
    [],
  )

  const handleMouseEnter = useCallback(
    rating => {
      if (!savedRating) {
        setState(prevState => ({ ...prevState, rating }))
      }
    },
    [savedRating],
  )

  const handleMouseLeave = useCallback(
    leftRating => {
      if (leftRating !== rating) {
        setState(prevState => ({ ...prevState, savedRating: false }))
      }
    },
    [rating],
  )

  const renderRating = useMemo(() => {
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
        />,
      )
    }

    return stars
  }, [rating])

  const ButtonIcon = useMemo(() => <RatingIcon rating={rating} />, [rating])

  return (
    <ToolbarModal
      className='Center p-0'
      title='Add Rating'
      onClickCallback={handleClick}
      onCancelCallback={handleCancel}
      onSaveCallback={handleSave}
      ButtonIcon={ButtonIcon}
      button='Add Rating'
      xs={xs}
    >
      <Container fluid className='RatingButtonModal p-0'>
        {renderRating}
      </Container>
    </ToolbarModal>
  )
}

RatingButtonModal.propTypes = {
  rating: PropTypes.number.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

export default memo(RatingButtonModal)
