import React, { useMemo, useCallback, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector } from 'react-redux'

import { exportFile, downloadCSV } from 'utils'
import { getEntryTransform, entryKeyTransform } from 'redux/Entries/utils'
import {
  selectedEntriesSelector,
  allEntriesSelector,
  selectedItemsAreEqual,
  allItemsAreEqual,
} from 'redux/Entries/utils'
import BasicDropDown from 'components/BasicComponents/BasicDropDown'

const EXPORT_BUTTON = (
  <span>
    <i className='fas fa-file-export mr-1' />
  </span>
)

export const ButtonExportEntries = ({ entries: entriesFromProps }) => {
  const userId = useSelector(({ User: { id } }) => id)
  const { entries: entriesSelected } = useSelector(
    entriesFromProps ? selectedEntriesSelector : allEntriesSelector,
    entriesFromProps ? selectedItemsAreEqual : allItemsAreEqual,
  )
  const entries = useMemo(() => entriesFromProps || entriesSelected, [
    entriesFromProps,
    entriesSelected,
  ])

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

  const handleOnChange = useCallback(
    (id, value) => {
      switch (id) {
        case 'csv':
          const columns = entryKeyTransform.map(({ key }) => key)
          const rows = entries.map(entry => getEntryTransform(entry, false))

          downloadCSV(columns, rows, `Astral-Tree-Entries-${new Date()}`)
          break
        case 'json':
          const formattedEntries = entries.map((entry, i) => {
            let newEntry = getEntryTransform(entry)

            if (userId) {
              newEntry['author'] = userId
            }

            return newEntry
          })

          exportFile(formattedEntries, `Astral-Tree-Entries-${new Date()}`)
          break
        default:
      }
    },
    [entries, userId],
  )

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
