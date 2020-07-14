import { AdminActionTypes } from "./types"
import { AppActionTypes } from "../App/types"

const DEFAULT_STATE_ADMIN = {
  users: {
    items: [],
  },
}

const Admin = (state = DEFAULT_STATE_ADMIN, action) => {
  const { type, payload } = action
  switch (type) {
    case AdminActionTypes.ADMIN_SET_USERS:
      return { ...state, users: { ...state.users, items: payload } }

    case AdminActionTypes.ADMIN_SET_USERS_ENTRIES:
      const userEntries = payload.reduce((entryMap, userEntry) => {
        const { id, author } = userEntry
        const isArray = entryMap[author] ? true : false

        entryMap[author] = isArray
          ? entryMap[author].concat(userEntry)
          : [userEntry]

        return entryMap
      }, {})

      return {
        ...state,
        users: {
          ...state.users,
          items: state.users.items.map((user) => ({
            ...user,
            entries: userEntries[user.id],
          })),
        },
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_ADMIN

    default:
      return state
  }
}

export { DEFAULT_STATE_ADMIN, Admin }
