import React, { useRef, useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import Lightbox from "react-image-lightbox"
import { Media } from "reactstrap"
import "./styles.css"

const getInitialState = ({ images, photoIndex, isOpen }) => {
  return { images, photoIndex, isOpen }
}

const BasicImageCarousel = ({
  toolbarButtons,
  imageClickCallback,
  ...restOfProps
}) => {
  const mounted = useRef(false)
  const [state, setState] = useState(getInitialState(restOfProps))

  useEffect(() => {
    if (mounted.current) {
      setState((prevState) => ({
        ...prevState,
        photoIndex: restOfProps.photoIndex,
        isOpen: restOfProps.isOpen,
      }))
    }
    mounted.current = true
  }, [restOfProps.photoIndex, restOfProps.isOpen])

  useEffect(() => {
    if (mounted.current) {
      setState((prevState) => ({
        ...prevState,
        images: restOfProps.images,
      }))
    }
  }, [restOfProps.images])

  const { images, photoIndex, isOpen } = state

  let mainSrc = null

  let prevSrc = null

  let nextSrc = null

  if (images.length > 0) {
    mainSrc = images[photoIndex].url

    prevSrc = images[(photoIndex + images.length - 1) % images.length].url

    nextSrc = images[(photoIndex + 1) % images.length].url
  }

  const handleOpen = () =>
    setState((prevState) => ({ ...prevState, isOpen: true }))

  const handleClose = () =>
    setState((prevState) => ({ ...prevState, isOpen: false }))

  const handleMovePrev = () =>
    setState((prevState) => ({
      ...prevState,
      photoIndex: (photoIndex + images.length - 1) % images.length,
    }))

  const handleMoveNext = () =>
    setState((prevState) => ({
      ...prevState,
      photoIndex: (photoIndex + 1) % images.length,
    }))

  const renderImageFiles = useMemo(
    () =>
      images.map((image, i) => {
        const { url, name, file_type } = image
        const handleOnClick = () => {
          handleOpen()
          setState((prevState) => ({ ...prevState, photoIndex: i }))
          imageClickCallback && imageClickCallback(image)
        }
        return (
          <Media
            key={i}
            type={file_type}
            src={url}
            className="EntryFilesCarouselImage p-1"
            alt={name}
            onClick={handleOnClick}
          />
        )
      }),
    [images]
  )

  const toolBarImagesWithCallback = useMemo(
    () =>
      React.Children.map(toolbarButtons, (child) =>
        React.cloneElement(child, {
          onClick: () => child.props.onClick(state),
        })
      ),
    [toolbarButtons]
  )

  return (
    <div style={{ zIndex: 9999 }}>
      {renderImageFiles}
      {isOpen && (
        <Lightbox
          mainSrc={mainSrc}
          mainSrcThumbnail={mainSrc}
          prevSrc={prevSrc}
          prevSrcThumbnail={prevSrc}
          nextSrc={nextSrc}
          nextSrcThumbnail={nextSrc}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
          toolbarButtons={toolBarImagesWithCallback}
        />
      )}
    </div>
  )
}

BasicImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      entry_id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      file_type: PropTypes.string,
    })
  ),
  isOpen: PropTypes.bool.isRequired,
  photoIndex: PropTypes.number.isRequired,
  imageClickCallback: PropTypes.func,
  // Lightbox
  mainSrc: PropTypes.string,
  nextSrc: PropTypes.string,
  prevSrc: PropTypes.string,
  mainSrcThumbnail: PropTypes.string,
  prevSrcThumbnail: PropTypes.string,
  nextSrcThumbnail: PropTypes.string,
  onCloseRequest: PropTypes.func,
  onMovePrevRequest: PropTypes.func,
  onMoveNextRequest: PropTypes.func,
  onImageLoad: PropTypes.func,
  onImageLoadError: PropTypes.func,
  imageLoadErrorMessage: PropTypes.object,
  onAfterOpen: PropTypes.func,
  discourageDownloads: PropTypes.bool,
  animationDisabled: PropTypes.bool,
  animationOnKeyInput: PropTypes.bool,
  animationDuration: PropTypes.number,
  keyRepeatLimit: PropTypes.number,
  keyRepeatKeyupBonus: PropTypes.number,
  imageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  imageCaption: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  imageCrossOrigin: PropTypes.string,
  toolbarButtons: PropTypes.arrayOf(PropTypes.node),
  reactModalStyle: PropTypes.any,
  reactModalProps: PropTypes.any,
  imagePadding: PropTypes.number,
  clickOutsideToClose: PropTypes.bool,
  enableZoom: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  nextLabel: PropTypes.string,
  prevLabel: PropTypes.string,
  zoomInLabel: PropTypes.string,
  zoomOutLabel: PropTypes.string,
  closeLabel: PropTypes.string,
}

BasicImageCarousel.defaultProps = {
  images: [],
  isOpen: false,
  photoIndex: 0,
  toolbarButtons: [],
}

export default memo(BasicImageCarousel)
