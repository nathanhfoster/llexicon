import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { BasicMap } from "../"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import { SetEditorState } from "../../redux/TextEditor/actions"
import { RouteMap, RouterPush, GoToEntryDetail } from "../../routes"

const mapStateToProps = ({ Entries: { items } }) => ({
  entries: items,
})

const mapDispatchToProps = {
  SetEditorState,
}

const EntriesMap = ({ height, entries }) => {
  const history = useHistory()
  const handleOnChange = useCallback(
    ({ entryId, address, latitude, longitude }) => {
      if (!entryId) return
      else if (entryId === "NewEntry") {
        SetEditorState({
          id: entryId,
          title: "",
          address,
          latitude,
          longitude,
        })
      } else if (entryId === "MyLocation") {
        SetEditorState({
          id: entryId,
          title: "",
          address,
          latitude,
          longitude,
        })
        return RouterPush(history, RouteMap.NEW_ENTRY)
      } else {
        return GoToEntryDetail(entryId, history)
      }
    },
    []
  )

  return (
    <BasicMap
      height={height}
      getAddressOnMarkerClick
      locations={entries}
      onChangeCallback={handleOnChange}
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

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntriesMap)
