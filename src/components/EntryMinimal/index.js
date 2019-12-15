import React, { memo } from "react"
import PropTypes from "prop-types"
import { Badge, Container, Row, Col } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import Moment from "react-moment"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"

import "./styles.css"

const EntryMinimal = ({
  id,
  title,
  html,
  date_created_by_author,
  lastUpdated,
  EntryFiles = [],
  author,
  date_create,
  date_updated,
  latitude,
  longitude,
  tags = [],
  views
}) => {
  const history = useHistory()

  const showFileIcon = EntryFiles.length > 0

  return (
    <Container
      fluid
      tag={Badge}
      className="EntryMinimal"
      onClick={() =>
        RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))
      }
    >
      <Row>
        <Col xs={8} md={9} lg={10} xl={11} className="EntryMinimalTitle">
          <Star size={14} animation={false} opacity={1} />
          <span className="ml-1">{title}</span>
        </Col>
        <Col xs={4} md={3} lg={2} xl={1} className="EntryMinimalTime">
          {showFileIcon && <i className="far fa-file-image mr-1" />}
          <Moment format="D MMM YY">{date_created_by_author}</Moment>
        </Col>

        <Col xs={12} className="EntryMinimalTags">
          <TagsContainer tags={tags} minimalView={false} hoverable={false} />
        </Col>
      </Row>
    </Container>
  )
}

EntryMinimal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  html: PropTypes.string,
  date_created_by_author: PropTypes.string,
  EntryFiles: PropTypes.arrayOf(PropTypes.object)
}

export default memo(EntryMinimal)
