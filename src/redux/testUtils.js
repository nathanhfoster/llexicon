import React, { Suspense } from 'react'
import { Router } from 'react-router-dom'
import { history } from 'redux/router/reducer'
import { render as rtlRender } from '@testing-library/react'
import { createStore as reduxCreateStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { applyMiddleware } from 'redux'
import {
  RootReducer,
  DEFAULT_STATE_ADMIN,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_MAP,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_WINDOW,
} from './RootReducer'
import { getRandomInt } from 'utils'
import { date, random } from 'faker'
// re-export everything
export * from '@testing-library/react'
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

const emptyEntryValueMap = [null, undefined, '', 'undefined', NaN, false, 'false', 0, '0']

const NUMBER_OF_MOCK_ENTRIES = 10

export const getRandomEntry = propsToOverWrite => ({
  id: uuid(),
  author: number(),
  title: word(),
  html: `<p>${word()}</p>`,
  tags: [
    {
      name: uuid(),
      //   date_created: date.past(),
      //   date_updated: date.past(),
      //   authors: [number()],
    },
  ],
  people: [
    {
      name: uuid(),
      //   date_created: date.past(),
      //   date_updated: date.past(),
      //   authors: [number()],
    },
  ],
  address: word(),
  latitude: float(),
  longitude: float(),
  date_created: date.past(),
  date_created_by_author: date.past(),
  date_updated: date.past(),
  views: number(),
  rating: getRandomInt(0, 5),
  EntryFiles: [
    {
      id: uuid(),
      file_type: word(),
      name: word(),
      size: number(),
      url: word(),
      date_created: date.past(),
      date_updated: date.past(),
      date_modified: date.past(),
      entry_id: uuid(),
    },
  ],
  is_public: boolean(),
  size: number(),
  // Redux Only
  _size: number(),
  _shouldDelete: boolean(),
  _shouldPost: boolean(),
  _lastUpdated: date.past(),
  _image: word(),
  _calendarDate: date.past(),
  ...(propsToOverWrite && {
    ...propsToOverWrite,
  }),
})

export const mockEntries = new Array(NUMBER_OF_MOCK_ENTRIES).fill().map(e => getRandomEntry())

export const badDataEntries = emptyEntryValueMap.map((e, i) =>
  getRandomEntry({
    id: e,
    author: e,
    title: e,
    html: e,
    tags: e,
    people: e,
    address: e,
    latitude: e,
    longitude: e,
    date_created: e,
    date_created_by_author: e,
    date_updated: e,
    views: e,
    rating: e,
    EntryFiles: e,
    is_public: e,
    size: e,
    // Redux Only
    _size: e,
    _shouldDelete: e,
    _shouldPost: e,
    _lastUpdated: e,
    _image: e,
    _calendarDate: e,
  }),
)

export const getRandomTagOrPerson = propsToOverWrite => ({
  name: word(),
  // date_created: date.past(),
  // date_updated: date.past(),
  // authors: [number()],
  ...(propsToOverWrite && {
    ...propsToOverWrite,
  }),
})

export const mockTagsOrPeople = new Array(NUMBER_OF_MOCK_ENTRIES)
  .fill()
  .map(e => getRandomTagOrPerson())

export const mockEntriesWithBadData = mockEntries.concat(badDataEntries)

export const INITIAL_STATE = {
  Admin: DEFAULT_STATE_ADMIN,
  Alerts: DEFAULT_STATE_ALERTS,
  App: DEFAULT_STATE_APP,
  Calendar: DEFAULT_STATE_CALENDAR,
  Entries: { ...DEFAULT_STATE_ENTRIES, items: mockEntries },
  Map: DEFAULT_STATE_MAP,
  User: DEFAULT_STATE_USER,
  TextEditor: DEFAULT_STATE_TEXT_EDITOR,
  Window: DEFAULT_STATE_WINDOW,
}

const middleWares = applyMiddleware(thunk)
export const createStore = (initialState = INITIAL_STATE, reducers = RootReducer) =>
  middleWares(reduxCreateStore)(reducers, initialState)

// override render method
export const render = (
  ui,
  { initialState, reducers, store = createStore(initialState, reducers), ...renderOptions } = {},
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <Suspense fallback={<div />}>
        <Router history={history}>{children}</Router>
      </Suspense>
    </Provider>
  )

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
