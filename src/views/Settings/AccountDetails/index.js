import React from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Media } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Moment from "react-moment"

const mapStateToProps = ({ User }) => ({
  User
})

const AccountDetails = ({ User }) => {
  return (
    <Container fluid>
      <Row>
        <Col
          xs={12}
          tag="h3"
          style={{ display: "flex", alignContent: "center" }}
        >
          {User.picture && (
            <Media middle src={User.picture} height={52} className="mr-2" />
          )}
          {`${User.first_name} ${User.last_name}`}
        </Col>
        <Col xs={12}>
          <span>Joined </span>
          <Moment fromNow>{User.date_joined}</Moment>
          <span> on </span>
          <Moment format="MMMM DD, YYYY hh:mma">{User.date_joined}</Moment>
        </Col>
      </Row>
    </Container>
  )
}

AccountDetails.propTypes = { User: PropTypes.object.isRequired }

AccountDetails.defaultProps = {}

export default reduxConnect(mapStateToProps)(AccountDetails)
