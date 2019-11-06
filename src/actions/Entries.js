import { ReduxActions } from "../constants"
import { Axios, Sync } from "."
import qs from "qs"

const {
  ALERTS_SET_MESSAGE,
  CALENDAR_SET,
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_DELETE,
  ENTRY_IMPORT,
  ENTRY_SET,
  ENTRY_POST,
  ENTRY_UPDATE
} = ReduxActions

const GetUserEntry = entryId => dispatch =>
  Axios()
    .get(`/entries/${entryId}/`)
    .then(res => {
      dispatch({
        type: ENTRY_SET,
        payload: res.data
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const GetUserEntries = pageNumber => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/view/?page=${pageNumber}`)
    .then(res => {
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Loaded", message: "Entries" }
      })
      dispatch({
        type: ENTRIES_SET,
        payload: res.data
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })
}

const GetUserEntriesByDate = date => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .post(`/entries/${id}/view_by_date/`, qs.stringify({ date }))
    .then(res => {
      dispatch({
        type: CALENDAR_SET,
        payload: { activeDate: date }
      })
      dispatch({
        type: ENTRIES_SET_BY_DATE,
        payload: res.data
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })
}

const PostReduxEntry = payload => ({
  type: ENTRY_IMPORT,
  payload: { ...payload, shouldPost: true, shouldDelete: false }
})

const ImportReduxEntry = payload => ({
  type: ENTRY_IMPORT,
  payload
})

const PostEntry = payload => dispatch =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Posted", message: "Entry" }
      })
      dispatch({
        id: res.data.id,
        type: ENTRY_POST,
        payload: res.data,
        shouldPost: false
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const UpdateReduxEntry = ({ shouldDelete = false, ...payload }) => ({
  id: payload.id,
  type: ENTRY_UPDATE,
  payload,
  shouldDelete
})

const UpdateEntry = (id, payload) => dispatch =>
  Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Updated", message: "Entry" }
      })
      dispatch({
        id,
        type: ENTRY_UPDATE,
        payload: res.data,
        lastUpdated: false
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const DeleteEntry = id => dispatch =>
  Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Deleted", message: "Entry" }
      })
      dispatch({
        id,
        type: ENTRY_DELETE
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const SyncEntries = () => (dispatch, getState) => {
  const {
    User,
    Entries: { items }
  } = getState()

  const UserId = User.id

  let dispatchDeleteEntries = []
  let dispatchPostEntries = []
  let dispatchUpdateEntries = []

  for (let i = 0; i < items.length; i++) {
    const entry = items[i]
    const {
      id,
      title,
      html,
      tags,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      shouldDelete,
      shouldPost,
      lastUpdated
    } = entry

    let payload

    if (shouldDelete) {
      dispatchDeleteEntries.push(DeleteEntry(id))
      continue
    } else if (shouldPost) {
      payload = { author: UserId, title, html, tags, date_created_by_author }
      dispatchPostEntries.push(PostEntry(payload))
      continue
    } else if (lastUpdated) {
      payload = { title, html, tags, date_created_by_author }
      dispatchUpdateEntries.push(UpdateEntry(id, payload))
    }
  }
  const dispatchActions = dispatchDeleteEntries
    .concat(dispatchPostEntries)
    .concat(dispatchUpdateEntries)
    .concat(GetUserEntries(1))

  dispatch(Sync(dispatchActions))
}

export {
  GetUserEntry,
  GetUserEntries,
  GetUserEntriesByDate,
  PostReduxEntry,
  ImportReduxEntry,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  DeleteEntry,
  SyncEntries
}
