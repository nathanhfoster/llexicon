import React from "react"
import { BasicTableContext } from "../"
import TableHeaders from "./TableHeaders"

const TableHeadersContainer = (propsFromBasicTable) => (
  <BasicTableContext.Consumer>
    {({ state: { columns, sortList }, dispatch }) => (
      <TableHeaders
        {...propsFromBasicTable}
        columns={columns}
        sortList={sortList}
        dispatch={dispatch}
      />
    )}
  </BasicTableContext.Consumer>
)

export default TableHeadersContainer
