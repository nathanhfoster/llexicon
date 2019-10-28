import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"

const GetUserEntries = () => (dispatch, getState) => {
  const { id } = getState().User

  return Axios()
    .get(`/entries/${id}/view/`)
    .then(res => {
      dispatch({
        type: ReduxActions.ENTRIES_SET,
        payload: res.data
      })
    })
    .catch(e => console.log(e))
}

const UpdateEntry = payload => ({
  id: payload.id,
  type: ReduxActions.ENTRY_UPDATE,
  payload
})

const PostEntry = payload => dispatch =>
  Axios()
    .post(`user/settings/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log("PostSettings: ", e.response))

export { GetUserEntries, UpdateEntry, PostEntry }
