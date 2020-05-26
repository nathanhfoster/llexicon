import React from "react"
import { BasicTableContext } from "../"
import TablePaginator from "./TablePaginator"

const TablePaginatorContainer = (propsFromBasicTable) => (
  <BasicTableContext.Consumer>
    {({ state: { currentPage, pageSize, pageSizes }, dispatch }) => (
      <TablePaginator
        {...propsFromBasicTable}
        currentPage={currentPage}
        pageSize={pageSize}
        pageSizes={pageSizes}
        dispatch={dispatch}
      />
    )}
  </BasicTableContext.Consumer>
)

export default TablePaginatorContainer
