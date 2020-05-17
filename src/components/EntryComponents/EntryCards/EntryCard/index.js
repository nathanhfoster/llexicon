import React, { useCallback, useMemo, lazy, Fragment } from "react"
import { EntryPropTypes } from "../../../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { GetEntryDetailUrl } from "../../../../redux/router/actions"
import { BasicCard } from "../../.."
import EntryCardHtml from "../EntryCardHtml"
import EntryCardTitle from "../EntryCardTitle"
import EntryCardText from "../EntryCardText"
import "./styles.css"

const EntryOptionsMenu = lazy(() => import("../../EntryOptionsMenu"))

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

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
  userId,
}) => {
  const href = useMemo(() => GetEntryDetailUrl(id), [id])
  const readOnly = Boolean(author && userId && userId !== author)
  const reducedHtml = html.slice(0, 1000)

  const cardHeader = useMemo(
    () => (
      <Fragment>
        <EntryCardHtml html={reducedHtml} views={views} rating={rating} />
        <div
          className="EntryOptionsMenuContainer"
          onClick={(e) => e.preventDefault()}
        >
          <EntryOptionsMenu
            entryId={id}
            title={title}
            is_public={is_public}
            shouldSyncOnUpdate={true}
            readOnly={readOnly}
          />
        </div>
      </Fragment>
    ),
    [id, is_public, reducedHtml, views, rating]
  )

  const cardTitle = useMemo(
    () => ({
      name: title,
      render: <EntryCardTitle title={title} is_public={is_public} />,
    }),
    [title, is_public]
  )

  const cardText = useMemo(
    () => (
      <EntryCardText
        tags={tags}
        people={people}
        date_created_by_author={date_created_by_author}
        date_updated={date_updated}
        views={views}
        rating={rating}
        is_public={is_public}
      />
    ),
    [
      tags,
      people,
      date_created_by_author,
      date_updated,
      views,
      rating,
      is_public,
    ]
  )

  return (
    <BasicCard
      tag="a"
      href={href}
      header={cardHeader}
      title={cardTitle}
      text={cardText}
      cardClassName="EntryCardContainer"
      cardHeaderClassName="EntryCardHeader Overflow p-0"
      cardBodyClassName="px-2 pt-0 pb-2"
      cardTextClassName="EntryCardText"
    />
  )
}

EntryCard.propTypes = { entry: EntryPropTypes }

EntryCard.defaultProps = {}

export default reduxConnect(mapStateToProps)(EntryCard)
