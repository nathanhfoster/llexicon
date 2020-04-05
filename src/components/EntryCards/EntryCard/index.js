import React, { lazy, memo } from "react"
import { EntryPropTypes } from "../../../redux/Entries/propTypes"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../../routes"
import { BasicCard } from "../../"
import EntryCardHtml from "../EntryCardHtml"
import EntryCardTitle from "../EntryCardTitle"
import EntryCardText from "../EntryCardText"
import "./styles.css"

const EntryOptionsMenu = lazy(() => import("../../EntryOptionsMenu"))

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
  _lastUpdated
}) => {
  const history = useHistory()
  const onClickCallback = () =>
    RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", id))
  const reducedHtml = html.slice(0, 1000)

  const cardHeader = (
    <div>
      <div
        className="EntryOptionsMenuContainer"
        onClick={e => e.stopPropagation()}
      >
        <EntryOptionsMenu entryId={id} is_public={is_public} />
      </div>
      <EntryCardHtml html={reducedHtml} views={views} rating={rating} />
    </div>
  )

  const cardTitle = <EntryCardTitle title={title} is_public={is_public} />

  const cardText = (
    <EntryCardText
      tags={tags}
      people={people}
      date_created_by_author={date_created_by_author}
      date_updated={date_updated}
      views={views}
      rating={rating}
      is_public={is_public}
    />
  )

  const memoProps = [
    id,
    tags,
    people,
    date_updated,
    views,
    rating,
    is_public,
    reducedHtml
  ]

  return (
    <BasicCard
      memoProps={memoProps}
      header={cardHeader}
      title={cardTitle}
      text={cardText}
      cardClassName="EntryCardContainer fade-in"
      cardHeaderClassName="EntryCardHeader Overflow p-0"
      cardBodyClassName="px-2 pt-0 pb-2"
      cardTextClassName="EntryCardText"
      onClickCallback={onClickCallback}
    />
  )
}

EntryCard.propTypes = { entry: EntryPropTypes }

EntryCard.defaultProps = {}

export default memo(EntryCard)
