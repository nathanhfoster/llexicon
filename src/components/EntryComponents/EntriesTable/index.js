import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { stripHtml, TopKFrequentStrings } from 'utils'
import Moment from 'react-moment'
import { TagsContainer, BasicTable, EntryDataCellLink } from '../../'
import { GoToEntryDetail } from 'redux/router/actions'
import { EntryPropType, EntriesPropTypes } from 'redux/Entries/propTypes'
import { stringMatch, formatBytes } from 'utils'
import { SetEntriesSortMap, SetEntriesFilterMap, SelectEntries } from 'redux/Entries/actions'

import { DEFAULT_STATE_ENTRIES } from 'redux/Entries/reducer'

import {
  ButtonExportEntries,
  ButtonEditEntries,
  ButtonShareEntries,
  ButtonClearSelectedEntries,
  ButtonDeleteEntries,
} from 'components'
import { ButtonGroup } from 'reactstrap'
import './styles.css'

const mapStateToProps = ({ Entries: { showOnlyPublic } }) => ({
  showOnlyPublic,
})

const mapDispatchToProps = {
  SetEntriesSortMap,
  SetEntriesFilterMap,
  SelectEntries,
}

const EntriesTable = ({
  showOnlyPublic,
  SetEntriesSortMap,
  SetEntriesFilterMap,
  SelectEntries,
  entries,
  sortMap,
  filterMap,
  pageSize,
}) => {
  const viewableEntries = useMemo(
    () =>
      entries.filter(({ _shouldDelete, is_public }) =>
        showOnlyPublic ? is_public : !_shouldDelete,
      ),
    [showOnlyPublic, entries],
  )

  const handleSortCallback = useCallback((sortKey, sortUp) => SetEntriesSortMap(sortKey, sortUp), [
    SetEntriesSortMap,
  ])

  const handleFilterCallback = useCallback(
    (filterKey, searchValue) => SetEntriesFilterMap(filterKey, searchValue),
    [SetEntriesFilterMap],
  )

  const tableColumns = useMemo(
    () => [
      {
        title: <i className='fas fa-heading' />,
        key: 'title',
        width: 180,
        filterPlaceholder: 'Title',
        defaultSortValue: sortMap.title,
        defaultFilterValue: filterMap.title,
        render: ({ id, title }) => <EntryDataCellLink entryId={id}>{title}</EntryDataCellLink>,
      },
      {
        title: <i className='fas fa-keyboard' />,
        key: 'html',
        width: 90,
        defaultSortValue: sortMap.html,
        filterPlaceholder: 'Body',
        defaultFilterValue: filterMap.html,
        render: ({ html }) => stripHtml(html),
      },
      {
        title: <i className='fas fa-tags' />,
        key: 'tags',
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.tags.join().localeCompare(a.tags.join())
            : a.tags.join().localeCompare(b.tags.join()),
        defaultSortValue: sortMap.tags,
        filter: searchValue => ({ tags }) =>
          searchValue.split(',').every(value => tags.some(tag => stringMatch(tag.name, value))),

        defaultFilterValue: filterMap.tags,
        filterPlaceholder: 'Tags',
        render: ({ tags }) => <TagsContainer tags={tags} />,
        footer: entries => {
          const mostFrequent = TopKFrequentStrings(entries.map(entry => entry.tags).flat(1), 'name')
          return mostFrequent.length > 0 ? mostFrequent[0] : null
        },
      },
      {
        title: <i className='fas fa-users' />,
        key: 'people',
        width: 110,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.people.join().localeCompare(a.people.join())
            : a.people.join().localeCompare(b.people.join()),
        defaultSortValue: sortMap.people,
        filter: searchValue => ({ people }) =>
          searchValue
            .split(',')
            .every(value => people.some(person => stringMatch(person.name, value))),
        defaultFilterValue: filterMap.people,
        filterPlaceholder: 'People',
        render: ({ people }) => (
          <TagsContainer tags={people} faIcon='fas fa-user' emptyString='No People...' />
        ),
        footer: entries => {
          const mostFrequent = TopKFrequentStrings(
            entries.map(entry => entry.people).flat(1),
            'name',
          )
          return mostFrequent.length > 0 ? mostFrequent[0] : null
        },
      },
      {
        title: <i className='fas fa-map-marker-alt' />,
        key: 'address',
        width: 180,
        defaultSortValue: sortMap.address,
        filterPlaceholder: 'Address',
        defaultFilterValue: filterMap.address,
      },
      {
        title: <i className='fas fa-calendar-day' />,
        key: 'date_created_by_author',
        width: 100,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b.date_created_by_author) - new Date(a.date_created_by_author)
            : new Date(a.date_created_by_author) - new Date(b.date_created_by_author),
        defaultSortValue: sortMap.date_created_by_author,
        filter: 'date',
        filterPlaceholder: 'Created',
        defaultFilterValue: filterMap.date_created_by_author,
        render: ({ date_created_by_author }) => (
          <Moment format='D MMM YY hh:mma'>{date_created_by_author}</Moment>
        ),
      },
      {
        title: <i className='fas fa-pencil-alt' />,
        key: 'date_updated',
        width: 130,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b._lastUpdated || b.date_updated) -
              new Date(a._lastUpdated || a.date_updated)
            : new Date(a._lastUpdated || a.date_updated) -
              new Date(b._lastUpdated || b.date_updated),
        defaultSortValue: sortMap.date_updated,
        filter: 'date',
        filterPlaceholder: 'Updated',
        defaultFilterValue: filterMap.date_updated,
        render: ({ _lastUpdated, date_updated }) => (
          <Moment format='D MMM YY hh:mma'>{_lastUpdated || date_updated}</Moment>
        ),
      },

      {
        title: <i className='far fa-eye' />,
        key: 'views',
        width: 50,
        render: ({ views }) => <span className='Center'>{views}</span>,
        defaultSortValue: sortMap.views,
        filterPlaceholder: '<=',
        defaultFilterValue: filterMap.views,
        footer: entries => entries.reduce((count, { views }) => count + views, 0),
      },
      {
        title: <i className='fas fa-star' />,
        key: 'rating',
        width: 50,
        render: ({ rating }) => <span className='ml-2'>{rating}</span>,
        footer: entries => {
          let validItems = 0
          const ratingSum = entries.reduce((count, { rating }) => {
            if (rating !== 0) {
              count += rating
              validItems += 1
            }
            return count
          }, 0)
          const averageRating = (ratingSum / validItems).toFixed(1)

          return <span>{averageRating > 0 ? averageRating : 0}</span>
        },
        defaultSortValue: sortMap.rating,
        filterPlaceholder: '<=',
        defaultFilterValue: filterMap.rating,
        footer: entries =>
          (entries.reduce((count, { rating }) => count + rating, 0) / entries.length).toFixed(2),
      },
      {
        title: <i className='fas fa-photo-video' />,
        key: 'EntryFiles',
        width: 50,
        render: ({ EntryFiles }) => <span className='Center'>{EntryFiles.length}</span>,
        sort: (a, b, sortUp) => {
          const aLength = a.EntryFiles.length
          const bLength = b.EntryFiles.length
          return sortUp ? bLength - aLength : aLength - bLength
        },
        defaultSortValue: sortMap.EntryFiles,
        filter: searchValue => ({ EntryFiles }) => EntryFiles.length >= searchValue,
        filterPlaceholder: '<=',
        defaultFilterValue: filterMap.EntryFiles,
        footer: entries => entries.reduce((count, { EntryFiles }) => count + EntryFiles.length, 0),
      },
      {
        title: <i className='fas fa-lock-open' />,
        key: 'is_public',
        width: 40,
        render: ({ is_public }) => <span className='Center'>{is_public ? 'Yes' : 'No'}</span>,
        defaultSortValue: sortMap.is_public,
        defaultFilterValue: filterMap.is_public,
        footer: entries => entries.reduce((count, { is_public }) => count + is_public, 0),
      },
      {
        title: <i className='fas fa-hdd' />,
        key: 'id',
        width: 65,
        sort: (a, b, sortUp) => {
          const aSize = a.size || a._size
          const bSize = b.size || b._size
          return sortUp ? bSize - aSize : aSize - bSize
        },
        defaultSortValue: sortMap.id,
        filter: searchValue => ({ size, _size }) =>
          stringMatch(formatBytes(size || _size), searchValue),
        defaultFilterValue: filterMap.id,
        filterPlaceholder: 'Size',
        render: ({ size, _size }) => formatBytes(size || _size),
        footer: entries =>
          formatBytes(entries.reduce((count, { size, _size }) => count + size || _size, 0)),
      },
    ],
    [filterMap, sortMap],
  )

  const onRowClick = useCallback(item => GoToEntryDetail(item.id), [])

  const handleActionMenuCallback = useCallback(
    selectedEntries => {
      const selectedEntriesMap = selectedEntries.reduce((acc, e) => {
        acc[e.id] = e
        return acc
      }, {})
      SelectEntries(selectedEntriesMap)
    },
    [entries],
  )

  const selectedEntries = useMemo(() => entries.filter(({ _isSelected }) => _isSelected), [entries])

  return (
    <BasicTable
      sortable
      filterable
      pageSize={pageSize}
      columns={tableColumns}
      dataDisplayName='Entries'
      data={viewableEntries}
      onRowClick={onRowClick}
      onSortCallback={handleSortCallback}
      onFilterCallback={handleFilterCallback}
      actionMenuCallback={handleActionMenuCallback}
    >
      <ButtonGroup className='BasicTableActions'>
        <ButtonExportEntries entries={selectedEntries} />
        <ButtonEditEntries entries={selectedEntries} />
        <ButtonShareEntries entries={selectedEntries} />
        <ButtonClearSelectedEntries entries={selectedEntries} />
        <ButtonDeleteEntries entries={selectedEntries} />
      </ButtonGroup>
    </BasicTable>
  )
}

EntriesTable.propTypes = {
  entries: EntriesPropTypes,
  sortMap: PropTypes.object.isRequired,
  filterMap: PropTypes.object.isRequired,
  SetEntriesSortMap: PropTypes.func.isRequired,
  SetEntriesFilterMap: PropTypes.func.isRequired,
  SelectEntries: PropTypes.func.isRequired,
}

EntriesTable.defaultProps = {
  pageSize: 5,
  sortMap: DEFAULT_STATE_ENTRIES.sortMap,
  filterMap: DEFAULT_STATE_ENTRIES.filterMap,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntriesTable)
