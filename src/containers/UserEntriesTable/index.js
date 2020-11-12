import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { EntriesTable } from "../../components"
import { EntriesPropTypes } from "redux/Entries/propTypes"

const mapStateToProps = (
  { Entries: { items, sortMap, filterMap } },
  { entries }
) => ({
  entries: entries || items,
  sortMap,
  filterMap,
})

const UserEntriesTable = ({ entries, sortMap, filterMap, pageSize }) => (
  <EntriesTable
    entries={entries}
    sortMap={sortMap}
    filterMap={filterMap}
    pageSize={pageSize}
  />
)

UserEntriesTable.propTypes = {
  entries: EntriesPropTypes,
  sortMap: PropTypes.object,
  filterMap: PropTypes.object,
  pageSize: PropTypes.number.isRequired,
}

UserEntriesTable.defaultProps = {
  pageSize: 5,
}

export default connect(mapStateToProps)(UserEntriesTable)
