import { Axios, AxiosForm, AxiosOffline } from "../Actions"
import { AdminActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ResetRedux } from "../App/actions"
import { SetAlert } from "../Alerts/actions"
import { persistReduxState } from "../localState"
import { GetUserEntries } from "../Entries/actions"
import { clearReduxStoreFromLocalStorage } from "../localState"
import qs from "qs"
import { Admin } from "./reducer"

const PendingUsers = () => ({ type: AdminActionTypes.ADMIN_USERS_PENDING })

const SetUserUsers = (users) => ({
  type: AdminActionTypes.ADMIN_SET_USERS,
  payload: users,
})

const SetUserEntries = (payload) => ({
  type: AdminActionTypes.ADMIN_SET_USERS_ENTRIES,
  payload,
})

const SetUserEntriesDetails = (entries, authorId) => ({
  type: AdminActionTypes.ADMIN_SET_USER_ENTRIES_DETAILS,
  payload: entries,
  id: authorId,
})

const GetAllUsers = () => (dispatch) => {
  // dispatch(PendingUsers())
  return Axios()
    .get("users/")
    .then(({ data }) => {
      dispatch(SetUserUsers(data))
      return data
    })
    .catch((e) => console.log(e))
}

const GetAllUserEntries = () => (dispatch) => {
  // dispatch(PendingUsers())
  return Axios()
    .get("entries/all/")
    .then(({ data }) => {
      dispatch(SetUserEntries(data))
      return data
    })
    .catch((e) => console.log(e))
}

const GetUserEntriesDetails = (authorId) => (dispatch) => {
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

export { GetAllUsers, GetAllUserEntries, GetUserEntriesDetails }
