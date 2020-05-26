import React from "react"
import { BasicTableContext } from "../"
import TableBody from "./TableBody"

const TableBodyContainer = (propsFromBasicTable) => (
  <BasicTableContext.Consumer>
    {({ state: { columns, onRowClick, currentPage, pageSize } }) => (
      <TableBody
        {...propsFromBasicTable}
        columns={columns}
        onRowClick={onRowClick}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    )}
  </BasicTableContext.Consumer>
)

export default TableBodyContainer
