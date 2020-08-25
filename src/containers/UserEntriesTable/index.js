import React from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"

import { EntriesTable } from "../../components"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"

const mapStateToProps = ({ Entries: { items, sortMap, filterMap } }) => ({
  items,
  sortMap,
  filterMap,
})

const UserEntriesTable = ({ items, sortMap, filterMap, pageSize }) => (
  <EntriesTable
    entries={items}
    sortMap={sortMap}
    filterMap={filterMap}
    pageSize={pageSize}
  />
)

UserEntriesTable.propTypes = {
  items: EntriesPropTypes,
  sortMap: PropTypes.object,
  filterMap: PropTypes.object,
  pageSize: PropTypes.number.isRequired,
}

UserEntriesTable.defaultProps = {
  pageSize: 5,
}

export default connect(mapStateToProps)(UserEntriesTable)
