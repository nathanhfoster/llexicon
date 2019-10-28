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
    .catch(e => console.log("GetUserEntries: ", e.response))
}

const PostEntry = payload => dispatch =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.ENTRY_POST,
        payload: res.data
      })
    })
    .catch(e => console.log("PostEntry: ", e.response))

const UpdateReduxEntry = ({ shouldDelete, ...payload }) => ({
  id: payload.id,
  type: ReduxActions.ENTRY_UPDATE,
  payload,
  shouldDelete
})

const UpdateEntry = (id, payload) => async dispatch =>
  await Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        id,
        type: ReduxActions.ENTRY_UPDATE,
        payload: res.data
      })
    })
    .catch(e => console.log("UpdateEntry: ", e.response))

const UpdateEntries = () => async (dispatch, getState) => {
  const {
    Entries: { items }
  } = getState()

  for (let i = 0; i < items.length; i++) {
    const entry = items[i]
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated,
      shouldDelete
    } = entry
    const payload = { title, html }
    if (shouldDelete) await dispatch(DeleteEntry(id))
    else if (lastUpdated) await dispatch(UpdateEntry(id, payload))
  }
}

const DeleteEntry = id => async dispatch => {
  return await Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      // dispatch({
      //   id,
      //   type: ReduxActions.ENTRY_UPDATE,
      //   payload: res.data,
      //   shouldDelete: true
      // })
    })
    .catch(e => console.log("DeleteEntry: ", e.response))
}

export {
  GetUserEntries,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  UpdateEntries,
  DeleteEntry
}
