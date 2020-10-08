import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import ToolbarModal from '../../ToolbarModal'
import { RatingStar, RatingIcon } from '../../../../'
import './styles.css'

const getInitialState = ({ rating }) => ({ rating, savedRating: false })

const RatingButtonModal = ({ xs, onChangeCallback, ...restOfProps }) => {
  const [{ rating, savedRating }, setState] = useState(getInitialState(restOfProps))

  const previousPropsRating = useRef(restOfProps.rating)
  const ratingChanged =
    previousPropsRating.current !== restOfProps.rating && restOfProps.ratring !== rating

  useEffect(() => {
    if (ratingChanged) {
      setState(prevState => ({ ...prevState, rating: restOfProps.rating }))
    }
  }, [restOfProps.rating])

  const handleClick = useCallback(() => {}, [])

  const handleCancel = useCallback(
    () =>
      setState(prevState => ({
        ...prevState,
        rating: restOfProps.rating,
        savedRating: false,
      })),
    [restOfProps.rating],
  )

  const handleSave = useCallback(() => onChangeCallback({ rating }), [rating])

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
  }, [rating, handleMouseEnter, handleMouseLeave, handleStarClicked])

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
