import { AlertActionTypes } from "../Alerts/types"
import { EntriesActionTypes } from "./types"
import { Axios, AxiosForm } from "../Actions"
import {
  getFileFromBase64,
  htmlToArrayOfBase64,
  cleanObject
} from "../../helpers"
import FormData from "form-data"
import qs from "qs"

const GetUserEntryTags = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`tags/${id}/view/`)
    .then(res => {
      const { data } = res
      dispatch({ type: EntriesActionTypes.ENTRIES_SET_TAGS, payload: data })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const AddEntryTagAuthor = tagTitle => (dispatch, getState) => {
  const { Entries } = getState()
  return Axios()
    .patch(`tags/${tagTitle}/add_author/`)
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET_TAGS,
        payload: Entries.map(entry =>
          entry.title === data.title ? data : entry
        )
      })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const CreateEntryTag = payload => (dispatch, getState) => {
  const {
    User: { id },
    Entries
  } = getState()
  const newPayload = { ...payload, authors: id }
  return Axios()
    .post(`tags/`, qs.stringify(newPayload))
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET_TAGS,
        payload: Entries.concat(data)
      })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const ParseBase64 = (entry_id, updateEntryPayload) => dispatch => {
  const { html } = updateEntryPayload
  const base64s = htmlToArrayOfBase64(html)
  if (base64s.length === 0) {
    // console.log("base64s.length === 0: ", base64s, updateEntryPayload)
    return dispatch(UpdateEntry(entry_id, updateEntryPayload))
  }
  for (let i = 0; i < base64s.length; i++) {
    const base64 = base64s[i]
    const file = getFileFromBase64(base64, `EntryFile-${entry_id}`)
    dispatch(AwsUpload(entry_id, file, base64, html))
  }
  return new Promise(resolve =>
    dispatch({
      type: AlertActionTypes.ALERTS_SET_MESSAGE,
      payload: { title: "Synced", message: "Files" }
    })
  )
}

const AwsUpload = (entry_id, file, base64, html) => dispatch => {
  const { lastModified, lastModifiedDate, name, size, type } = file
  let payload = new FormData()
  payload.append("entry_id", entry_id)
  payload.append("file_type", type)
  payload.append("name", name)
  payload.append("size", size)
  payload.append("date_modified", lastModifiedDate.toJSON())
  payload.append("url", file)

  // console.log("AwsUpload: ", entry_id, file, lastModifiedDate.toJSON())

  return AxiosForm(payload)
    .post(`/files/`, payload)
    .then(res => {
      const { data } = res
      const updateEntryPayload = {
        html: html.replace(base64, data.url)
      }
      // console.log("updateEntryPayload: ", updateEntryPayload)
      dispatch(UpdateEntry(entry_id, updateEntryPayload))
      return data
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const GetEntry = url => dispatch =>
  Axios()
    .get(url)
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRY_SET,
        payload: data
      })
      return data
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const GetUserEntry = entryId => dispatch =>
  dispatch(GetEntry(`/entries/${entryId}/`))

const GetUserEntryDetails = entryId => dispatch =>
  dispatch(GetEntry(`/entries/${entryId}/details/`))

const GetAllUserEntries = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/view/`)
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRY_IMPORT,
        payload: data
      })
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetUserEntries = pageNumber => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/page/?page=${pageNumber}`)
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET,
        payload: data
      })
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetUserEntriesByDate = date => (dispatch, getState) => {
  const { id } = getState().User
  if (!id) return
  return Axios()
    .post(`/entries/${id}/view_by_date/`, qs.stringify({ date }))
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET_BY_DATE,
        payload: data
      })
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const PostReduxEntry = payload => dispatch => {
  dispatch({
    type: EntriesActionTypes.ENTRY_SET,
    payload: { ...payload, _shouldPost: true }
  })
}

const ImportReduxEntry = payload => ({
  type: EntriesActionTypes.ENTRY_IMPORT,
  payload
})

const PostEntry = payload => dispatch =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(res => {
      const { data } = res
      dispatch({
        id: payload.id,
        type: EntriesActionTypes.ENTRY_POST,
        payload: data
      })
      return data
    })
    .catch(e => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload: error })
    })

const UpdateReduxEntry = payload => ({
  type: EntriesActionTypes.ENTRY_UPDATE,
  id: payload.id,
  payload,
  _lastUpdated: new Date()
})

const UpdateEntry = (id, payload) => dispatch =>
  Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
    .then(res => {
      const { data } = res
      dispatch({
        type: EntriesActionTypes.ENTRY_UPDATE,
        id,
        payload: data,
        _lastUpdated: null
      })
      return data
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const DeleteEntry = id => dispatch =>
  Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch({ type: EntriesActionTypes.ENTRY_DELETE, id })
      return res
    })
    .catch(e => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      const payload = error.response
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const SearchUserEntries = search => async (dispatch, getState) => {
  const { id } = getState().User
  await Axios()
    .post(`entries/${id}/search/`, qs.stringify({ search }))
    .then(async res => {
      await dispatch({
        type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
        payload: res.data,
        search
      })
    })
    .catch(async e => {
      await dispatch({
        type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
        payload: [],
        search
      })
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
    })
}

const SyncEntries = getEntryMethod => (dispatch, getState) => {
  const {
    User,
    Entries: { items, filteredItems, isPending }
  } = getState()

  // if (isPending) return

  dispatch({ type: EntriesActionTypes.ENTRIES_PENDING })

  const UserId = User.id

  let synced = false

  const entries = items.concat(filteredItems)

  for (let i = 0, { length } = entries; i < length; i++) {
    const {
      id,
      title,
      html,
      tags,
      rating,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      _shouldDelete,
      _shouldPost,
      _lastUpdated,
      address,
      latitude,
      longitude
    } = entries[i]

    if (_shouldDelete) {
      synced = true
      dispatch(DeleteEntry(id))
      continue
    } else if (_shouldPost) {
      synced = true
      const postPayload = {
        id,
        author: UserId,
        title,
        rating,
        date_created_by_author,
        address,
        latitude,
        longitude
      }

      dispatch(PostEntry(postPayload)).then(entry => {
        const {
          EntryFiles,
          author,
          date_created,
          date_created_by_author,
          date_updated,
          id,
          title,
          views,
          address,
          latitude,
          longitude
        } = entry

        const updateEntryPayload = { html, tags: JSON.stringify(tags) }
        dispatch(ParseBase64(id, cleanObject(updateEntryPayload)))
      })
      continue
    } else if (_lastUpdated) {
      synced = true
      const updateEntryPayload = {
        title,
        date_created_by_author,
        html,
        tags: JSON.stringify(tags),
        rating,
        address,
        latitude,
        longitude
      }
      dispatch(ParseBase64(id, cleanObject(updateEntryPayload)))
    }
  }

  if (typeof getEntryMethod === "function") {
    getEntryMethod()
  }

  if (synced) {
    dispatch({
      type: AlertActionTypes.ALERTS_SET_MESSAGE,
      payload: { title: "Synced", message: "Entries" }
    })
  }

  dispatch({ type: EntriesActionTypes.ENTRIES_COMPLETE })
}

export {
  AddEntryTagAuthor,
  CreateEntryTag,
  GetUserEntryTags,
  GetUserEntry,
  GetUserEntryDetails,
  GetAllUserEntries,
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
