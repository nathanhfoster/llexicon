import { Axios, AxiosForm, isNotLoggedInAxios } from 'redux/Actions'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/utils'
import { SetApiResponseStatus, SetAlert } from 'redux/Alerts/actions'
import { RouterPush } from 'redux/router/actions'
import { getFileFromBase64, htmlToArrayOfBase64, cleanObject } from 'utils'
import { getTagStringFromObject } from '../utils'
import FormData from 'form-data'
import qs from 'qs'
import ReactGA from 'react-ga'
import {
  PendingEntries,
  PendingEntry,
  SetEntriesComplete,
  SetEntriesError,
  SetEntry,
  UpdateReduxEntries,
  DeleteReduxEntries,
  SetEntries,
  SetEntriesTags,
  SetEntriesPeople,
  SetSearchEntries,
  DeleteEntryFileFromRedux,
} from './redux'

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

const ParseBase64 = (entry_id, updateEntryPayload) => async dispatch => {
  const { html } = updateEntryPayload
  const base64s = htmlToArrayOfBase64(html)
  for (let i = 0; i < base64s.length; i++) {
    const base64 = base64s[i]
    const file = getFileFromBase64(base64, `EntryFile-${entry_id}`)
    dispatch(AwsUpload(entry_id, file, base64, html))
  }
  await dispatch(UpdateEntry(entry_id, updateEntryPayload))
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
  dispatch(PendingEntry())

  const {
    Entries: { item, items, filteredItems },
    User: { id: userLoggedIn },
  } = getState()

  const entry = item?.id == id ? item : items.concat(filteredItems).find(entry => entry.id == id)

  if (entry) {
    dispatch(SetEntry(entry))
  }

  if (id.includes(BASE_JOURNAL_ENTRY_ID)) {
    return isNotLoggedInAxios()
  }

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
    .catch(e => {
      const { response } = e
      if (userLoggedIn && response) {
        const { status } = response
        if (entry && !entry._shouldPost && (status === 401 || status === 404)) {
          dispatch(DeleteReduxEntries(id))
          dispatch(SetApiResponseStatus(status))
          dispatch(
            SetAlert({
              title: 'Access Denied',
              message: 'This entry is no longer public',
            }),
          )
        }

        const error = JSON.parse(JSON.stringify(e))
        console.log(error)
        dispatch(SetEntriesError(error))
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
      dispatch(SetEntriesError(e))
    })
}

const GetUserEntries = (pageNumber = 1) => (dispatch, getState) => {
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
      dispatch(SetEntriesError(e))
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
  if (!id) {
    dispatch(SetEntriesComplete())
    return
  }
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
      dispatch(SetEntriesError(e))
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
      dispatch(SetEntry(data))
      dispatch(DeleteReduxEntries(payload.id))
      ReactGA.event({
        category: 'Post Entry',
        action: 'User posted a new entry!',
        value: data.id,
      })
      return { ...data, _shouldPost: false, _lastUpdated: null }
    })
    .catch(e => {
      dispatch(SetEntriesError(e))
    })
}

const UpdateEntry = (id, payload) => dispatch => {
  dispatch(PendingEntries())
  return Axios()
    .patch(`/entries/${id}/update_entry/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(UpdateReduxEntries(data, null))
      ReactGA.event({
        category: 'Update Entry',
        action: 'User updated a new entry!',
        value: data.id,
      })

      return data
    })
    .catch(e => {
      dispatch(SetEntriesError(e))
    })
}

const DeleteEntry = id => dispatch => {
  dispatch(PendingEntries())
  return Axios()
    .delete(`/entries/${id}/`)
    .then(res => {
      dispatch(DeleteReduxEntries(id))
      ReactGA.event({
        category: 'Delete Entry',
        action: 'User deleted a new entry!',
        value: id,
      })
      return res
    })
    .catch(e => {
      if (e.response?.status === 404) {
        dispatch(DeleteReduxEntries(id))
      }
      dispatch(SetEntriesError(e))
    })
}

const SearchUserEntries = search => (dispatch, getState) => {
  dispatch(SetSearchEntries(search, []))
  const { id } = getState().User
  if (!id) return
  return Axios()
    .post(`entries/${id}/search/`, qs.stringify({ search }))
    .then(({ data }) => {
      dispatch(SetSearchEntries(search, data, false))
      ReactGA.event({
        category: 'Search User Entries',
        action: 'User searched for entries!',
        value: search,
      })
      return data
    })
    .catch(e => {
      dispatch(SetSearchEntries(search))
      dispatch(SetEntriesError(e))
    })
}

const DeleteEntryFile = (id, entry_id) => dispatch =>
  Axios()
    .delete(`/files/${id}/`)
    .then(res => {
      dispatch(DeleteEntryFileFromRedux(id, entry_id))
      dispatch(
        SetAlert({
          title: 'Deleted',
          message: 'Entry File',
        }),
      )
      return res
    })
    .catch(e => {
      if (e.response?.status === 401 || e.response?.status === 404) {
        dispatch(DeleteEntryFileFromRedux(id, entry_id))
        dispatch(
          SetAlert({
            title: 'Deleted',
            message: 'Entry File',
          }),
        )

        dispatch(SetEntriesError(e))
      }
    })

const SyncEntries = getEntryMethod => (dispatch, getState) => {
  const {
    User: {
      id: UserId,
      Settings: { offline_mode },
    },
    Entries: { items, filteredItems, isPending },
  } = getState()

  dispatch(PendingEntries())

  const entries = items.concat(filteredItems)

  for (let i = 0, { length } = entries; i < length; i++) {
    let {
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

    date_created = new Date(date_created)
    date_created_by_author = new Date(date_created_by_author)
    date_updated = new Date(date_updated)

    if (_shouldDelete) {
      dispatch(DeleteEntry(id)).then(res =>
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
        views,
      }

      dispatch(PostEntry(postPayload)).then(entry => {
        dispatch(SetAlert({ title: 'Saved', message: 'Entry' }))
        if (!entry) return

        const updateEntryPayload = {
          html,
          tags: getTagStringFromObject(tags),
          people: getTagStringFromObject(people),
        }
        dispatch(ParseBase64(entry.id, cleanObject(updateEntryPayload)))
      })
      continue
    } else if (_lastUpdated) {
      const updateEntryPayload = {
        title,
        date_created_by_author,
        html,
        tags: getTagStringFromObject(tags),
        people: getTagStringFromObject(people),
        rating,
        address,
        latitude,
        longitude,
        is_public,
        //  views,
      }
      dispatch(ParseBase64(id, cleanObject(updateEntryPayload))).then(res =>
        dispatch(SetAlert({ title: 'Updated', message: 'Entry' })),
      )
    }
  }

  if (typeof getEntryMethod === 'function') {
    getEntryMethod().then(res => dispatch(SetAlert({ title: 'Received', message: 'Entry' })))
  }

  dispatch(SetEntriesComplete())
}

export {
  CreateEntryTag,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntry,
  GetUserEntryDetails,
  GetAllUserEntries,
  GetAllUserEntryPages,
  GetUserEntries,
  GetUserEntriesByDate,
  PostEntry,
  UpdateEntry,
  DeleteEntry,
  SearchUserEntries,
  SyncEntries,
  DeleteEntryFile,
}
