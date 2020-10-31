import BasicTableContext from '../state/context'
import React, { lazy, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { DataPropType, SortListPropType } from '../state/types'
import './styles.css'

// Lazy load other child components so BasicTableContext can be initialized before it is used
const TableHeaders = lazy(() => import('../TableHeaders'))
const TableBody = lazy(() => import('../TableBody'))
const TableFooters = lazy(() => import('../TableFooters'))
const TablePaginator = lazy(() => import('../TablePaginator'))

const mapStateToProps = ({
  hover,
  borderless,
  bordered,
  striped,
  dark,
  responsive,
  onRowClick,
  getRowValue,
}) => ({
  hover,
  borderless,
  bordered,
  striped,
  dark,
  responsive,
  onRowClick,
  getRowValue,
})

const BasicTable = ({
  hover,
  borderless,
  bordered,
  striped,
  dark,
  responsive,
  onRowClick,
  getRowValue,
}) => {
  const isHoverable = hover || onRowClick || getRowValue ? true : false

  return (
    <Fragment>
      <Table
        className='BasicTable m-0'
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        dark={dark}
        hover={isHoverable}
        responsive={responsive}
      >
        <TableHeaders />
        <TableBody />
        <TableFooters />
      </Table>
      <TablePaginator />
    </Fragment>
  )
}

BasicTable.propTypes = {
  sortList: SortListPropType,
  filterList: PropTypes.array,
  hover: PropTypes.bool.isRequired,
  borderless: PropTypes.bool.isRequired,
  bordered: PropTypes.bool.isRequired,
  striped: PropTypes.bool.isRequired,
  dark: PropTypes.bool.isRequired,
  responsive: PropTypes.bool.isRequired,
  onRowClick: PropTypes.func,

  // reactstrap Table
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.string,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  striped: PropTypes.bool,
  dark: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  // Custom ref handler that will be assigned to the "ref" of the inner <table> element
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
}

BasicTable.defaultProps = {
  pageSize: 10,
  pageSizes: [5, 15, 25, 50, 100],
}

export default connect(mapStateToProps, null, null, {
  context: BasicTableContext,
})(BasicTable)
