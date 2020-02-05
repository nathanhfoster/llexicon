import React, { memo } from "react"
import { Container, Row, Col, Button } from "reactstrap"
import BasicDropDown from "../../BasicDropDown"
import PropTypes from "prop-types"
import "./styles.css"

const TablePaginator = ({
  pageSizes,
  currentPage,
  totalPages,
  pageSize,
  dataLength,
  handlePageChange,
  handlePageSizeChange
}) => {
  const pageList = new Array(totalPages)
    .fill()
    .map((e, i) => ({ id: i, value: i + 1 }))

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
            toggleTitle={
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
            toggleTitle={
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
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
      ]).isRequired,
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool
    })
  ).isRequired,
  totalPages: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired
}

export default memo(TablePaginator)
