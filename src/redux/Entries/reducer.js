import { EntriesActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import {
  LINK_TO_SIGN_UP,
  BASE_JOURNAL_ENTRY_ID,
  DEFAULT_JOUNRAL_ENTRY_ID,
  mergeJson,
  getMostRecent,
  handleFilterEntries,
} from "./utils"
import { getStringBytes, arrayToObject } from "../../utils"
import { isObject } from "utils"
import * as AwsImages from "../../images/AWS"
const {
  ENTRY_SET,
  ENTRIES_UPDATE,
  ENTRIES_SELECTED,
  ENTRY_CLEAR,
  ENTRIES_CLEAR,
  ENTRIES_DELETE,
  ENTRIES_SET_TAGS,
  ENTRIES_SET_PEOPLE,
  ENTRIES_PENDING,
  ENTRY_PENDING,
  ENTRIES_ERROR,
  ENTRIES_ERROR_CLEAR,
  ENTRIES_COMPLETE,
  ENTRIES_SET,
  ENTRIES_SEARCH_FILTER,
  ENTRIES_SET_SORT_MAP,
  ENTRIES_SET_FILTER_MAP,
  ENTRIES_RESET_SORT_AND_FILTER_MAP,
  ENTRIES_TOGGLE_SHOW_ONLY_PUBLIC,
} = EntriesActionTypes

const { ...entryFiles } = AwsImages

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
  item: { id: null, isPending: false },
  items: [FIRST_JOUNRAL_ENTRY],
  selectedItemsMap: {},
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
  showOnlyPublic: false,
}

const Entries = (state = DEFAULT_STATE_ENTRIES, action) => {
  const { type, payload, search, isPending } = action

  let nextItem
  let nextItems = []
  let nextSelectedItemsMap = {}

  switch (type) {
    case ENTRIES_TOGGLE_SHOW_ONLY_PUBLIC:
      return { ...state, showOnlyPublic: !state.showOnlyPublic }

    case ENTRIES_SET_TAGS:
      return {
        ...state,
        EntryTags: mergeJson(state.EntryTags, payload, "name"),
      }

    case ENTRIES_SET_PEOPLE:
      return { ...state, EntryPeople: payload }

    case ENTRIES_SEARCH_FILTER:
      if (!payload) return { ...state, search }
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), payload),
          search
        ),
        search,
        isPending,
      }

    case ENTRIES_PENDING:
      return { ...state, isPending: true }

    case ENTRY_PENDING:
      return { ...state, item: { ...state.item, isPending: true } }

    case ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }

    case ENTRIES_ERROR_CLEAR:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }

    case ENTRIES_COMPLETE:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }

    case ENTRY_CLEAR:
      return { ...state, item: DEFAULT_STATE_ENTRIES.item }

    case ENTRIES_CLEAR:
      return {
        ...state,
        item: DEFAULT_STATE_ENTRIES.item,
        items: [],
        filteredItems: [],
      }

    case ENTRIES_SET:
      const { count, next, previous, results } = payload
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(
            state.items.concat(state.filteredItems),
            results || payload
          ),
          state.search
        ),
        count: count || state.count,
        next: next || state.next,
        previous: previous || state.previous,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
      }

    case ENTRY_SET:
      nextItem = { ...state.item, ...payload, isPending: false }
      nextItem = { ...nextItem, _size: getStringBytes(nextItem) }

      return {
        ...state,
        item:
          !state.item.id || nextItem.id == state.item.id
            ? getMostRecent(state.item, nextItem)
            : state.item,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), [nextItem]),
          state.search
        ),
        isPending: false,
      }

    case ENTRIES_UPDATE:
      nextSelectedItemsMap = { ...state.nextSelectedItemsMap }
      nextItems = state.items.concat(state.filteredItems).map((e) => {
        if (payload.id == e.id) {
          nextItem = { ...e, ...payload }
          nextItem = {
            ...nextItem,
            _size: getStringBytes(nextItem),
          }
        } else if (payload[e.id]) {
          nextItem = { ...e, ...payload[e.id] }
          nextItem = {
            ...nextItem,
            _size: getStringBytes(nextItem),
          }
        }

        if (
          nextItem &&
          nextSelectedItemsMap[nextItem.id] &&
          nextItem._shouldDelete
        ) {
          delete nextSelectedItemsMap[nextItem.id]
        }

        return nextItem || e
      })

      return {
        ...state,
        ...handleFilterEntries(nextItems, state.search),
        selectedItemsMap: nextSelectedItemsMap,
        item:
          payload?.id == state.item.id
            ? getMostRecent(state.item, { ...state.item, ...payload })
            : payload[state.item.id]
            ? getMostRecent(state.item, {
                ...state.item,
                ...payload[state.item.id],
              })
            : state.item,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
      }

    case ENTRIES_SELECTED:
      return {
        ...state,
        selectedItemsMap: payload,
      }

    case ENTRIES_DELETE:
      nextSelectedItemsMap = { ...state.nextSelectedItemsMap }
      return {
        ...state,
        ...handleFilterEntries(
          state.items.concat(state.filteredItems).filter(({ id }) => {
            if (nextSelectedItemsMap[id]) {
              delete nextSelectedItemsMap[id]
            }
            return isObject(payload)
              ? payload[id] === undefined
              : id !== payload
          }),
          state.search
        ),
        selectedItemsMap: nextSelectedItemsMap,
      }

    case ENTRIES_RESET_SORT_AND_FILTER_MAP:
      return {
        ...state,
        sortMap: DEFAULT_STATE_ENTRIES.sortMap,
        filterMap: DEFAULT_STATE_ENTRIES.filterMap,
        item: DEFAULT_STATE_ENTRIES.item,
      }

    case ENTRIES_SET_SORT_MAP:
      const { sortKey, sortUp } = payload
      return {
        ...state,
        sortMap: { ...state.sortMap, [sortKey]: sortUp },
      }

    case ENTRIES_SET_FILTER_MAP:
      const { filterKey, searchValue } = payload
      return {
        ...state,
        filterMap: {
          ...state.filterMap,
          [filterKey]: searchValue,
        },
      }

    case AppActionTypes.REDUX_RESET:
      return {
        ...DEFAULT_STATE_ENTRIES,
        items: state.items
          .concat(state.filteredItems)
          .filter(
            ({ _shouldDelete, _shouldPost, _lastUpdated }) =>
              _shouldDelete || _shouldPost || _lastUpdated
          ),
      }

    case AppActionTypes.LOAD_PERSISTED_STATE:
      nextItems =
        payload.Entries?.items.concat(payload.Entries?.filteredItems) ||
        state.items.concat(state.filteredItems)

      return {
        ...state,
        ...payload.Entries,
        ...handleFilterEntries(
          nextItems,
          payload.Entries?.search || state.search
        ),
        item: DEFAULT_STATE_ENTRIES.item,
        isPending: DEFAULT_STATE_ENTRIES.isPending,
        error: DEFAULT_STATE_ENTRIES.error,
        // search: DEFAULT_STATE_ENTRIES.search
      }

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
