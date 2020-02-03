import { ReduxActions } from "../constants"
import { Axios, AxiosForm, Sync } from "."
import { getFile } from "../store/Persister/persist"
import { getFileFromBase64, htmlToArrayOfBase64, cleanObject } from "../helpers"
import FormData from "form-data"
import qs from "qs"

const {
  ALERTS_SET_MESSAGE,
  CALENDAR_SET,
  ENTRIES_SET_TAGS,
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

const GetEntryTags = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`tags/${id}/view/`)
    .then(res => {
      const { data } = res
      dispatch({ type: ENTRIES_SET_TAGS, payload: data })
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
        type: ENTRIES_SET_TAGS,
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
      dispatch({ type: ENTRIES_SET_TAGS, payload: Entries.concat(data) })
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
      type: ALERTS_SET_MESSAGE,
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
      // dispatch({
      //   type: ENTRY_UPDATE_IMAGE,
      //   id: entry_id,
      //   replaceKey: base64,
      //   payload: data.url
      // })
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
        type: ENTRY_SET,
        payload: data
      })
      return data
    })
    .catch(e => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: ENTRIES_ERROR, payload })
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
        type: ENTRY_IMPORT,
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

const GetUserEntries = pageNumber => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/page/?page=${pageNumber}`)
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
  /* dispatch({
    type: ALERTS_SET_MESSAGE,
    payload: { title: "Cached", message: "Entry" }
  }) */
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
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      dispatch({ type: ENTRIES_ERROR, payload: error })
    })

const UpdateReduxEntry = ({ shouldDelete = false, ...payload }) => ({
  type: ENTRY_UPDATE,
  id: payload.id,
  payload,
  shouldDelete,
  lastUpdated: new Date()
})

const UpdateEntry = (id, payload) => dispatch => {
  return Axios()
    .patch(`/entries/${id}/update_with_tags/`, qs.stringify(payload))
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

const DeleteEntry = id => dispatch => {
  return Axios()
    .delete(`/entries/${id}/`)
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
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
    })
}

const SyncEntries = getEntryMethod => (dispatch, getState) => {
  const {
    User,
    Entries: { items, filteredItems }
  } = getState()

  const UserId = User.id

  let dispatchDeleteEntries = []
  let dispatchPostEntries = []
  let dispatchUpdateEntries = []

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
      shouldDelete,
      shouldPost,
      lastUpdated,
      address,
      latitude,
      longitude
    } = entries[i]

    if (shouldDelete) {
      if (shouldPost) dispatch({ type: ENTRY_DELETE, id })
      else dispatchDeleteEntries.push(DeleteEntry(id))
      continue
    } else if (shouldPost) {
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
    } else if (lastUpdated) {
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
      dispatchUpdateEntries.push(
        ParseBase64(id, cleanObject(updateEntryPayload))
      )
      // payload = {title, date_created_by_author}
      // dispatchUpdateEntries.push(UpdateEntry(id, payload))
    }
  }

  let dispatchActions = []

  if (typeof getEntryMethod === "function") dispatchActions.push(getEntryMethod)

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
  AddEntryTagAuthor,
  CreateEntryTag,
  GetEntryTags,
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
