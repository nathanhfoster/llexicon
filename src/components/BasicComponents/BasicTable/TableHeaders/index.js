import React from "react"
import { BasicTableContext } from "../"
import TableHeaders from "./TableHeaders"

const TableHeadersContainer = (propsFromBasicTable) => (
  <BasicTableContext.Consumer>
    {({
      state: { columns, sortList, onSortCallback, onFilterCallback, sortable },
      dispatch,
    }) => (
      <TableHeaders
        {...propsFromBasicTable}
        columns={columns}
        sortList={sortList}
        sortable={sortable}
        onSortCallback={onSortCallback}
        onFilterCallback={onFilterCallback}
        dispatch={dispatch}
      />
    )}
  </BasicTableContext.Consumer>
)

export default TableHeadersContainer
