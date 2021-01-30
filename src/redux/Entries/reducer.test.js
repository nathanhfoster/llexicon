import { Entries as EntriesReducer, DEFAULT_STATE_ENTRIES } from './reducer'
import {
  mockEntries,
  getRandomEntry,
  mockTagsOrPeople,
  getRandomTagOrPerson,
} from 'redux/testUtils'
import actions from '../actionTypes'
import faker, { random } from 'faker'
import { isAFunction, getStringBytes } from 'utils'
import { handleFilterEntries, mergeJson, getMostRecent } from './utils'
const {
  number,
  float,
  arrayElement,
  arrayElements,
  objectElement,
  uuid,
  boolean,
  word,
  words,
  image,
  locale,
  alpha,
  alphaNumeric,
  hexaDecimal,
} = random
const mockString = word()
const mockEntryId = uuid()
const mockNumber = number()
const mockBoolean = boolean()
const mockEntry = getRandomEntry({ id: mockEntryId })

const items = [...mockEntries, mockEntry]

const mockSelectedItemsMap = items.slice(Math.floor(items.length / 4)).reduce((acc, { id }) => {
  acc[id] = true
  return acc
}, {})

const initialState = {
  ...DEFAULT_STATE_ENTRIES,
  items,
  //   item: mockEntry,
  selectedItemsMap: mockSelectedItemsMap,
}

let nextItem
let nextItems

const Tests = [
  {
    action: { type: 'RETURNING_INITIAL_STATE' },
    expectedState: initialState,
  },
  {
    action: { type: actions.ENTRY_SET, payload: { id: mockEntryId, title: mockString } },
    expectedState: (state, { payload }) => {
      nextItem = { ...state.item, ...payload, isPending: false }
      nextItem = { ...nextItem, _size: getStringBytes(nextItem) }

      return {
        ...initialState,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), [nextItem]),
          state.search,
        ),
        item: {
          ...(!state.item.id || nextItem.id == state.item.id
            ? getMostRecent(state.item, nextItem)
            : state.item),
          isPending: false,
        },
        isPending: false,
      }
    },
  },
  {
    action: { type: actions.ENTRY_PENDING },
    expectedState: {
      ...initialState,
      item: {
        ...initialState.item,
        isPending: true,
      },
    },
  },
  {
    action: { type: actions.ENTRY_CLEAR },
    expectedState: {
      ...initialState,
      item: DEFAULT_STATE_ENTRIES.item,
    },
  },
  {
    action: {
      type: actions.ENTRIES_CLEAR,
    },
    expectedState: {
      ...initialState,
      item: DEFAULT_STATE_ENTRIES.item,
      items: [],
      filteredItems: [],
      selectedItemsMap: DEFAULT_STATE_ENTRIES.selectedItemsMap,
    },
  },
  {
    action: { type: actions.ENTRIES_PENDING },
    expectedState: {
      ...initialState,
      isPending: true,
    },
  },
  {
    action: state => {
      nextItems = new Array(5).fill().map(e => getRandomEntry())
      return {
        type: actions.ENTRIES_SET,
        payload: { count: mockNumber, next: mockString, previous: mockString, results: nextItems },
      }
    },
    expectedState: (state, { payload }) => {
      const { count, next, previous, results } = payload
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), results || payload),
          state.search,
        ),
        count: count || state.count,
        next: next || state.next,
        previous: previous || state.previous,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
      }
    },
  },
  {
    action: state => {
      nextItems = mockTagsOrPeople
      return { type: actions.ENTRIES_SET_TAGS, payload: nextItems }
    },
    expectedState: (state, { payload }) => {
      return { ...state, EntryTags: mergeJson(state.EntryTags, payload, 'name') }
    },
  },
  {
    action: state => {
      nextItems = mockTagsOrPeople
      return { type: actions.ENTRIES_SET_PEOPLE, payload: nextItems }
    },
    expectedState: (state, { payload }) => {
      return { ...state, EntryPeople: payload }
    },
  },
  {
    action: state => {
      nextItems = new Array(5).fill().map(e => getRandomEntry())
      return {
        type: actions.ENTRIES_SEARCH_FILTER,
        state: {
          ...initialState,
          item: mockEntry,
        },
        search: mockString,
        isPending: mockBoolean,
        payload: nextItems,
      }
    },
    expectedState: (state, { search, isPending, payload }) => {
      if (!payload) return { ...state, search }

      return {
        ...state,
        ...handleFilterEntries(mergeJson(state.items.concat(state.filteredItems), payload), search),
        search,
        isPending,
      }
    },
  },
  {
    action: {
      type: actions.ENTRIES_SET_SORT_MAP,
      payload: { sortKey: mockString, sortUp: mockString },
    },
    expectedState: {
      ...initialState,
      sortMap: { ...initialState.sortMap, [mockString]: mockString },
    },
  },
  {
    action: {
      type: actions.ENTRIES_SET_FILTER_MAP,
      payload: { filterKey: mockString, searchValue: mockString },
    },
    expectedState: {
      ...initialState,
      filterMap: {
        ...initialState.filterMap,
        [mockString]: mockString,
      },
    },
  },
  {
    action: {
      type: actions.REDUX_RESET,
    },
    expectedState: (state, action) => {
      return {
        ...DEFAULT_STATE_ENTRIES,
        items: state.items
          .concat(state.filteredItems)
          .filter(
            ({ _shouldDelete, _shouldPost, _lastUpdated }) =>
              _shouldDelete || _shouldPost || _lastUpdated,
          ),
      }
    },
  },
  {
    action: state => {
      nextItems = new Array(5).fill().map(e => getRandomEntry())
      return {
        type: actions.LOAD_PERSISTED_STATE,
        payload: { Entries: { items: nextItems, filteredItems: [] } },
      }
    },
    expectedState: (state, { payload }) => {
      nextItems =
        payload.Entries?.items.concat(payload.Entries?.filteredItems) ||
        state.items.concat(state.filteredItems)

      return {
        ...state,
        ...payload.Entries,
        ...handleFilterEntries(nextItems, payload.Entries?.search || state.search),
        item: DEFAULT_STATE_ENTRIES.item,
        isPending: DEFAULT_STATE_ENTRIES.isPending,
        error: DEFAULT_STATE_ENTRIES.error,
        // search: DEFAULT_STATE_ENTRIES.search
      }
    },
  },
]

describe('Entries reducer', () => {
  const runTest = ({ state = initialState, action, expectedState }, testNumber) => {
    const resolvedAction = isAFunction(action) ? action(state) : action
    const resolvedExpectedState = isAFunction(expectedState)
      ? expectedState(state, resolvedAction)
      : expectedState
    return it(`Test ${testNumber} should handle ${resolvedAction.type} action type`, () => {
      expect(EntriesReducer(state, resolvedAction)).toEqual(resolvedExpectedState)
    })
  }

  Tests.forEach((test, i) => runTest(test, i))
})
