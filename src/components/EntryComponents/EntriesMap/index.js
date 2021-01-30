import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BasicMap } from '../..'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { SetEditorState } from 'redux/TextEditor/actions'
import { RouteMap, RouterPush, GoToEntryDetail } from 'redux/router/actions'

const mapStateToProps = ({ Entries: { items, showOnlyPublic } }) => ({
  entries: items,
  showOnlyPublic,
})

const mapDispatchToProps = {
  SetEditorState,
}

export const EntriesMap = ({ entries, showOnlyPublic, height }) => {
  const viewableEntries = useMemo(
    () =>
      entries.filter(({ _shouldDelete, is_public }) =>
        showOnlyPublic ? is_public : !_shouldDelete,
      ),
    [entries, showOnlyPublic],
  )

  const handleOnChange = useCallback(({ entryId, address, latitude, longitude }) => {
    if (!entryId) return
    else {
      SetEditorState({
        id: entryId,
        title: '',
        address,
        latitude,
        longitude,
      })
      if (entryId === 'MyLocation') {
        return RouterPush(RouteMap.NEW_ENTRY)
      } else {
        return GoToEntryDetail(entryId)
      }
    }
  }, [])

  return (
    <BasicMap
      height={height}
      getAddressOnMarkerClick
      locations={viewableEntries}
      onChange={handleOnChange}
    />
  )
}

EntriesMap.propTypes = {
  entries: EntryPropTypes,
  height: PropTypes.number.isRequired,
  SetEditorState: PropTypes.func.isRequired,
}

EntryPropTypes.defaultProps = {
  height: 500,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntriesMap)
