import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicMap } from "../.."
import { EntryPropTypes } from "../../../redux/Entries/propTypes"
import { SetEditorState } from "../../../redux/TextEditor/actions"
import {
  RouteMap,
  RouterPush,
  GoToEntryDetail,
} from "../../../redux/router/actions"

const mapStateToProps = ({ Entries: { items } }) => ({
  entries: items,
})

const mapDispatchToProps = {
  SetEditorState,
}

const EntriesMap = ({ height, entries }) => {
  const handleOnChange = useCallback(
    ({ entryId, address, latitude, longitude }) => {
      if (!entryId) return
      else {
        SetEditorState({
          id: entryId,
          title: "",
          address,
          latitude,
          longitude,
        })
        if (entryId === "MyLocation") {
          return RouterPush(RouteMap.NEW_ENTRY)
        } else {
          return GoToEntryDetail(entryId)
        }
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
