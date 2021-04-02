import React, { useReducer, useEffect, useMemo, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { ActionTypes, getInitialState, reducer } from './state'
import Lightbox from 'react-image-lightbox'
import { useMounted } from 'hooks'
import { Media } from 'reactstrap'
import { EntryPropType } from 'redux/Entries/propTypes'

import './styles.css'

export const BasicImageCarousel = ({ toolbarButtons, imageClickCallback, ...restOfProps }) => {
  const mounted = useMounted()
  const [state, dispatch] = useReducer(reducer, getInitialState(restOfProps))
  const { images, photoIndex, isOpen, imageOffset } = state
  useEffect(() => {
    if (mounted) {
      dispatch({ type: ActionTypes.SET_INDEX_AND_OPEN, payload: restOfProps })
    }
  }, [restOfProps.photoIndex, restOfProps.isOpen])

  useEffect(() => {
    if (mounted) {
      dispatch({ type: ActionTypes.SET_IS_OPEN, payload: restOfProps })
    }
  }, [restOfProps.images])

  const [mainSrc, prevSrc, nextSrc] = useMemo(() => {
    let mainSrc = null
    let prevSrc = null
    let nextSrc = null

    if (images.length > 0) {
      mainSrc = images[photoIndex].url
      prevSrc = images[(photoIndex + images.length - 1) % images.length].url
      nextSrc = images[(photoIndex + 1) % images.length].url
    }

    return [mainSrc, prevSrc, nextSrc]
  }, [photoIndex, images.length])

  const handleOpen = useCallback(() => dispatch({ type: ActionTypes.SET_OPEN }), [])

  const handleClose = useCallback(() => dispatch({ type: ActionTypes.SET_CLOSE }), [])

  const handleMovePrev = useCallback(() => dispatch({ type: ActionTypes.SET_PREV }), [])

  const handleMoveNext = useCallback(() => dispatch({ type: ActionTypes.SET_NEXT }), [])

  const renderImageFiles = useMemo(
    () =>
      images.slice(0, imageOffset).map((image, i) => {
        const { url, name, file_type } = image
        const handleOnClick = () => {
          handleOpen()
          dispatch({ type: ActionTypes.SET_INDEX, payload: i })
          imageClickCallback && imageClickCallback(image)
        }
        return (
          <Media
            key={i}
            type={file_type}
            src={url}
            className='EntryFilesCarouselImage p-1'
            alt={name}
            onClick={handleOnClick}
          />
        )
      }),
    [images, imageOffset],
  )

  const toolBarImagesWithCallback = useMemo(
    () =>
      React.Children.map(toolbarButtons, child => {
        const { onClick, onConfirm } = child.props
        const childProps = onClick
          ? {
              onClick: () => {
                onClick(state)
              },
            }
          : {
              onConfirm: () => {
                onConfirm(state)
              },
            }
        return React.cloneElement(child, childProps)
      }),
    [state, toolbarButtons],
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
      id: EntryPropType.id,
      entry_id: EntryPropType.id,
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      file_type: PropTypes.string,
    }),
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
