import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from "reactstrap"
import "./styles.css"

const BasicCarousel = ({ images, autoPlay }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const next = () => {
    if (animating) return
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const goToIndex = newIndex => {
    if (animating) return
    setActiveIndex(newIndex)
  }

  const slides = images.map((item, i) => {
    return (
      <CarouselItem
        key={`${i}-${item.src}`}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img src={item.src} alt={item.altText} height={item.height} width={item.width} />
        <CarouselCaption captionHeader={item.captionHeader} captionText={item.captionText} />
      </CarouselItem>
    )
  })

  return (
    <Carousel autoPlay={autoPlay} activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators items={images} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  )
}

BasicCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      altText: PropTypes.string,
      captionHeader: PropTypes.string,
      captionText: PropTypes.string,
      href: PropTypes.string,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  autoPlay: PropTypes.bool.isRequired
}

BasicCarousel.defaultProps = {
  autoPlay: true
}

export default memo(BasicCarousel)
