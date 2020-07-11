import React, { Fragment, memo } from "react"
import { EntryPropTypes } from "../../../redux/Entries/propTypes"
import { Badge, Container, Row, Col } from "reactstrap"
import {
  GoToEntryDetail,
  GetEntryDetailUrl,
} from "../../../redux/router/actions"
import Moment from "react-moment"
import Star from "../../BackgroundImage/Star"
import { TagsContainer, EntryDataCellLink, EntryOptionsMenu } from "../../"

import "./styles.css"

const EntryMinimal = ({
  id,
  title,
  html,
  date_created_by_author,
  _lastUpdated,
  EntryFiles,
  date_create,
  date_updated,
  address,
  latitude,
  longitude,
  tags,
  people,
  views,
  rating,
  is_public,
  author,
}) => {
  const showFileIcon = EntryFiles.length > 0
  const showLocationIcon = latitude && longitude

  const href = GetEntryDetailUrl(id)

  const handleContainerClick = () => GoToEntryDetail(id)

  return (
    <Container
      fluid
      tag={Badge}
      className="EntryMinimal p-2"
      onClick={handleContainerClick}
      title={title}
    >
      <Row>
        <Col xs={12} className="EntryMinimalDetail Overflow mb-1">
          <Star size={14} animation={false} opacity={1} />
          <EntryDataCellLink className="ml-1" href={href}>
            {title}
          </EntryDataCellLink>
          <div
            className="EntryOptionsMinimalMenuContainer"
            onClick={(e) => e.stopPropagation()}
          >
            <EntryOptionsMenu
              entryId={id}
              title={title}
              is_public={is_public}
              author={author}
              shouldSyncOnUpdate={true}
            />
          </div>
        </Col>
        <Col xs={12} className="EntryMinimalTime mb-2">
          <i
            className="fas fa-calendar-day mr-1"
            style={{ fontSize: "1.25rem" }}
          />
          <Moment format="D MMMM YYYY hh:mma">{date_created_by_author}</Moment>
        </Col>
        <Col xs={12} className="EntryMinimalDetail Overflow">
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
          <TagsContainer showTagIcon={false} tags={tags} fontSize="1.5em">
            <i className="fas fa-tags mr-1" />
          </TagsContainer>
        </Col>
        <Col xs={12}>
          <TagsContainer
            showTagIcon={false}
            tags={people}
            fontSize="1.5em"
            emptyString="No people..."
          >
            <i className="fas fa-users mr-1" />
          </TagsContainer>
        </Col>
      </Row>
    </Container>
  )
}

EntryMinimal.propTypes = EntryPropTypes

export default memo(EntryMinimal)
