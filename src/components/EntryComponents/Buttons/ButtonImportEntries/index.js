import React, { useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { loadJSON } from 'utils'
import FileUpload from '../../../FileUpload'
import { SetEntries } from 'redux/Entries/actions'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/utils'
import { getEntryTransform } from 'redux/Entries/utils'

export const ButtonImportEntries = () => {
  const dispatch = useDispatch()

  const importEntries = useCallback(({ target: { files: { 0: file }, value } }) => {
    loadJSON(file).then(async json => {
      const payload = json.map(entry => {
        let newEntry = getEntryTransform(entry, true, false)
        if (entry.id.toString().includes(BASE_JOURNAL_ENTRY_ID)) {
          return { ...newEntry, _shouldPost: true }
        }
        return newEntry
      })
      await dispatch(SetEntries(payload))
    })
  }, [])

  return <FileUpload onChange={importEntries} />
}

export default memo(ButtonImportEntries)
