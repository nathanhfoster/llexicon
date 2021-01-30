import React, { Fragment, memo } from 'react'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { Badge, Container, Row, Col } from 'reactstrap'
import { GoToEntryDetail } from 'redux/router/actions'
import Moment from 'react-moment'
import Star from '../../BackgroundImage/Star'
import { TagsContainer, EntryDataCellLink, EntryOptionsMenu } from '../../'
import { stripHtml } from 'utils'

import './styles.css'

export const EntryMinimal = ({
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

  const handleContainerClick = () => GoToEntryDetail(id)

  return (
    <Container
      fluid
      tag={Badge}
      className='EntryMinimal p-2'
      onClick={handleContainerClick}
      title={title}
    >
      <Row>
        <Col xs={12} className='EntryMinimalDetail Overflow mb-1'>
          <Star size={14} animation={false} opacity={1} />
          <EntryDataCellLink className='ml-1' entryId={id}>
            {title}
          </EntryDataCellLink>
          <div className='EntryOptionsMinimalMenuContainer' onClick={e => e.stopPropagation()}>
            <EntryOptionsMenu entryId={id} title={title} is_public={is_public} author={author} />
          </div>
        </Col>
        <Col xs={12} className='EntryMinimalTime mb-2'>
          <i className='fas fa-calendar-day mr-1' style={{ fontSize: '1.25rem' }} />
          <Moment format='D MMMM YYYY hh:mma'>{date_created_by_author}</Moment>
        </Col>
        <Col xs={12} className='EntryMinimalDetail Overflow'>
          <i className='far fa-eye' /> <span className='mr-2'>{views}</span>
          {showLocationIcon && (
            <Fragment>
              <i className='fas fa-map-marker-alt mr-1' />
              {address}
            </Fragment>
          )}
          {showFileIcon && <i className='far fa-file-image mr-1' />}
        </Col>
        <Col xs={12}>
          <TagsContainer showTagIcon={false} tags={tags} fontSize='1.5em'>
            <i className='fas fa-tags mr-1' />
          </TagsContainer>
        </Col>
        <Col xs={12}>
          <TagsContainer
            showTagIcon={false}
            tags={people}
            fontSize='1.5em'
            emptyString='No people...'
          >
            <i className='fas fa-users mr-1' />
          </TagsContainer>
        </Col>
        <Col xs={12}>
          <i className='fas fa-paragraph mt-1 mr-1' style={{ fontSize: '1.25rem' }} />
          <span
            className='Overflow'
            style={{ display: 'inline-block', fontSize: '1.25rem', width: 'calc(100% - 1rem)' }}
          >
            {stripHtml(html)}
          </span>
        </Col>
      </Row>
    </Container>
  )
}

EntryMinimal.propTypes = EntryPropTypes

export default memo(EntryMinimal)
