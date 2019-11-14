import { ReduxActions } from "../constants"
import { Axios, AxiosForm, Sync } from "."
import { getFile } from "../store/Persister/persist"
import FormData from "form-data"
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
  ENTRY_UPDATE,
  ENTRY_UPDATE_IMAGE
} = ReduxActions

const ParseBlobs = (entry_id, media_type, html) => {
  let dispatchAwsUploads = []
  const [split, ...urls] = html.split("blob:")

  for (let i = 0; i < urls.length; i++) {
    const blob = `blob:${urls[i].split('"')[0]}`
    const fileProps = getFile(blob)
    if (fileProps) {
      const file = new File([blob], fileProps.name, { ...fileProps })
      dispatchAwsUploads.push(AwsUpload(entry_id, media_type, file, blob))
    }
  }
  return dispatchAwsUploads
}

const AwsUpload = (entry_id, media_type, file, blob) => dispatch => {
  let payload = new FormData()
  payload.append("entry_id", 24)
  payload.append("media_type", media_type)
  payload.append("url", file)

  return AxiosForm(payload)
    .post(`/files/`, payload)
    .then(res => {
      dispatch({
        type: ENTRY_UPDATE_IMAGE,
        id: entry_id,
        replaceKey: blob,
        payload: res.data.url
      })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const GetUserEntry = entryId => (dispatch, getState) => {
  const pk = getState().User.id
  return Axios()
    .get(`/entries/${entryId}/?pk=${pk}`)
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
}

const GetUserEntries = pageNumber => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/view/?page=${pageNumber}&pk=${id}`)
    .then(res => {
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

const PostReduxEntry = payload => dispatch => {
  dispatch({
    type: ALERTS_SET_MESSAGE,
    payload: { title: "Cached", message: "Entry" }
  })
  dispatch({
    type: ENTRY_SET,
    payload: { ...payload, shouldPost: true, shouldDelete: false }
  })
}

const ImportReduxEntry = payload => ({
  type: ENTRY_IMPORT,
  payload
})

const PostEntry = payload => dispatch =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        id: payload.id,
        type: ENTRY_POST,
        payload: res.data
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const UpdateReduxEntry = ({ shouldDelete = false, ...payload }) => ({
  type: ENTRY_UPDATE,
  id: payload.id,
  payload,
  shouldDelete
})

const UpdateEntry = (id, payload) => (dispatch, getState) => {
  const pk = getState().User.id
  return Axios()
    .patch(`/entries/${id}/update_with_tags/?pk=${pk}`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ENTRY_UPDATE,
        id,
        payload: res.data,
        lastUpdated: false
      })
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })
}

const DeleteEntry = id => (dispatch, getState) => {
  const pk = getState().User.id
  return Axios()
    .delete(`/entries/${id}/?pk=${pk}`)
    .then(res => {
      dispatch({ type: ENTRY_DELETE, id })
    })
    .catch(e => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      const payload = error.response
      dispatch({ type: ENTRIES_ERROR, payload })
    })
}

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
      if (shouldPost) dispatch({ type: ENTRY_DELETE, id })
      else dispatchDeleteEntries.push(DeleteEntry(id))
      continue
    } else if (shouldPost) {
      payload = {
        id,
        author: UserId,
        title,
        html,
        tags,
        date_created_by_author
      }
      const dispatchAwsUploads = ParseBlobs(id, "Image", html)
      for (let i = 0; i < dispatchAwsUploads.length; i++) {
        dispatchPostEntries.push(dispatchAwsUploads[i])
      }
      dispatchPostEntries.push(PostEntry(payload))
      continue
    } else if (lastUpdated) {
      const dispatchAwsUploads = ParseBlobs(id, "Image", html)
      for (let i = 0; i < dispatchAwsUploads.length; i++) {
        dispatchUpdateEntries.push(dispatchAwsUploads[i])
      }
      payload = { title, html, tags, date_created_by_author }
      dispatchUpdateEntries.push(UpdateEntry(id, payload))
    }
  }
  let dispatchActions = dispatchDeleteEntries
    .concat(dispatchPostEntries)
    .concat(dispatchUpdateEntries)

  if (
    dispatchDeleteEntries.length > 0 ||
    dispatchPostEntries.length > 0 ||
    dispatchUpdateEntries.length > 0
  ) {
    dispatchActions = dispatchActions.concat(
      () =>
        new Promise(resolve =>
          dispatch({
            type: ALERTS_SET_MESSAGE,
            payload: { title: "Synced", message: "Entries" }
          })
        )
    )
  }

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
