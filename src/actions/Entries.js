import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"

const GetUserEntries = () => async (dispatch, getState) => {
  const { id } = getState().User
  await Axios()
    .get(`/entries/${id}/view/`)
    .then(async res => {
      await dispatch({
        type: ReduxActions.ENTRIES_SET,
        payload: res.data
      })
    })
    .catch(e => {
      console.log("GetUserEntries: ", e.response)
    })
}

const PostReduxEntry = ({ shouldPost, ...payload }) => ({
  type: ReduxActions.ENTRY_POST,
  payload,
  shouldPost
})

const PostEntry = payload => async dispatch =>
  await Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(async res => {
      await dispatch({
        type: ReduxActions.ENTRY_POST,
        payload: res.data,
        shouldPost: false
      })
    })
    .catch(e => {
      console.log("PostEntry: ", e.response)
    })

const UpdateReduxEntry = ({ shouldDelete, ...payload }) => ({
  id: payload.id,
  type: ReduxActions.ENTRY_UPDATE,
  payload,
  shouldDelete
})

const UpdateEntry = (id, payload) => async dispatch =>
  await Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
    .then(async res => {
      await dispatch({
        id,
        type: ReduxActions.ENTRY_UPDATE,
        payload: res.data,
        lastUpdated: false
      })
    })
    .catch(e => {
      console.log("UpdateEntry: ", e.response)
    })

const DeleteEntry = id => async dispatch =>
  await Axios()
    .delete(`/entries/${id}/`)
    .then(async res => {
      await dispatch({
        id,
        type: ReduxActions.ENTRY_DELETE
      })
    })
    .catch(e => {
      console.log("DeleteEntry: ", e.response)
    })

const SyncEntries = () => async (dispatch, getState) => {
  const {
    Entries: { items }
  } = await getState()

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
