import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BasicTable } from '../../'
import { GoToEntryDetail } from 'redux/router/actions'
import { EntryPropType, EntriesPropTypes, TableColumnsPropType } from 'redux/Entries/propTypes'
import { SetEntriesSortMap, SetEntriesFilterMap, SelectReduxEntries } from 'redux/Entries/actions'
import { mapTableColumnsWithProps } from './utils'

import {
  ButtonExportEntries,
  ButtonEditEntries,
  ButtonEditTableColumns,
  ButtonShareEntries,
  ButtonClearSelectedEntries,
  ButtonDeleteEntries,
  ButtonImportEntries,
} from 'components'
import { ButtonToolbar, ButtonGroup } from 'reactstrap'

const mapStateToProps = ({ Entries: { showOnlyPublic, selectedItemsMap, tableColumns } }) => ({
  showOnlyPublic,
  selectedItemsMap,
  tableColumns,
})

const mapDispatchToProps = {
  SetEntriesSortMap,
  SetEntriesFilterMap,
  SelectReduxEntries,
}

export const EntriesTable = ({
  showOnlyPublic,
  selectedItemsMap,
  SetEntriesSortMap,
  SetEntriesFilterMap,
  SelectReduxEntries,
  entries,
  sortMap,
  filterMap,
  pageSize,
  tableColumns,
}) => {
  const [selectedReduxEntries, setSelectedReduxEntries] = useState(selectedItemsMap)

  useEffect(() => {
    SelectReduxEntries(selectedReduxEntries)
  }, [selectedReduxEntries])

  const [viewableEntries, selectedEntries] = useMemo(() => {
    let selected = []
    const viewable = entries.reduce((acc, e) => {
      const { id, _shouldDelete, is_public } = e
      const isSelected = selectedItemsMap[id]
      if (showOnlyPublic ? is_public && !_shouldDelete : !_shouldDelete) {
        acc.push(e)
      }

      if (isSelected) {
        selected.push(e)
      }

      return acc
    }, [])

    return [viewable, selected]
  }, [entries, selectedItemsMap, showOnlyPublic])

  const handleSortCallback = useCallback((sortKey, sortUp) => SetEntriesSortMap(sortKey, sortUp), [
    SetEntriesSortMap,
  ])

  const handleFilterCallback = useCallback(
    (filterKey, searchValue) => SetEntriesFilterMap(filterKey, searchValue),
    [SetEntriesFilterMap],
  )

  const renderTableColumns = useMemo(
    () =>
      tableColumns.map(c => {
        const columnProps = {
          defaultFilterValue: filterMap[c],
          defaultSortValue: sortMap[c],
        }
        return mapTableColumnsWithProps[c](columnProps)
      }),
    [
      // filterMap,
      // sortMap,
      tableColumns,
    ],
  )

  const onRowClick = useCallback(item => GoToEntryDetail(item.id), [])

  const handleActionMenuCallback = useCallback(selectedEntries => {
    setSelectedReduxEntries(selectedEntries)
  }, [])

  return (
    <BasicTable
      sortable
      filterable
      pageSize={pageSize}
      columns={renderTableColumns}
      dataDisplayName='Entries'
      data={viewableEntries}
      selectedDataMap={selectedItemsMap}
      onRowClick={onRowClick}
      onSortCallback={handleSortCallback}
      onFilterCallback={handleFilterCallback}
      actionMenuCallback={handleActionMenuCallback}
    >
      <ButtonToolbar>
        <ButtonGroup>
          <ButtonEditTableColumns />
          <ButtonEditEntries entries={selectedEntries} />
        </ButtonGroup>
        <ButtonGroup>
          <ButtonImportEntries />
          <ButtonExportEntries entries={selectedEntries} />
          <ButtonShareEntries entries={selectedEntries} />
        </ButtonGroup>
        <ButtonGroup>
          <ButtonClearSelectedEntries entries={selectedEntries} />
          <ButtonDeleteEntries entries={selectedEntries} />
        </ButtonGroup>
      </ButtonToolbar>
      <div style={{ marginBottom: 40 }} />
    </BasicTable>
  )
}

EntriesTable.propTypes = {
  entries: EntriesPropTypes,
  selectedItemsMap: PropTypes.objectOf(PropTypes.bool),
  sortMap: PropTypes.object.isRequired,
  filterMap: PropTypes.object.isRequired,
  tableColumns: TableColumnsPropType,
  SetEntriesSortMap: PropTypes.func.isRequired,
  SetEntriesFilterMap: PropTypes.func.isRequired,
  SelectReduxEntries: PropTypes.func.isRequired,
}

EntriesTable.defaultProps = {
  pageSize: 5,
  sortMap: {
    date_updated: true,
  },
  filterMap: {},
}

export default connect(mapStateToProps, mapDispatchToProps)(EntriesTable)
