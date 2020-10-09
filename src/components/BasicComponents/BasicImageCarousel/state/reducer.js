import ActionTypes from "./types"

const IMAGE_OFFSET = 3
const getInitialState = ({ images, photoIndex, isOpen }) => ({
  images,
  photoIndex,
  isOpen,
  imageOffset: IMAGE_OFFSET,
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case ActionTypes.SET_OPEN:
      return { ...state, isOpen: true }

    case ActionTypes.SET_CLOSE:
      return { ...state, isOpen: false }

    case ActionTypes.SET_PREV:
      return {
        ...state,
        photoIndex:
          (state.photoIndex + state.images.length - 1) % state.images.length,
      }

    case ActionTypes.SET_NEXT:
      const nextIndex = state.photoIndex + 1
      let imageOffset = state.imageOffset
      if (nextIndex !== 1 && IMAGE_OFFSET % nextIndex === 0) {
        if (imageOffset + IMAGE_OFFSET <= state.images.length) {
          imageOffset += IMAGE_OFFSET
        } else {
          imageOffset = state.images.length
        }
      }
      return {
        ...state,
        photoIndex: nextIndex % state.images.length,
        imageOffset,
      }

    case ActionTypes.SET_INDEX:
      return { ...state, photoIndex: payload }

    case ActionTypes.SET_INDEX_AND_OPEN:
      return {
        ...state,
        photoIndex: payload.photoIndex,
        isOpen: payload.isOpen,
      }

    case ActionTypes.SET_IS_OPEN:
      let nextState = {
        ...state,
        images: payload.images,
      }

      if (payload.images.length < state.images.length) {
        nextState = {
          ...nextState,
          photoIndex:
            (state.photoIndex + payload.images.length - 1) %
            payload.images.length,
        }
      } else if (payload.images.length > state.images.length) {
        nextState = {
          ...nextState,
          photoIndex: (state.photoIndex + 1) % payload.images.length,
        }
      }

      return nextState

    default:
      throw Error("Action type does not exist")
  }
}

export { getInitialState, reducer }
