import { EntriesActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { handleFilterEntries } from "./utils"
import { getStringBytes, mergeJson } from "../../../utils"
import { RouteMap } from "../../../redux/router/actions"
import * as AwsImages from "../../../images/AWS"
const { ...entryFiles } = AwsImages

const LINK_TO_SIGN_UP = `${RouteMap.SIGNUP}`

const BASE_JOURNAL_ENTRY_ID = "Entry"

const DEFAULT_JOUNRAL_ENTRY_ID = `${BASE_JOURNAL_ENTRY_ID}-0`

const DEFAULT_ENTRY_FILES = Object.keys(entryFiles).map((name, id) => ({
  id,
  file_type: "image/jpeg",
  name,
  size: 870,
  url: entryFiles[name],
  entry_id: DEFAULT_JOUNRAL_ENTRY_ID,
}))

const defaultEntry = {
  author: null,
  id: DEFAULT_JOUNRAL_ENTRY_ID,
  tags: [
    {
      name: "Excited",
    },
    {
      name: "Inspired",
    },
  ],
  people: [
    {
      name: "Me",
    },
  ],
  EntryFiles: DEFAULT_ENTRY_FILES,
  title: "My First Journal Entry",
  html: `<p class="ql-align-center"><img src="${entryFiles.Logo}" width="140"></p><br><p>After I've installed Astral Tree today, I will make a diary entry every day from now on. In case I forget to make an entry, the app will remind me with a notification in the evening. Besides pictures, videos, audio recordings or other files, I can add a location, tags or people to my journal entries.</p><p><br></p><p>If I <a href="${LINK_TO_SIGN_UP}" rel="noopener noreferrer" target="_blank">sign up</a>, my journal entries will be synced across all my devices. I am already looking forward to revisiting all those memories in a few months or years.</p>`,
  date_created: new Date(),
  date_created_by_author: new Date(),
  date_updated: new Date(),
  views: 0,
  rating: 5,
  address: null,
  latitude: null,
  longitude: null,
  is_public: false,

  // Redux Only
  _shouldDelete: false,
  _shouldPost: true,
  _lastUpdated: null,
}

const FIRST_JOUNRAL_ENTRY = {
  ...defaultEntry,
  _size: getStringBytes(defaultEntry),
}

const DEFAULT_STATE_ENTRIES = {
  count: null,
  next: null,
  previous: null,
  items: [FIRST_JOUNRAL_ENTRY],
  filteredItems: [],
  isPending: false,
  error: null,
  search: "",
  EntryTags: [
    {
      name: "Family",
    },
    {
      name: "Friends",
    },
    {
      name: "Document",
    },
    {
      name: "Link",
    },
    {
      name: "Music",
    },
    {
      name: "Vacation",
    },
    {
      name: "Video",
    },
  ],
  EntryPeople: [
    {
      name: "Me",
    },
  ],
  sortMap: {
    date_updated: true,
  },
  filterMap: {},
}

const Entries = (state = DEFAULT_STATE_ENTRIES, action) => {
  const { id, type, payload, search } = action
  switch (type) {
    case EntriesActionTypes.ENTRIES_SET_TAGS:
      return { ...state, EntryTags: payload }

    case EntriesActionTypes.ENTRIES_SET_PEOPLE:
      return { ...state, EntryPeople: payload }

    case EntriesActionTypes.ENTRIES_SEARCH_FILTER:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), payload),
          search
        ),
        search,
      }

    case EntriesActionTypes.ENTRIES_PENDING:
      return { ...state, isPending: true }

    case EntriesActionTypes.ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }

    case EntriesActionTypes.ENTRIES_COMPLETE:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }

    case EntriesActionTypes.ENTRY_IMPORT:
      return {
        ...state,
        items: mergeJson(state.items, payload),
        error: DEFAULT_STATE_ENTRIES.error,
      }

    case EntriesActionTypes.ENTRIES_SET:
      const { count, next, previous, results } = payload
      return {
        ...state,
        count,
        next,
        previous,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), results),
          state.search
        ),
      }

    case EntriesActionTypes.ENTRIES_SET_BY_DATE:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), payload),
          state.search
        ),
      }

    case EntriesActionTypes.ENTRY_SET:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), [payload]),
          state.search
        ),
      }

    case EntriesActionTypes.ENTRY_UPDATE:
      return {
        ...state,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
        ...handleFilterEntries(
          state.items.concat(state.filteredItems).map((item) => {
            if (item.id === id) {
              const mergedItem = {
                ...item,
                ...payload,
              }
              const newItem = {
                ...mergedItem,
                _size: getStringBytes(mergedItem),
              }
              return newItem
            } else return item
          }),
          state.search
        ),
      }

    case EntriesActionTypes.ENTRY_DELETE:
      const hasArrayOfIds = Array.isArray(payload)
      const filterCondition = (item) =>
        hasArrayOfIds ? payload.includes(item.id) : item.id != id
      return {
        ...state,
        ...handleFilterEntries(
          state.items.concat(state.filteredItems).filter(filterCondition),
          state.search
        ),
      }

    case EntriesActionTypes.ENTRIES_RESET_SORT_AND_FILTER_MAP:
      return {
        ...state,
        sortMap: DEFAULT_STATE_ENTRIES.sortMap,
        filterMap: DEFAULT_STATE_ENTRIES.filterMap,
      }

    case EntriesActionTypes.ENTRIES_SET_SORT_MAP:
      const { sortKey, sortUp } = payload
      return {
        ...state,
        sortMap: { ...state.sortMap, [sortKey]: sortUp },
      }

    case EntriesActionTypes.ENTRIES_SET_FILTER_MAP:
      const { filterKey, searchValue } = payload
      return {
        ...state,
        filterMap: {
          ...state.filterMap,
          [filterKey]: searchValue,
        },
      }

    case AppActionTypes.REDUX_RESET:
      return { ...DEFAULT_STATE_ENTRIES, items: [] }

    default:
      return state
  }
}

export {
  BASE_JOURNAL_ENTRY_ID,
  DEFAULT_ENTRY_FILES,
  DEFAULT_STATE_ENTRIES,
  Entries,
}
