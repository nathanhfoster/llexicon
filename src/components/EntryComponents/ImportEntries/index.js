import React, { useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { loadJSON, getValidDate } from 'utils'
import FileUpload from '../../FileUpload'
import { SetEntries, SyncEntries } from 'redux/Entries/actions'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/reducer'
import { getTagObjectFromString } from 'redux/Entries/utils'

const ImportEntries = () => {
  const dispatch = useDispatch()

  const importEntries = useCallback(({ target: { files: { 0: file }, value } }) => {
    loadJSON(file).then(async json => {
      const payload = json.map(entry => {
        let newEntry = {
          ...entry,
          date_created: getValidDate(entry.date_created),
          date_created_by_author: getValidDate(entry.date_created_by_author),
          date_updated: getValidDate(entry.date_updated),
          _lastUpdated: getValidDate(entry._lastUpdated),
          tags: getTagObjectFromString(entry.tags),
          people: getTagObjectFromString(entry.people),
          EntryFiles: entry.EntryFiles || [],
        }
        if (entry.id.toString().includes(BASE_JOURNAL_ENTRY_ID)) {
          return { ...newEntry, _shouldPost: true }
        }
        return newEntry
      })
      await dispatch(SetEntries(payload))
      // await dispatch(SyncEntries())
    })
  }, [])

  return <FileUpload onChange={importEntries} />
}

export default memo(ImportEntries)
