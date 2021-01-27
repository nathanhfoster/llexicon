import React, { useMemo, useCallback, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector } from 'react-redux'

import { exportJSON, getValidDate, downloadCSV } from 'utils'
import { getTagStringFromObject } from 'redux/Entries/utils'
import {
  selectedEntriesSelector,
  allEntriesSelector,
  selectedItemsAreEqual,
  allItemsAreEqual,
} from 'redux/Entries/utils'
import BasicDropDown from 'components/BasicComponents/BasicDropDown'

const EXPORT_BUTTON = (
  <span>
    <i className='fas fa-file-export mr-1' /> Export
  </span>
)

const ButtonExportEntries = ({ entries: entriesFromProps }) => {
  const userId = useSelector(({ User: { id } }) => id)
  const { entries: entriesSelected } = useSelector(
    entriesFromProps ? selectedEntriesSelector : allEntriesSelector,
    entriesFromProps ? selectedItemsAreEqual : allItemsAreEqual,
  )
  const entries = useMemo(() => entriesFromProps || entriesSelected, [
    entriesFromProps,
    entriesSelected,
  ])

  const handleExportEntries = () => {
    const formattedEntries = entries.map((entry, i) => {
      const {
        id,
        author,
        tags,
        people,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views,
        rating,
        address,
        latitude,
        longitude,
        is_public,
        ...restOfProps
      } = entry

      let entries = {
        id,
        author,
        tags: getTagStringFromObject(tags),
        people: getTagStringFromObject(people),
        title,
        html,
        date_created: getValidDate(date_created),
        date_created_by_author: getValidDate(date_created_by_author),
        date_updated: getValidDate(date_updated),
        views,
        rating,
        address,
        latitude,
        longitude,
        is_public,
        ...restOfProps,
      }

      if (userId) {
        entries['author'] = userId
      }

      return entries
    })

    exportJSON(formattedEntries, `Astral-Tree-Entries-${new Date()}`)
  }

  const handleExportToCSV = () => {
    const columns = [
      'id',
      'title',
      'html',
      // 'tags',
      // 'people',
      // 'address',
      // 'date_created_by_author',
      // 'date_updated',
      // 'views',
      // 'rating',
      // 'EntryFiles',
      // 'is_public',
    ]
    const rows = entries.map(entry => {
      let row = columns.map(c => JSON.stringify(entry[c]))
      return row
    })
    console.log([columns])
    console.log(rows)
    downloadCSV([columns], rows)
  }

  const options = useMemo(() => {
    const disabled = entries.length === 0
    return [
      {
        id: 'csv',
        title: 'Export CSV File',
        value: (
          <Fragment>
            <i className='fas fa-file-csv mr-1' />
            CSV
          </Fragment>
        ),
        disabled,
      },
      {
        id: 'json',
        title: 'Export JSON File',
        value: (
          <Fragment>
            <i className='fas fa-file-csv mr-1' />
            JSON
          </Fragment>
        ),
        disabled,
      },
    ]
  }, [entries.length])

  const handleOnChange = useCallback((id, value) => {
    switch (id) {
      case 'csv':
        handleExportToCSV()
        break
      case 'json':
        handleExportEntries()
        break
      default:
    }
  }, [])

  return (
    <BasicDropDown
      options={options}
      onChange={handleOnChange}
      color='accent'
      value={EXPORT_BUTTON}
    />
  )
}

ButtonExportEntries.propTypes = {
  userId: PropTypes.number,
  entries: EntriesPropTypes,
}

export default memo(ButtonExportEntries)
