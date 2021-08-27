import React from 'react'
import Moment from 'react-moment'
import { EntryDataCellLink, TagsContainer } from 'components'
import { stripHtml, stringMatch, TopKFrequentStrings, formatBytes } from 'utils'

export const mapTableColumnsWithProps = {
  id: (columnProps = {}) => ({
    title: <i className='fas fa-key' />,
    key: 'id',
    width: 60,
    render: ({ id }) => <span className='Center'>{id}</span>,
    filterPlaceholder: '<=',
    filter: 'number',
    ...columnProps,
  }),
  author: (columnProps = {}) => ({
    title: <i className='fas fa-user' />,
    key: 'author',
    width: 80,
    filterPlaceholder: 'Author',
    ...columnProps,
  }),
  title: (columnProps = {}) => ({
    title: <i className='fas fa-heading' />,
    key: 'title',
    width: 180,
    filterPlaceholder: 'Title',
    filter: 'string',
    render: ({ id, title }) => <EntryDataCellLink entryId={id}>{title}</EntryDataCellLink>,
    ...columnProps,
  }),
  html: (columnProps = {}) => ({
    title: <i className='fas fa-keyboard' />,
    key: 'html',
    width: 120,
    filterPlaceholder: 'Body',
    render: ({ html }) => stripHtml(html),
    ...columnProps,
  }),
  tags: (columnProps = {}) => ({
    title: <i className='fas fa-tags' />,
    key: 'tags',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? b.tags.join().localeCompare(a.tags.join())
        : a.tags.join().localeCompare(b.tags.join()),
    filter: searchValue => ({ tags }) =>
      searchValue.split(',').every(value => tags.some(tag => stringMatch(tag.name, value))),

    filterPlaceholder: 'Tags',
    render: ({ tags }) => <TagsContainer tags={tags} />,
    footer: entries => {
      const mostFrequent = TopKFrequentStrings(entries.map(entry => entry.tags).flat(1), 'name')
      return mostFrequent.length > 0 ? mostFrequent[0] : null
    },
    ...columnProps,
  }),
  people: (columnProps = {}) => ({
    title: <i className='fas fa-users' />,
    key: 'people',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? b.people.join().localeCompare(a.people.join())
        : a.people.join().localeCompare(b.people.join()),
    filter: searchValue => ({ people }) =>
      searchValue.split(',').every(value => people.some(person => stringMatch(person.name, value))),
    filterPlaceholder: 'People',
    render: ({ people }) => (
      <TagsContainer tags={people} faIcon='fas fa-user' emptyString='No People...' />
    ),
    footer: entries => {
      const mostFrequent = TopKFrequentStrings(entries.map(entry => entry.people).flat(1), 'name')
      return mostFrequent.length > 0 ? mostFrequent[0] : null
    },
    ...columnProps,
  }),
  address: (columnProps = {}) => ({
    title: <i className='fas fa-map-marker-alt' />,
    key: 'address',
    width: 180,
    filterPlaceholder: 'Address',
    filter: 'string',
    ...columnProps,
  }),
  latitude: (columnProps = {}) => ({
    title: <i className='fas fa-map-marker-alt' />,
    key: 'latitude',
    width: 64,
    render: ({ latitude }) => <span className='Center'>{latitude}</span>,
    filterPlaceholder: '<=',
    filter: 'number',
    ...columnProps,
  }),
  longitude: (columnProps = {}) => ({
    title: <i className='fas fa-map-marker-alt' />,
    key: 'longitude',
    width: 64,
    render: ({ longitude }) => <span className='Center'>{longitude}</span>,
    filterPlaceholder: '<=',
    filter: 'number',
    ...columnProps,
  }),
  date_created: (columnProps = {}) => ({
    title: <i className='fas fa-calendar-day' />,
    key: 'date_created',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b.date_created) - new Date(a.date_created)
        : new Date(a.date_created) - new Date(b.date_created),
    filter: 'date',
    filterPlaceholder: 'Date Created In DB',
    render: ({ date_created }) => <Moment format='D MMM YY hh:mma'>{date_created}</Moment>,
    ...columnProps,
  }),
  date_created_by_author: (columnProps = {}) => ({
    title: <i className='fas fa-calendar-day' />,
    key: 'date_created_by_author',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b.date_created_by_author) - new Date(a.date_created_by_author)
        : new Date(a.date_created_by_author) - new Date(b.date_created_by_author),
    filter: 'date',
    filterPlaceholder: 'Created',
    render: ({ date_created_by_author }) => (
      <Moment format='D MMM YY hh:mma'>{date_created_by_author}</Moment>
    ),
    ...columnProps,
  }),
  date_updated: (columnProps = {}) => ({
    title: <i className='fas fa-pencil-alt' />,
    key: 'date_updated',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b._lastUpdated || b.date_updated) - new Date(a._lastUpdated || a.date_updated)
        : new Date(a._lastUpdated || a.date_updated) - new Date(b._lastUpdated || b.date_updated),
    filter: 'date',
    filterPlaceholder: 'Updated',
    render: ({ _lastUpdated, date_updated }) => (
      <Moment format='D MMM YY hh:mma'>{_lastUpdated || date_updated}</Moment>
    ),
    ...columnProps,
  }),
  views: (columnProps = {}) => ({
    title: <i className='far fa-eye' />,
    key: 'views',
    width: 64,
    render: ({ views }) => <span className='Center'>{views}</span>,
    filterPlaceholder: '<=',
    footer: entries => entries.reduce((count, { views }) => count + views, 0),
    ...columnProps,
  }),
  rating: (columnProps = {}) => ({
    title: <i className='fas fa-star' />,
    key: 'rating',
    width: 64,
    render: ({ rating }) => <span className='ml-2'>{rating}</span>,
    filterPlaceholder: '<=',
    filter: 'number',
    footer: entries =>
      (entries.reduce((count, { rating }) => count + rating, 0) / entries.length).toFixed(2),
    ...columnProps,
  }),
  EntryFiles: (columnProps = {}) => ({
    title: <i className='fas fa-photo-video' />,
    key: 'EntryFiles',
    width: 64,
    render: ({ EntryFiles }) => <span className='Center'>{EntryFiles?.length || 0}</span>,
    sort: (a, b, sortUp) => {
      const aLength = a.EntryFiles.length
      const bLength = b.EntryFiles.length
      return sortUp ? bLength - aLength : aLength - bLength
    },
    filter: searchValue => ({ EntryFiles }) => EntryFiles.length >= searchValue,
    filterPlaceholder: '<=',
    footer: entries => entries.reduce((count, { EntryFiles }) => count + EntryFiles.length, 0),
    ...columnProps,
  }),
  is_public: (columnProps = {}) => ({
    title: <i className='fas fa-lock-open' />,
    key: 'is_public',
    width: 40,
    render: ({ is_public }) => <span className='Center'>{is_public ? 'Yes' : 'No'}</span>,
    footer: entries => entries.reduce((count, { is_public }) => count + is_public, 0),
    ...columnProps,
  }),
  size: (columnProps = {}) => ({
    title: <i className='fas fa-hdd' />,
    key: 'id',
    width: 80,
    sort: (a, b, sortUp) => {
      const aSize = a.size
      const bSize = b.size
      return sortUp ? bSize - aSize : aSize - bSize
    },
    filter: searchValue => ({ size }) => stringMatch(formatBytes(size), searchValue),
    filterPlaceholder: 'Size',
    render: ({ size }) => formatBytes(size),
    footer: entries => formatBytes(entries.reduce((count, { size }) => count + size, 0)),
    ...columnProps,
  }),
  // Redux Only
  _size: (columnProps = {}) => ({
    title: <i className='fas fa-hdd' />,
    key: 'id',
    width: 80,
    sort: (a, b, sortUp) => {
      const aSize = a._size
      const bSize = b._size
      return sortUp ? bSize - aSize : aSize - bSize
    },
    filter: searchValue => ({ _size }) => stringMatch(formatBytes(_size), searchValue),
    filterPlaceholder: 'Size',
    render: ({ _size }) => formatBytes(_size),
    footer: entries => formatBytes(entries.reduce((count, { _size }) => count + _size, 0)),
    ...columnProps,
  }),
  _shouldDelete: (columnProps = {}) => ({
    title: <i className='fas fa-user' />,
    key: 'author',
    width: 80,
    filterPlaceholder: 'Author',
    ...columnProps,
  }),
  _shouldPost: (columnProps = {}) => ({
    title: <i className='fas fa-lock-open' />,
    key: 'is_public',
    width: 40,
    render: ({ is_public }) => <span className='Center'>{is_public ? 'Yes' : 'No'}</span>,
    footer: entries => entries.reduce((count, { is_public }) => count + is_public, 0),
    ...columnProps,
  }),
  _lastUpdated: (columnProps = {}) => ({
    title: <i className='fas fa-pencil-alt' />,
    key: '_lastUpdated',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b._lastUpdated || b.date_updated) - new Date(a._lastUpdated || a.date_updated)
        : new Date(a._lastUpdated || a.date_updated) - new Date(b._lastUpdated || b.date_updated),
    filter: 'date',
    filterPlaceholder: 'Updated',
    render: ({ _lastUpdated, date_updated }) => (
      <Moment format='D MMM YY hh:mma'>{_lastUpdated || date_updated}</Moment>
    ),
    ...columnProps,
  }),
  _image: (columnProps = {}) => ({
    title: <i className='far fa-images' />,
    key: '_image',
    width: 40,
    render: ({ _image }) => <span className='Center'>{_image ? 'Yes' : 'No'}</span>,
    footer: entries => entries.reduce((count, { _image }) => count + _image, 0),
    ...columnProps,
  }),
  _calendarDate: (columnProps = {}) => ({
    title: <i className='fas fa-pencil-alt' />,
    key: '_calendarDate',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b._calendarDate || b._lastUpdated) - new Date(a._calendarDate || a._lastUpdated)
        : new Date(a._calendarDate || a._lastUpdated) - new Date(b._calendarDate || b._lastUpdated),
    filter: 'date',
    filterPlaceholder: 'Updated',
    render: ({ _calendarDate, _lastUpdated }) => (
      <Moment format='D MMM YY hh:mma'>{_calendarDate || _lastUpdated}</Moment>
    ),
    ...columnProps,
  }),
}
