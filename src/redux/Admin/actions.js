import { Axios, AxiosForm, AxiosOffline } from "../Actions"
import { AdminActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ResetRedux } from "../App/actions"
import { SetAlert } from "../Alerts/actions"
import { persistReduxState } from "../localState"
import { GetUserEntries } from "../Entries/actions"
import { clearReduxStoreFromLocalStorage } from "../localState"
import qs from "qs"

const GetAllUsers = () => (dispatch) => {
  return Axios()
    .get("users/")
    .then(({ data }) => {
      dispatch({ type: AdminActionTypes.ADMIN_SET_USERS, payload: data })
      return data
    })
    .catch((e) => console.log(e))
}

const GetAllUserEntries = () => (dispatch) => {
  return Axios()
    .get("entries/all/")
    .then(({ data }) => {
      // console.log(data)
      dispatch({
        type: AdminActionTypes.ADMIN_SET_USERS_ENTRIES,
        payload: data,
      })
      return data
    })
    .catch((e) => console.log(e))
}

export { GetAllUsers, GetAllUserEntries }
