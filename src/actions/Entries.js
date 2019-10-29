import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"

const GetUserEntries = () => (dispatch, getState) => {
  const { id } = getState().User
  Axios()
    .get(`/entries/${id}/view/`)
    .then(res => {
      dispatch({
        type: ReduxActions.ENTRIES_SET,
        payload: res.data
      })
      return Promise.resolve
    })
    .catch(e => {
      console.log("GetUserEntries: ", e.response)
      return Promise.reject
    })
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
      return Promise.resolve
    })
    .catch(e => {
      console.log("PostEntry: ", e.response)
      return Promise.reject
    })

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
      return Promise.resolve
    })
    .catch(e => {
      console.log("UpdateEntry: ", e.response)
      return Promise.reject
    })

const DeleteEntry = id => dispatch =>
  Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch({
        id,
        type: ReduxActions.ENTRY_DELETE
      })
      return Promise.resolve
    })
    .catch(e => {
      console.log("DeleteEntry: ", e.response)
      return Promise.reject
    })

const SyncEntries = () => async (dispatch, getState) => {
  const {
    Entries: { items }
  } = getState()

  let dispatchDeleteEntries = []
  let dispatchPostEntries = []
  let dispatchUpdateEntries = []

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
      await dispatch(DeleteEntry(id))
    } else if (shouldPost) {
      payload = { author, title, html, tags }
      await dispatch(PostEntry(payload))
    } else if (lastUpdated) {
      payload = { title, html, tags }
      await dispatch(UpdateEntry(id, payload))
    }
  }
  await dispatch(GetUserEntries())
}

const Sync = dispatchActions => {}

export {
  GetUserEntries,
  PostReduxEntry,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  DeleteEntry,
  SyncEntries
}
