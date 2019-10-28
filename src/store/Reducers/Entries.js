import { ReduxActions } from "../../constants.js"

const defaultState = { items: [] }

export const Entries = (state = defaultState, action) => {
  let newState = { ...state }
  const { id, shouldPost, shouldDelete, type, payload } = action
  switch (type) {
    case ReduxActions.ENTRIES_SET:
      return { ...state, items: payload }
    case ReduxActions.ENTRY_POST:
      return { ...state, items: [{ ...payload, shouldPost }, ...state.items] }
    case ReduxActions.ENTRY_UPDATE:
      const itemIndex = newState.items.findIndex(item => item.id == id)
      if (itemIndex !== -1) {
        newState.items[itemIndex] = {
          ...newState.items[itemIndex],
          ...payload,
          lastUpdated: new Date(),
          shouldDelete
        }
        return newState
      } else return state
    case ReduxActions.ENTRY_DELETE:
      return { ...state, items: state.items.filter(item => item.id !== id) }
    case ReduxActions.RESET_REDUX:
      return defaultState
    default:
      return state
  }
}
