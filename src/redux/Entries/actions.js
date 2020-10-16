import { Axios, AxiosForm } from '../Actions'
import { SetApiResponseStatus, SetAlert } from '../Alerts/actions'
import { RouterPush } from '../router/actions'
import { EntriesActionTypes } from './types'
import { getFileFromBase64, htmlToArrayOfBase64, cleanObject } from '../../utils'
import { getJsonTagsOrPeople, getReduxEntryId } from './utils'
import FormData from 'form-data'
import qs from 'qs'
import ReactGA from 'react-ga'

const ToggleShowOnlyPublic = () => ({
  type: EntriesActionTypes.ENTRIES_TOGGLE_SHOW_ONLY_PUBLIC,
})

const PendingEntries = () => ({ type: EntriesActionTypes.ENTRIES_PENDING })

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

const SetEntry = payload => ({
  type: EntriesActionTypes.ENTRY_SET,
  payload,
})

const PostReduxEntry = payload => (dispatch, getState) => {
  const {
    items: { length: itemsLength },
    filteredItems: { length: filteredItemsLength },
  } = getState().Entries

  const length = itemsLength + filteredItemsLength

  return dispatch(
    SetEntry({
      ...payload,
      id: getReduxEntryId(length),
      _shouldPost: true,
    }),
  )
}

const UpdateReduxEntry = (id, entry, _lastUpdated = new Date()) => {
  let payload = { ...entry, _lastUpdated }
  return {
    type: EntriesActionTypes.ENTRY_UPDATE,
    id,
    payload,
  }
}

const ClearEntry = () => ({ type: EntriesActionTypes.ENTRY_CLEAR })

const DeleteReduxEntry = id => ({ type: EntriesActionTypes.ENTRY_DELETE, id })

const SetEntries = payload => ({ type: EntriesActionTypes.ENTRIES_SET, payload })

const SetEntriesTags = payload => ({ type: EntriesActionTypes.ENTRIES_SET_TAGS, payload })

const SetEntriesPeople = payload => ({ type: EntriesActionTypes.ENTRIES_SET_PEOPLE, payload })

const SetSearchEntries = (search, payload = []) => ({
  type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
  payload,
  search,
})

const ResetSearchEntries = () => dispatch => dispatch(SetSearchEntries(''))

const GetUserEntryTags = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`tags/${id}/view/`)
    .then(({ data }) => {
      dispatch(SetEntriesTags(data))
      ReactGA.event({
        category: 'Get User Entry Tags',
        action: 'User got their entry tags!',
        value: id,
      })
      return data
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const GetUserEntryPeople = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`people/${id}/view/`)
    .then(({ data }) => {
      dispatch(SetEntriesPeople(data))
      ReactGA.event({
        category: 'Get User Entry People',
        action: 'User got their entry people!',
        value: id,
      })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const CreateEntryTag = payload => (dispatch, getState) => {
  const {
    User: { id },
  } = getState()
  const newPayload = { ...payload, authors: id }
  return Axios()
    .post(`tags/`, qs.stringify(newPayload))
    .then(({ data }) => {
      dispatch(SetEntriesTags(data))
      ReactGA.event({
        category: 'Create Entry Tag',
        action: 'User created a entry tag!',
        value: id,
      })
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const ParseBase64 = (entry_id, updateEntryPayload) => dispatch => {
  const { html } = updateEntryPayload
  const base64s = htmlToArrayOfBase64(html)
  for (let i = 0; i < base64s.length; i++) {
    const base64 = base64s[i]
    const file = getFileFromBase64(base64, `EntryFile-${entry_id}`)
    dispatch(AwsUpload(entry_id, file, base64, html))
  }
  dispatch(UpdateEntry(entry_id, updateEntryPayload))
  return new Promise(resolve => resolve(dispatch(SetAlert({ title: 'Synced', message: 'Files' }))))
}

const AwsUpload = (entry_id, file, base64, html) => dispatch => {
  const { lastModified, lastModifiedDate, name, size, type } = file
  let payload = new FormData()
  payload.append('entry_id', entry_id)
  payload.append('file_type', type)
  payload.append('name', name)
  payload.append('size', size)
  payload.append('date_modified', lastModifiedDate.toJSON())
  payload.append('url', file)

  return AxiosForm({ payload })
    .post(`/files/`, payload)
    .then(({ data }) => {
      const updateEntryPayload = {
        html: html.replace(base64, data.url),
      }
      dispatch(UpdateEntry(entry_id, updateEntryPayload))
      ReactGA.event({
        category: 'Aws Upload',
        action: 'User created a EntryFile in Aws',
        value: data.url,
      })
      return data
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))
}

const GetEntry = (url, id) => (dispatch, getState) => {
  const {
    Entries: { items, filteredItems },
    User: { id: userLoggedIn },
  } = getState()
  const entry = items.concat(filteredItems).find(entry => entry.id == id)
  if (entry) {
    dispatch(SetEntry(entry))
  }
  dispatch(PendingEntries())

  return Axios()
    .get(url)
    .then(({ data }) => {
      dispatch(SetEntry(data))
      ReactGA.event({
        category: 'Get Entry',
        action: 'User is looking at entry!',
        value: id,
      })
      return data
    })
    .catch(({ response }) => {
      if (userLoggedIn && response) {
        const { status } = response
        if (entry && !entry._shouldPost && (status === 401 || status === 404)) {
          dispatch(DeleteReduxEntry(id))
          dispatch(SetApiResponseStatus(status))
          dispatch(
            SetAlert({
              title: 'Access Denied',
              message: 'This entry is no longer public',
            }),
          )
        }

        const payload = JSON.parse(JSON.stringify(response))
        dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
      }
    })
}

const GetUserEntry = id => dispatch => dispatch(GetEntry(`/entries/${id}/`, id))

const GetUserEntryDetails = id => dispatch => dispatch(GetEntry(`/entries/${id}/details/`, id))

const GetAllUserEntries = () => (dispatch, getState) => {
  dispatch(PendingEntries())
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/view/`)
    .then(({ data }) => {
      dispatch(SetEntries(data))
      ReactGA.event({
        category: 'Get All User Entries',
        action: 'User is got all their entries!',
        value: id,
      })
      dispatch(SetAlert({ title: 'Received', message: 'Entries' }))
      return data
    })
    .catch(e => {
      console.log(e)
      return e
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetUserEntries = pageNumber => (dispatch, getState) => {
  dispatch(PendingEntries())
  const { id } = getState().User
  return Axios()
    .get(`/entries/${id}/page/?page=${pageNumber}`)
    .then(({ data }) => {
      dispatch(SetEntries(data))
      ReactGA.event({
        category: 'Get User Entries Page',
        action: 'User got a entry page!',
        label: pageNumber.toString(),
        value: id,
      })
      dispatch(SetAlert({ title: 'Received', message: 'Entries' }))
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e.response))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const GetAllUserEntryPages = (pageNumber = 1) => dispatch => {
  if (pageNumber) {
    dispatch(GetUserEntries(pageNumber))
      .then(({ next }) => {
        const split = next?.split('page=')
        if (split?.length > 0) {
          const nextPage = split[1]
          dispatch(GetAllUserEntryPages(nextPage))
        }
      })
      .catch(e => console.log(e))
  }
}

const GetUserEntriesByDate = payload => (dispatch, getState) => {
  dispatch(PendingEntries())
  const { id } = getState().User
  return Axios()
    .post(`/entries/${id}/view_by_date/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(SetEntries(data))
      ReactGA.event({
        category: 'Get User Entries By Date',
        action: 'User got a entry page!',
        label: JSON.stringify(payload),
        value: id,
      })
      dispatch(SetAlert({ title: 'Received', message: 'Entries' }))
      return data
    })
    .catch(e => {
      console.log(e)
      // const payload = JSON.parse(JSON.stringify(e))
      // dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
    })
}

const PostEntry = payload => (dispatch, getState) => {
  dispatch(PendingEntries())
  return Axios()
    .post(`entries/`, qs.stringify(payload))
    .then(({ data }) => {
      const {
        router: {
          location: { pathname },
        },
      } = getState()

      if (pathname.includes(payload.id)) {
        const newRoute = pathname.replace(payload.id, data.id)
        RouterPush(newRoute)
      }
      dispatch(UpdateReduxEntry(payload.id, data, null))
      ReactGA.event({
        category: 'Post Entry',
        action: 'User posted a new entry!',
        value: data.id,
      })
      return data
    })
    .catch(e => {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload: error })
    })
}

const UpdateEntry = (id, payload) => dispatch => {
  dispatch(PendingEntries())
  return Axios()
    .patch(`/entries/${id}/update_entry/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(UpdateReduxEntry(data.id, data, null))
      ReactGA.event({
        category: 'Update Entry',
        action: 'User updated a new entry!',
        value: data.id,
      })

      return data
    })
    .catch(e => {
      if (e.response) {
        const payload = JSON.parse(JSON.stringify(e.response))
        dispatch({ type: EntriesActionTypes.ENTRIES_ERROR, payload })
      }
    })
}

const DeleteEntry = id => dispatch => {
  dispatch(PendingEntries())
  return Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch(DeleteReduxEntry(id))
      ReactGA.event({
        category: 'Delete Entry',
        action: 'User deleted a new entry!',
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
}

const SearchUserEntries = search => (dispatch, getState) => {
  dispatch(PendingEntries())
  dispatch(SetSearchEntries(search))
  const { id } = getState().User
  return Axios()
    .post(`entries/${id}/search/`, qs.stringify({ search }))
    .then(async ({ data }) => {
      await dispatch(SetSearchEntries(search, data))
      ReactGA.event({
        category: 'Search User Entries',
        action: 'User searched for entries!',
        value: search,
      })
      return data
    })
    .catch(async e => {
      await dispatch({
        type: EntriesActionTypes.ENTRIES_SEARCH_FILTER,
        payload: [],
        search,
      })
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
    })
}

const DeleteEntryFileFromRedux = (id, entry_id) => (dispatch, getState) => {
  const { items, filteredItems } = getState().Entries
  const entryToUpdate = items.concat(filteredItems).find(entry => entry.id == entry_id)

  if (entryToUpdate) {
    let { EntryFiles } = entryToUpdate
    const indexToUpdate = EntryFiles.findIndex(file => file.id === id)
    console.log(indexToUpdate)
    if (indexToUpdate) {
      delete EntryFiles[indexToUpdate]
      const payload = {
        EntryFiles,
        _shouldDelete: true,
      }
      dispatch(UpdateReduxEntry(entry_id, payload, null))
    }
  }
}

const DeleteEntryFile = (id, entry_id) => dispatch =>
  Axios()
    .delete(`/files/${id}/`)
    .then(res => {
      dispatch(DeleteEntryFileFromRedux(id, entry_id))
      return res
    })
    .catch(e => console.log(JSON.parse(JSON.stringify(e))))

const SyncEntries = getEntryMethod => async (dispatch, getState) => {
  const {
    User,
    Entries: { items, filteredItems, isPending },
  } = getState()

  const UserId = User.id

  dispatch(PendingEntries())

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
      await dispatch(DeleteEntry(id)).then(res =>
        dispatch(SetAlert({ title: 'Deleted', message: 'Entry' })),
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

      await dispatch(PostEntry(postPayload)).then(async entry => {
        dispatch(SetAlert({ title: 'Saved', message: 'Entry' }))
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
        //  views,
      }
      await dispatch(ParseBase64(id, cleanObject(updateEntryPayload))).then(res =>
        dispatch(SetAlert({ title: 'Updated', message: 'Entry' })),
      )
    }
  }

  if (typeof getEntryMethod === 'function') {
    await getEntryMethod().then(res => dispatch(SetAlert({ title: 'Received', message: 'Entry' })))
  }

  dispatch({ type: EntriesActionTypes.ENTRIES_COMPLETE })
}

export {
  ToggleShowOnlyPublic,
  CreateEntryTag,
  GetUserEntryTags,
  GetUserEntryPeople,
  ClearEntry,
  SetEntry,
  SetEntries,
  GetUserEntry,
  GetUserEntryDetails,
  GetAllUserEntries,
  GetAllUserEntryPages,
  GetUserEntries,
  GetUserEntriesByDate,
  PostReduxEntry,
  PostEntry,
  UpdateReduxEntry,
  UpdateEntry,
  DeleteReduxEntry,
  DeleteEntry,
  ResetSearchEntries,
  SearchUserEntries,
  SyncEntries,
  DeleteEntryFileFromRedux,
  DeleteEntryFile,
  ResetEntriesSortAndFilterMaps,
  SetEntriesSortMap,
  SetEntriesFilterMap,
}
