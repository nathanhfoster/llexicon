import React, { useMemo, useState, useCallback, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/utils'
import { copyStringToClipboard, shareUrl } from 'utils'
import { GetEntryDetailUrl } from 'redux/router/actions'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'
import { selectedEntriesSelector, selectedItemsAreEqual } from 'redux/Entries/utils'

export const ButtonShareEntries = ({ entries: entriesFromProps }) => {
  const { entries: entriesSelected } = useSelector(selectedEntriesSelector, selectedItemsAreEqual)
  const entries = useMemo(() => entriesFromProps || entriesSelected, [
    entriesFromProps,
    entriesSelected,
  ])
  const dispatch = useDispatch()
  const [urlCopied, setUrlCopied] = useState(false)

  const handleShareEntries = useCallback(() => {
    let url = ''
    let title = ''
    let text = `Check out my journal entr${entries.length === 1 ? 'y' : 'ies'}:`

    const { origin } = window.location
    const entryIsLocalOnly = entryId => !entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

    const getUpdatedEntry = (e, i) => {
      const entryTitle = e.title.replace(/(.{16})..+/, '$1…')
      const entryDetailUrl = GetEntryDetailUrl(e.id)
      const fullUrl = `${origin}${entryDetailUrl}`
      const delimeter = `${e.title != entryTitle ? ' ' : ' - '}`
      const entryText = `${entryTitle}${delimeter}${fullUrl}`
      title += `${entryTitle}${i !== undefined ? ',' : ''}`
      url += `${e.fullUrl}${i !== undefined ? ',' : ''}`
      text += i !== undefined ? `\n${i + 1}: ${entryText}` : ` ${entryText}`
      return {
        ...e,
        is_public: true,
        _lastUpdated: new Date(),
      }
    }

    const payload =
      entries.length === 1
        ? getUpdatedEntry(entries[0])
        : entries.reduce((acc, e, i) => {
            if (entryIsLocalOnly(e.id)) {
              acc[e.id] = getUpdatedEntry(e, i)
            }
            return acc
          }, {})

    dispatch(UpdateReduxEntries(payload))

    if (navigator.share) {
      const sharePayload = {
        url,
        title,
        text,
      }

      shareUrl(sharePayload)
    } else {
      copyStringToClipboard(text)
    }

    setUrlCopied(true)

    dispatch(SyncEntries())
  }, [entries])
  return (
    <Button disabled={entries.length === 0} color='accent' onClick={handleShareEntries}>
      <i
        className={`fas fa-${urlCopied ? 'check' : navigator.share ? 'share' : 'clipboard'} mr-1`}
      />
    </Button>
  )
}

ButtonShareEntries.propTypes = {
  entries: EntriesPropTypes,
}

export default memo(ButtonShareEntries)
