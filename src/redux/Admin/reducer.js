import actions from '../actionTypes'

import { getStringBytes } from 'utils'

export const DEFAULT_STATE_ADMIN = {
  users: { isPending: false, items: [], item: null },
}

export const Admin = (state = DEFAULT_STATE_ADMIN, action) => {
  const { type, id, payload } = action
  switch (type) {
    case actions.ADMIN_USERS_PENDING:
      return {
        ...state,
        users: { ...state.users, isPending: true },
      }

    case actions.ADMIN_SET_USERS:
      return {
        ...state,
        users: { ...state.users, isPending: false, items: payload },
      }

    case actions.ADMIN_SET_USERS_ENTRIES:
      const userEntries = payload.reduce((entryMap, userEntry) => {
        const { id, author } = userEntry
        const isArray = entryMap[author] ? true : false

        entryMap[author] = isArray ? entryMap[author].concat(userEntry) : [userEntry]

        return entryMap
      }, {})

      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user => ({
            ...user,
            entries: userEntries[user.id],
          })),
        },
      }

    case actions.ADMIN_SET_USER_ENTRIES_DETAILS:
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user =>
            user.id === id
              ? {
                  ...user,
                  entries: payload,
                }
              : user,
          ),
        },
      }

    case actions.ADMIN_SET_USER_ENTRY:
      return {
        ...state,
        users: { ...state.users, isPending: false, item: payload },
      }

    case actions.REDUX_RESET:
      return DEFAULT_STATE_ADMIN

    case actions.LOAD_PERSISTED_STATE:
      return payload?.Admin || state

    case actions.ENTRIES_UPDATE:
      let updatedItem
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(e => {
            if (payload.id === e.id) {
              updatedItem = { ...e, ...payload }
              return {
                ...updatedItem,
                _size: getStringBytes(updatedItem),
              }
            } else if (payload[e.id]) {
              updatedItem = { ...e, ...payload[e.id] }
              return {
                ...updatedItem,
                _size: getStringBytes(updatedItem),
              }
            }

            return e
          }),
        },
      }

    case actions.ENTRIES_DELETE:
      return {
        ...state,
        users: {
          ...state.users,
          isPending: false,
          items: state.users.items.map(user => ({
            ...user,
            entries: user?.entries?.filter(e => payload !== e.id || !payload[e.id]),
          })),
        },
      }

    default:
      return state
  }
}
