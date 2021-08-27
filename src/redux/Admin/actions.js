import { Axios } from '../Actions'
import actions from '../actionTypes'

export const PendingUsers = () => ({ type: actions.ADMIN_USERS_PENDING })

export const SetUserUsers = users => ({
  type: actions.ADMIN_SET_USERS,
  payload: users,
})

export const SetUserEntries = payload => ({
  type: actions.ADMIN_SET_USERS_ENTRIES,
  payload,
})

export const SetUserEntriesDetails = (entries, authorId) => ({
  type: actions.ADMIN_SET_USER_ENTRIES_DETAILS,
  payload: entries,
  id: authorId,
})

export const GetAllUsers = () => dispatch => {
  // dispatch(PendingUsers())
  return Axios()
    .get('users/')
    .then(({ data }) => {
      dispatch(SetUserUsers(data))
      return data
    })
    .catch(e => console.log(e))
}

export const GetAllUserEntries = () => dispatch => {
  // dispatch(PendingUsers())
  return Axios()
    .get('entries/all/')
    .then(({ data }) => {
      dispatch(SetUserEntries(data))
      return data
    })
    .catch(e => console.log(e))
}

export const GetUserEntriesDetails = authorId => dispatch => {
  dispatch(PendingUsers())
  return Axios()
    .get(`entries/${authorId}/view/`)
    .then(({ data }) => {
      dispatch(SetUserEntriesDetails(data, authorId))
      return data
    })
    .catch(({ response }) => {
      console.log(response)
    })
}
