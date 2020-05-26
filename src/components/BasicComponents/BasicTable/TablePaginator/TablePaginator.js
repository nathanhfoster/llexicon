import React, { useMemo, memo } from "react"
import { Container, Row, Col, Button } from "reactstrap"
import BasicDropDown from "../../BasicDropDown"
import PropTypes from "prop-types"
import { basicTableSetPage, basicTableSetPageSize } from "../state/actions"
import "./styles.css"

const TablePaginator = ({
  dataLength,
  currentPage,
  pageSize,
  pageSizes,
  dispatch,
}) => {
  const totalPages = useMemo(() => Math.ceil(dataLength / pageSize), [
    dataLength,
    pageSize,
  ])

  const handlePageChange = (page) => {
    dispatch(basicTableSetPage(page))
  }

  const handlePageSizeChange = (id, pageSize) => {
    dispatch(basicTableSetPageSize(pageSize))
  }

  const pageList = useMemo(
    () =>
      [{ header: true, value: "Page" }].concat(
        new Array(totalPages).fill().map((e, i) => ({ value: i + 1 }))
      ),
    [totalPages]
  )

  const disabledLeftArrow = currentPage === 0

  const disabledRightArrow = currentPage + 1 === totalPages

  const navigateBack = () => handlePageChange(currentPage - 1)

  const navigateWithDropDown = (id, value) => handlePageChange(value - 1)

  const navigateForward = () => handlePageChange(currentPage + 1)

  return (
    <Container fluid className="BasicTablePaginator">
      <Row>
        <Col
          xs={3}
          tag={Button}
          color="primary"
          className="p-0"
          disabled={disabledLeftArrow}
          onClick={navigateBack}
        >
          <i className="fas fa-angle-left" />
        </Col>
        <Col xs={3} className="p-0">
          <BasicDropDown
            list={pageList}
            value={
              <span>
                <span className="Pagination">{currentPage + 1}</span>
                <span> / </span>
                <span>{totalPages}</span>
              </span>
            }
            onClickCallback={navigateWithDropDown}
          />
        </Col>
        <Col xs={3} className="p-0">
          <BasicDropDown
            list={pageSizes}
            value={
              <span>
                <span>{dataLength}</span>
                <span> / </span>
                <span className="Pagination">{pageSize}</span>
              </span>
            }
            onClickCallback={handlePageSizeChange}
          />
        </Col>
        <Col
          xs={3}
          tag={Button}
          color="primary"
          className="p-0"
          disabled={disabledRightArrow}
          onClick={navigateForward}
        >
          <i className="fas fa-angle-right" />
        </Col>
      </Row>
    </Container>
  )
}

TablePaginator.propTypes = {
  totalPages: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
}

export default memo(TablePaginator)
