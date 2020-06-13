import { Axios, AxiosForm } from "../Actions"
import { SetApiResponseStatus, SetAlert } from "../Alerts/actions"
import { EntriesActionTypes } from "./types"
import {
  getFileFromBase64,
  htmlToArrayOfBase64,
  cleanObject,
} from "../../utils"
import { getJsonTagsOrPeople } from "./utils"
import FormData from "form-data"
import qs from "qs"
import ReactGA from "react-ga"
import { BASE_JOURNAL_ENTRY_ID } from "./reducer"

const GetUserEntryTags = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`tags/${id}/view/`)
    .then(({ data }) => {
      dispatch({ type: EntriesActionTypes.ENTRIES_SET_TAGS, payload: data })
      ReactGA.event({
        category: "Get User Entry Tags",
        action: "User got their entry tags!",
        value: id,
      })
    })
    .catch((e) => console.log(JSON.parse(JSON.stringify(e))))
}

const GetUserEntryPeople = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`people/${id}/view/`)
    .then(({ data }) => {
      dispatch({ type: EntriesActionTypes.ENTRIES_SET_PEOPLE, payload: data })
      ReactGA.event({
        category: "Get User Entry People",
        action: "User got their entry people!",
        value: id,
      })
    })
    .catch((e) => console.log(JSON.parse(JSON.stringify(e))))
}

const CreateEntryTag = (payload) => (dispatch, getState) => {
  const {
    User: { id },
    Entries,
  } = getState()
  const newPayload = { ...payload, authors: id }
  return Axios()
    .post(`tags/`, qs.stringify(newPayload))
    .then(({ data }) => {
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET_TAGS,
        payload: Entries.concat(data),
      })
      ReactGA.event({
        category: "Create Entry Tag",
        action: "User created a entry tag!",
        value: id,
      })
    })
    .catch((e) => console.log(JSON.parse(JSON.stringify(e))))
}

const ParseBase64 = (entry_id, updateEntryPayload) => (dispatch) => {
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
  return new Promise((resolve) =>
    resolve(dispatch(SetAlert({ title: "Synced", message: "Files" })))
  )
}

const AwsUpload = (entry_id, file, base64, html) => (dispatch) => {
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
    .then(({ data }) => {
      const updateEntryPayload = {
        html: html.replace(base64, data.url),
      }
      // console.log("updateEntryPayload: ", updateEntryPayload)
      dispatch(UpdateEntry(entry_id, updateEntryPayload))
      ReactGA.event({
        category: "Aws Upload",
        action: "User created a EntryFile in Aws",
        value: data.url,
      })
      return data
    })
    .catch((e) => console.log(JSON.parse(JSON.stringify(e))))
}

const GetEntry = (url, id) => (dispatch) =>
  Axios()
    .get(url)
    .then(({ data }) => {
      dispatch({
        type: EntriesActionTypes.ENTRY_SET,
        payload: data,
      })
      ReactGA.event({
        category: "Get Entry",
        action: "User is looking at entry!",
        value: id,
      })
      return data
    })
    .catch(({ response }) => {
      const { status } = response
      if (status === 401 || status === 404) {
        dispatch({ type: EntriesActionTypes.ENTRY_DELETE, id })
        dispatch(SetApiResponseStatus(status))
        dispatch(
          SetAlert({
            title: "Access Denied",
            message: "This entry is no longer public",
          })
        )
      }
      const payload = JSON.parse(JSON.stringify(response))
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const GetUserEntry = (id) => (dispatch) =>
  dispatch(GetEntry(`/entries/${id}/`, id))

const GetUserEntryDetails = (id) => (dispatch) =>
  dispatch(GetEntry(`/entries/${id}/details/`, id))

const GetAllUserEntries = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/view/`)
    .then(({ data }) => {
      dispatch({
        type: EntriesActionTypes.ENTRY_IMPORT,
        payload: data,
      })
      ReactGA.event({
        category: "Get All User Entries",
        action: "User is got all their entries!",
        value: id,
      })
      dispatch(SetAlert({ title: "Received", message: "Entries" }))
      return data
    })
    .catch((e) => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetUserEntries = (pageNumber) => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/page/?page=${pageNumber}`)
    .then(({ data }) => {
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET,
        payload: data,
      })
      ReactGA.event({
        category: "Get User Entries Page",
        action: "User got a entry page!",
        label: pageNumber.toString(),
        value: id,
      })
      dispatch(SetAlert({ title: "Received", message: "Entries" }))
      return data
    })
    .catch((e) => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetUserEntriesByDate = (payload) => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .post(`/entries/${id}/view_by_date/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch({
        type: EntriesActionTypes.ENTRIES_SET_BY_DATE,
        payload: data,
      })
      ReactGA.event({
        category: "Get User Entries By Date",
        action: "User got a entry page!",
        label: JSON.stringify(payload),
        value: id,
      })
      dispatch(SetAlert({ title: "Received", message: "Entries" }))
      return data
    })
    .catch((e) => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const ImportReduxEntry = (payload) => ({
  type: EntriesActionTypes.ENTRY_IMPORT,
  payload,
})

const PostReduxEntry = (payload) => (dispatch, getState) => {
  const { items, filteredItems } = getState().Entries
  const { length } = items.concat(filteredItems)
  return dispatch({
    type: EntriesActionTypes.ENTRY_SET,
    payload: {
      ...payload,
      id: `${BASE_JOURNAL_ENTRY_ID}-${length}`,
      _shouldPost: true,
    },
  })
}

const PostEntry = (payload) => (dispatch) =>
  Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(UpdateReduxEntry(payload.id, data, null))
      ReactGA.event({
        category: "Post Entry",
        action: "User posted a new entry!",
        value: data.id,
      })
      return data
    })
    .catch((e) => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload: error })
    })

const UpdateReduxEntry = (id, entry, _lastUpdated = new Date()) => ({
  type: EntriesActionTypes.ENTRY_UPDATE,
  id,
  payload: { ...entry, _lastUpdated, _shouldPost: false },
})

const UpdateEntry = (id, payload) => (dispatch) =>
  Axios()
    .patch(`/entries/${id}/update_entry/`, qs.stringify(payload))
    .then(async ({ data }) => {
      dispatch(UpdateReduxEntry(id, data, null))
      ReactGA.event({
        category: "Update Entry",
        action: "User updated a new entry!",
        value: data.id,
      })

      return data
    })
    .catch((e) => {
      const payload = JSON.parse(JSON.stringify(e.response))
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const DeleteReduxEntry = (id) => ({ type: EntriesActionTypes.ENTRY_DELETE, id })

const DeleteEntry = (id) => (dispatch) =>
  Axios()
    .delete(`/entries/${id}/`)
    .then((res) => {
      dispatch(DeleteReduxEntry(id))
      ReactGA.event({
        category: "Delete Entry",
        action: "User deleted a new entry!",
        value: id,
      })
      return res
    })
    .catch(({ response }) => {
      if (response.status === 404) {
        dispatch(DeleteReduxEntry(id))
      }
      const payload = response
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })

const SetSearchEntries = (search, payload = []) => ({
  type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
  payload,
  search,
})

const ResetSearchEntries = () => (dispatch) => dispatch(SetSearchEntries(""))

const SearchUserEntries = (search) => (dispatch, getState) => {
  dispatch(SetSearchEntries(search))
  const { id } = getState().User
  return Axios()
    .post(`entries/${id}/search/`, qs.stringify({ search }))
    .then(async ({ data }) => {
      await dispatch(SetSearchEntries(search, data))
      ReactGA.event({
        category: "Search User Entries",
        action: "User searched for entries!",
        value: search,
      })
      return data
    })
    .catch(async (e) => {
      await dispatch({
        type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
        payload: [],
        search,
      })
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
    })
}

const SyncEntries = (getEntryMethod) => async (dispatch, getState) => {
  const {
    User,
    Entries: { items, filteredItems, isPending },
  } = getState()

  const UserId = User.id

  dispatch({ type: EntriesActionTypes.ENTRIES_PENDING })

  const entries = items.concat(filteredItems)

  for (let i = 0, { length } = entries; i < length; i++) {
    const {
      id,
      title,
      html,
      tags,
      people,
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
      longitude,
      is_public,
    } = entries[i]

    if (_shouldDelete) {
      await dispatch(DeleteEntry(id)).then((res) =>
        dispatch(SetAlert({ title: "Deleted", message: "Entry" }))
      )
      continue
    } else if (_shouldPost) {
      const postPayload = {
        id,
        author: UserId,
        title,
        rating,
        date_created_by_author,
        address,
        latitude,
        longitude,
        is_public,
      }

      await dispatch(PostEntry(postPayload)).then(async (entry) => {
        dispatch(SetAlert({ title: "Saved", message: "Entry" }))
        if (!entry) return
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
          longitude,
          is_public,
        } = entry

        const updateEntryPayload = {
          html,
          tags: getJsonTagsOrPeople(tags),
          people: getJsonTagsOrPeople(people),
        }
        await dispatch(ParseBase64(id, cleanObject(updateEntryPayload)))
      })
      continue
    } else if (_lastUpdated) {
      const updateEntryPayload = {
        title,
        date_created_by_author,
        html,
        tags: getJsonTagsOrPeople(tags),
        people: getJsonTagsOrPeople(people),
        rating,
        address,
        latitude,
        longitude,
        is_public,
      }
      await dispatch(
        ParseBase64(id, cleanObject(updateEntryPayload))
      ).then((res) =>
        dispatch(SetAlert({ title: "Updated", message: "Entry" }))
      )
    }
  }

  if (typeof getEntryMethod === "function") {
    await getEntryMethod().then((res) =>
      dispatch(SetAlert({ title: "Received", message: "Entry" }))
    )
  }

  dispatch({ type: EntriesActionTypes.ENTRIES_COMPLETE })
}

const ResetEntriesSortAndFilterMaps = () => ({
  type: EntriesActionTypes.ENTRIES_RESET_SORT_AND_FILTER_MAP,
})

const SetEntriesSortMap = (sortKey, sortUp) => ({
  type: EntriesActionTypes.ENTRIES_SET_SORT_MAP,
  payload: { sortKey, sortUp },
})

const SetEntriesFilterMap = (filterKey, searchValue) => ({
  type: EntriesActionTypes.ENTRIES_SET_FILTER_MAP,
  payload: { filterKey, searchValue },
})

export {
  CreateEntryTag,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntry,
  GetUserEntryDetails,
  GetAllUserEntries,
  GetUserEntries,
  GetUserEntriesByDate,
  ImportReduxEntry,
  PostReduxEntry,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  DeleteReduxEntry,
  DeleteEntry,
  ResetSearchEntries,
  SearchUserEntries,
  SyncEntries,
  ResetEntriesSortAndFilterMaps,
  SetEntriesSortMap,
  SetEntriesFilterMap,
}
