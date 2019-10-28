import { ReduxActions } from "../../constants.js"

const defaultState = { items: [] }

export const Entries = (state = defaultState, action) => {
  const { id, shouldDelete, type, payload } = action
  switch (type) {
    case ReduxActions.ENTRIES_SET:
      return { ...state, items: payload }
    case ReduxActions.ENTRY_POST:
      return { ...state, items: [...state.items, payload] }
    case ReduxActions.ENTRY_UPDATE:
      let newState = { ...state }
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
    case ReduxActions.RESET_REDUX:
      return defaultState
    default:
      return state
  }
}
