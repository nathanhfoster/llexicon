import React from "react"
import { BasicTableContext } from "../"
import TableFooter from "./TableFooter"

const TableFooterContainer = (propsFromBasicTable) => (
  <BasicTableContext.Consumer>
    {({ state: { columns, sortList } }, dispatch) => (
      <TableFooter
        {...propsFromBasicTable}
        columns={columns}
        sortList={sortList}
        dispatch={dispatch}
      />
    )}
  </BasicTableContext.Consumer>
)

export default TableFooterContainer
