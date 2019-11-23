import { ReduxActions } from "../constants"
import { Axios, AxiosForm, Sync } from "."
import { getFile } from "../store/Persister/persist"
import { getFileFromBase64, htmlToArrayOfBase64 } from "../helpers"
import FormData from "form-data"
import qs from "qs"

const {
  ALERTS_SET_MESSAGE,
  CALENDAR_SET,
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRIES_SEARCH_FILTER,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_DELETE,
  ENTRY_IMPORT,
  ENTRY_SET,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_UPDATE_IMAGE
} = ReduxActions

const ParseBase64 = (entry_id, media_type, html) => dispatch => {
  const base64s = htmlToArrayOfBase64(html)
  if (base64s.length === 0) return dispatch(UpdateEntry(entry_id, { html }))
  for (let i = 0; i < base64s.length; i++) {
    const base64 = base64s[i]
    const file = getFileFromBase64(base64, `EntryFile-${entry_id}`)
    dispatch(AwsUpload(entry_id, media_type, file, base64))
  }
  return new Promise(resolve =>
    dispatch({
      type: ALERTS_SET_MESSAGE,
      payload: { title: "Synced", message: "Files" }
    })
  )
}

const AwsUpload = (entry_id, media_type, file, base64) => dispatch => {
  let payload = new FormData()
  payload.append("entry_id", entry_id)
  payload.append("media_type", media_type)
  payload.append("url", file)

  // console.log("AwsUpload: ", entry_id, media_type, file)

  return AxiosForm(payload)
    .post(`/files/`, payload)
    .then(res => {
      const { data } = res
      dispatch({
        type: ENTRY_UPDATE_IMAGE,
        id: entry_id,
        replaceKey: base64,
        payload: data.url
      })
      return data
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const GetUserEntry = entryId => (dispatch, getState) => {
  const pk = getState().User.id
  return Axios()
    .get(`/entries/${entryId}/?pk=${pk}`)
    .then(res => {
      const { data } = res
      dispatch({
        type: ENTRY_SET,
        payload: data
      })
      return data
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
      const { data } = res
      dispatch({
        type: ENTRIES_SET,
        payload: data
      })
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: ENTRIES_ERROR, payload })
    })
}

const GetUserEntriesByDate = date => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .post(`/entries/${id}/view_by_date/`, qs.stringify({ date }))
    .then(res => {
      const { data } = res
      dispatch({
        type: ENTRIES_SET_BY_DATE,
        payload: data
      })
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e))
      // dispatch({ type: ENTRIES_ERROR, payload })
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
      const { data } = res
      dispatch({
        id: payload.id,
        type: ENTRY_POST,
        payload: data
      })
      return data
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
    })

const UpdateReduxEntry = ({ shouldDelete = false, ...payload }) => ({
  type: ENTRY_UPDATE,
  id: payload.id,
  payload,
  shouldDelete,
  lastUpdated: new Date()
})

const UpdateEntry = (id, payload) => (dispatch, getState) => {
  const pk = getState().User.id
  return Axios()
    .patch(`/entries/${id}/update_with_tags/?pk=${pk}`, qs.stringify(payload))
    .then(res => {
      const { data } = res
      dispatch({
        type: ENTRY_UPDATE,
        id,
        payload: data,
        lastUpdated: false
      })
      return data
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
      return res
    })
    .catch(e => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      const payload = error.response
      dispatch({ type: ENTRIES_ERROR, payload })
    })
}

const SearchUserEntries = search => async (dispatch, getState) => {
  const { id } = getState().User
  await Axios()
    .post(`entries/${id}/search/`, qs.stringify({ search }))
    .then(async res => {
      await dispatch({ type: ENTRIES_SEARCH_FILTER, payload: res.data, search })
    })
    .catch(async e => {
      await dispatch({ type: ENTRIES_SEARCH_FILTER, payload: [], search })
      // const error = JSON.parse(JSON.stringify(e))
      // console.log(error)
    })
}

const SyncEntries = getEntryMethod => (dispatch, getState) => {
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
      dispatch(PostEntry(payload)).then(entry => {
        const {
          EntryFiles,
          author,
          date_created,
          date_created_by_author,
          date_updated,
          html,
          id,
          tags,
          title,
          views
        } = entry
        dispatch(ParseBase64(id, "Image", html))
      })
      continue
    } else if (lastUpdated) {
      dispatchUpdateEntries.push(ParseBase64(id, "Image", html))
      payload = { title, tags, date_created_by_author }
      dispatchUpdateEntries.push(UpdateEntry(id, payload))
    }
  }

  let dispatchActions = []

  if (getEntryMethod) dispatchActions.push(getEntryMethod)

  dispatchActions = dispatchActions
    .concat(dispatchDeleteEntries)
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

  // console.log("dispatchActions: ", dispatchActions)

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
  SearchUserEntries,
  SyncEntries
}
