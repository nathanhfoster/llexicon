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

const PostReduxEntry = ({ shouldPost, ...payload }) => ({
  type: ReduxActions.ENTRY_POST,
  payload,
  shouldPost
})

const PostEntry = payload => dispatch =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.ENTRY_POST,
        payload: res.data,
        shouldPost: false
      })
    })
    .catch(e => console.log("PostEntry: ", e.response))

const UpdateReduxEntry = ({ shouldDelete, ...payload }) => ({
  id: payload.id,
  type: ReduxActions.ENTRY_UPDATE,
  payload,
  shouldDelete
})

const UpdateEntry = (id, payload) => dispatch =>
  Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        id,
        type: ReduxActions.ENTRY_UPDATE,
        payload: res.data,
        lastUpdated: false
      })
    })
    .catch(e => console.log("UpdateEntry: ", e.response))

const DeleteEntry = id => dispatch => {
  return Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch({
        id,
        type: ReduxActions.ENTRY_DELETE
      })
    })
    .catch(e => console.log("DeleteEntry: ", e.response))
}

const SyncEntries = () => (dispatch, getState) => {
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
      tags,
      date_created,
      date_updated,
      views,
      shouldDelete,
      shouldPost,
      lastUpdated
    } = entry

    let payload

    if (shouldDelete) {
      dispatch(DeleteEntry(id))
    } else if (shouldPost) {
      payload = { author, title, html, tags }
      dispatch(PostEntry(payload))
    } else if (lastUpdated) {
      payload = { title, html, tags }
      dispatch(UpdateEntry(id, payload))
    }
  }
  dispatch(GetUserEntries())
}

export {
  GetUserEntries,
  PostReduxEntry,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  DeleteEntry,
  SyncEntries
}
