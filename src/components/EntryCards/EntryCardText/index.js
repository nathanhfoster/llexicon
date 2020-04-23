import React, { memo } from "react"
import PropTypes from "prop-types"
import {
  EntryTagsProps,
  EntryPeopleProps,
} from "../../../redux/Entries/propTypes"
import { Container, Row, Col } from "reactstrap"
import { RatingIcon, TagsContainer } from "../../"
import Moment from "react-moment"
import "./styles.css"

const EntryCardText = ({
  tags,
  people,
  date_created_by_author,
  date_updated,
  views,
  rating,
}) => {
  return (
    <Container className="EntryCardText Container">
      <Row>
        <Col xs={12} className="EntryCardTextTags p-0">
          <TagsContainer tags={tags} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="EntryCardTextTags p-0">
          <TagsContainer
            tags={people}
            emptyString="No people..."
            faIcon="fas fa-user"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4} className="EntryCardTextLeftColumn p-0">
          <i className="far fa-eye" /> <span className="mr-2">{views}</span>
        </Col>
        <Col xs={8} className="EntryCardTextRightColumn p-0">
          <RatingIcon rating={rating} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="EntryCardTextLeftColumn p-0">
          <i className="fas fa-calendar-day mr-1" />
          <Moment fromNow>{date_created_by_author}</Moment>
        </Col>
        <Col xs={12} className="EntryCardTextLeftColumn p-0">
          <i className="fas fa-pencil-alt mr-1" />
          <Moment fromNow>{date_updated}</Moment>
        </Col>
      </Row>
    </Container>
  )
}

EntryCardText.propTypes = {
  tags: EntryTagsProps,
  people: EntryPeopleProps,
  date_created_by_author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  date_updated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  views: PropTypes.number,
  rating: PropTypes.number,
}

EntryCardText.defaultProps = {}

export default memo(EntryCardText)
