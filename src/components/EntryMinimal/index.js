import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { Badge, Container, Row, Col } from "reactstrap"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../ReactRouter/Routes"
import Moment from "react-moment"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"

import "./styles.css"

const EntryMinimal = ({
  id,
  title,
  html,
  date_created_by_author,
  _lastUpdated,
  EntryFiles = [],
  author,
  date_create,
  date_updated,
  address,
  latitude,
  longitude,
  tags = [],
  views,
  rating
}) => {
  const history = useHistory()

  const showFileIcon = EntryFiles.length > 0
  const showLocationIcon = latitude && longitude

  return (
    <Container
      fluid
      tag={Badge}
      className="EntryMinimal p-2"
      onClick={() => RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))}
    >
      <Row>
        <Col xs={12} className="EntryMinimalDetail">
          <Star size={14} animation={false} opacity={1} />
          <span className="ml-1">{title}</span>
        </Col>
        <Col xs={6} className="EntryMinimalTime">
          <i className="fas fa-calendar-day mr-1" />
          <Moment format="D MMM YY hh:mma">{date_created_by_author}</Moment>
        </Col>
        <Col xs={6} className="EntryMinimalTime">
          <i className="fas fa-pencil-alt mr-1" />
          <Moment format="D MMM YY hh:mma">{_lastUpdated || date_updated}</Moment>
        </Col>

        <Col xs={12} className="EntryMinimalDetail mt-1 mb-1">
          <i className="far fa-eye" /> <span className="mr-2">{views}</span>
          {showLocationIcon && (
            <Fragment>
              <i className="fas fa-map-marker-alt mr-1" />
              {address}
            </Fragment>
          )}
          {showFileIcon && <i className="far fa-file-image mr-1" />}
        </Col>

        <Col xs={12}>
          <TagsContainer
            showTagIcon={false}
            tags={tags}
            fontSize="1.5em"
            tagContainerClassName="mt-0 mb-0 mr-1"
          >
            <i className="fas fa-tags mr-1" />
          </TagsContainer>
        </Col>
      </Row>
    </Container>
  )
}

EntryMinimal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  html: PropTypes.string,
  date_created_by_author: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  EntryFiles: PropTypes.arrayOf(PropTypes.object)
}

export default memo(EntryMinimal)
