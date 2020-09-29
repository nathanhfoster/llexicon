import ActionTypes from './types'

const getInitialState = ({ images, photoIndex, isOpen }) => ({ images, photoIndex, isOpen })

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
        photoIndex: (state.photoIndex + state.images.length - 1) % state.images.length,
      }
    case ActionTypes.SET_NEXT:
      return {
        ...state,
        photoIndex: (state.photoIndex + state.images.length - 1) % state.images.length,
      }

    case ActionTypes.SET_INDEX:
      return { ...state, photoIndex: payload }

    case ActionTypes.SET_INDEX_AND_OPEN:
      return { ...state, photoIndex: payload.photoIndex, isOpen: payload.isOpen }

    case ActionTypes.SET_IS_OPEN:
      let nextState = {
        ...state,
        images: payload.images,
      }

      if (payload.images.length < state.images.length) {
        nextState = {
          ...nextState,
          photoIndex: (state.photoIndex + payload.images.length - 1) % payload.images.length,
        }
      } else if (payload.images.length > state.images.length) {
        nextState = {
          ...nextState,
          photoIndex: (state.photoIndex + 1) % payload.images.length,
        }
      }

      return nextState

    default:
      throw Error('Action type does not exist')
  }
}

export { getInitialState, reducer }
