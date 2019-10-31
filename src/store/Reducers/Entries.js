import { ReduxActions } from "../../constants.js"

const defaultState = { items: [] }

export const Entries = (state = defaultState, action) => {
  const { id, shouldPost, shouldDelete, type, payload } = action
  switch (type) {
    case ReduxActions.ENTRY_IMPORT:
      return { ...state, items: state.items.concat(payload) }
    case ReduxActions.ENTRIES_SET:
      return { ...state, items: payload }
    case ReduxActions.ENTRY_POST:
      const entryFound = state.items.findIndex(item => item.id === id) !== -1
      if (entryFound) return state
      else
        return {
          ...state,
          items: [payload].concat(state.items)
        }
    case ReduxActions.ENTRY_UPDATE:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id
            ? {
                ...item,
                ...payload,
                lastUpdated: new Date(),
                shouldDelete
              }
            : item
        )
      }
    case ReduxActions.ENTRY_DELETE:
      return { ...state, items: state.items.filter(item => item.id !== id) }
    case ReduxActions.REDUX_RESET:
      return defaultState
    default:
      return state
  }
}
