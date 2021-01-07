import { BASIC_TABLE_CONTEXT_OPTIONS } from '../state/context'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import BasicDropDown from '../../BasicDropDown'
import PropTypes from 'prop-types'
import { basicTableSetPage, basicTableSetPageSize } from '../state/actions'
import './styles.css'

const mapStateToProps = ({ dataLength, currentPage, pageSize, pageSizes }) => ({
  dataLength,
  currentPage,
  pageSize,
  pageSizes,
})

const mapDispatchToProps = {
  basicTableSetPage,
  basicTableSetPageSize,
}

const TablePaginator = ({
  dataLength,
  currentPage,
  pageSize,
  pageSizes,
  basicTableSetPage,
  basicTableSetPageSize,
}) => {
  const totalPages = useMemo(() => Math.ceil(dataLength / pageSize), [dataLength, pageSize])

  const pageList = useMemo(
    () =>
      [{ header: true, value: 'Page' }].concat(
        new Array(totalPages).fill().map((e, i) => ({ value: i + 1 })),
      ),
    [totalPages],
  )

  const disabledLeftArrow = currentPage === 0

  const disabledRightArrow = currentPage + 1 === totalPages

  const navigateBack = () => basicTableSetPage(currentPage - 1)

  const navigateWithDropDown = useCallback((id, value) => basicTableSetPage(value - 1), [])

  const handleSetPageSize = useCallback((id, value) => basicTableSetPageSize(value), [])

  const navigateForward = () => basicTableSetPage(currentPage + 1)

  const renderCurrentPage = useMemo(
    () => (
      <span>
        <span className='Pagination'>{currentPage + 1}</span>
        <span> / </span>
        <span>{totalPages}</span>
      </span>
    ),
    [currentPage, totalPages],
  )

  const renderPageSize = useMemo(
    () => (
      <span>
        <span>{dataLength}</span>
        <span> / </span>
        <span className='Pagination'>{pageSize}</span>
      </span>
    ),
    [dataLength, pageSize],
  )

  return (
    <Container fluid className='BasicTablePaginator'>
      <Row>
        <Col
          xs={3}
          tag={Button}
          color='primary'
          className='p-0'
          disabled={disabledLeftArrow}
          onClick={navigateBack}
        >
          <i className='fas fa-angle-left' />
        </Col>
        <Col xs={3} className='p-0'>
          <BasicDropDown
            options={pageList}
            value={renderCurrentPage}
            onChange={navigateWithDropDown}
          />
        </Col>
        <Col xs={3} className='p-0'>
          <BasicDropDown options={pageSizes} value={renderPageSize} onChange={handleSetPageSize} />
        </Col>
        <Col
          xs={3}
          tag={Button}
          color='primary'
          className='p-0'
          disabled={disabledRightArrow}
          onClick={navigateForward}
        >
          <i className='fas fa-angle-right' />
        </Col>
      </Row>
    </Container>
  )
}

TablePaginator.propTypes = {
  dataLength: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
    }).isRequired,
  ),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  BASIC_TABLE_CONTEXT_OPTIONS,
)(TablePaginator)
