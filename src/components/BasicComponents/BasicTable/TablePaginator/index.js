import React, { useContext, memo } from "react"
import { Container, Row, Col, Button } from "reactstrap"
import BasicDropDown from "../../BasicDropDown"
import PropTypes from "prop-types"
import { BasicTableContext } from "../"
import { basicTableSetPage, basicTableSetPageSize } from "../state/actions"
import "./styles.css"

const TablePaginator = ({ totalPages, dataLength }) => {
  const [state, dispatch] = useContext(BasicTableContext)
  const { currentPage, pageSize, pageSizes } = state

  const handlePageChange = (page) => {
    dispatch(basicTableSetPage(page))
  }

  const handlePageSizeChange = (id, pageSize) => {
    dispatch(basicTableSetPageSize(pageSize))
  }

  const pageList = [{ header: true, value: "Page" }].concat(
    new Array(totalPages).fill().map((e, i) => ({ value: i + 1 }))
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
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
      ]).isRequired,
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
    })
  ).isRequired,
  totalPages: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
}

export default memo(TablePaginator)
