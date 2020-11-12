import React, { useMemo, lazy, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { EntryPropType } from 'redux/Entries/propTypes'
import { GetEntryDetailUrl } from 'redux/router/actions'
import { BasicCard } from '../../..'
import EntryCardHtml from '../EntryCardHtml'
import EntryCardTitle from '../EntryCardTitle'
import EntryCardText from '../EntryCardText'
import './styles.css'

const EntryOptionsMenu = lazy(() => import('../../EntryOptionsMenu'))

const EntryCard = ({
  id,
  tags,
  people,
  EntryFiles,
  title,
  html,
  date_created,
  date_created_by_author,
  date_updated,
  views,
  rating,
  address,
  latitude,
  longitude,
  is_public,
  author,
  _lastUpdated,
  _size,
  size,
  selected,
  onClick,
  minimal,
  cardClassName,
  cardHeaderClassName,
  cardBodyClassName,
  cardTextClassName,
  reduceHtml,
}) => {
  const href = useMemo(() => GetEntryDetailUrl(id), [id])
  const tag = onClick ? 'div' : 'a'

  const cardHeader = useMemo(
    () => (
      <Fragment>
        <EntryCardHtml html={html} reduceHtml={reduceHtml} />
        <div className='EntryOptionsMenuContainer' onClick={e => e.preventDefault()}>
          <EntryOptionsMenu
            entryId={id}
            title={title}
            is_public={is_public}
            author={author}
          />
        </div>
      </Fragment>
    ),
    [id, is_public, html, views, rating],
  )

  const cardTitle = useMemo(
    () => ({
      name: title,
      render: <EntryCardTitle title={title} is_public={is_public} />,
    }),
    [title, is_public],
  )

  const cardText = useMemo(
    () =>
      !minimal && (
        <EntryCardText
          tags={tags}
          people={people}
          date_created_by_author={date_created_by_author}
          date_updated={date_updated}
          views={views}
          rating={rating}
          size={size || _size}
        />
      ),
    [tags, people, date_created_by_author, date_updated, views, rating, _size, size, minimal],
  )

  return (
    <BasicCard
      selected={selected}
      tag={tag}
      onClick={onClick}
      href={href}
      header={cardHeader}
      title={cardTitle}
      text={cardText}
      cardClassName={cardClassName}
      cardHeaderClassName={cardHeaderClassName}
      cardBodyClassName={cardBodyClassName}
      cardTextClassName={cardTextClassName}
    />
  )
}

EntryCard.propTypes = {
  ...EntryPropType,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  minimal: PropTypes.bool.isRequired,
  cardClassName: PropTypes.string.isRequired,
  cardHeaderClassName: PropTypes.string.isRequired,
  cardBodyClassName: PropTypes.string.isRequired,
  cardTextClassName: PropTypes.string.isRequired,
  reduceHtml: PropTypes.bool.isRequired,
}

EntryCard.defaultProps = {
  selected: false,
  minimal: false,
  cardClassName: 'EntryCardContainer',
  cardHeaderClassName: 'EntryCardHeader Overflow p-0',
  cardBodyClassName: 'px-2 pt-0 pb-2',
  cardTextClassName: 'EntryCardText',
  reduceHtml: true,
}

export default memo(EntryCard)
