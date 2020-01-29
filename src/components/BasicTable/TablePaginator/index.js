import React, { PureComponent } from "react"
import { Container, Row, Col, Button } from "reactstrap"
import BasicDropDown from "../../BasicDropDown"
import PropTypes from "prop-types"
import "./styles.css"

class TablePaginator extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }

  static defaultProps = {
    pageSizes: [
      { id: 0, header: true, value: "Page Sizes" },
      { id: 1, value: 25 },
      { id: 2, value: 50 },
      { id: 3, value: 100 }
    ]
  }

  render() {
    const { pageSizes, currentPage, totalPages, pageSize } = this.props

    const highestPage = Math.floor(totalPages)

    const currentPageOf = new Array(highestPage).fill().map((e, i) => ({ id: i, value: i + 1 }))
    return (
      <Container fluid className="BasicTablePaginator">
        <Row>
          <Col xs={3} tag={Button} color="primary" className="p-0">
            <i className="fas fa-angle-left" />
          </Col>
          <Col xs={3} className="p-0">
            <BasicDropDown list={currentPageOf} toggleTitle={`${currentPage + 1}/${highestPage}`} />
          </Col>
          <Col xs={3} className="p-0">
            <BasicDropDown list={pageSizes} toggleTitle={`Size: ${pageSize}`} />
          </Col>
          <Col xs={3} tag={Button} color="primary" className="p-0">
            <i className="fas fa-angle-right" />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default TablePaginator
