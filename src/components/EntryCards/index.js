import React, { lazy, memo } from "react"
import { Container, Row, Col } from "reactstrap"
import EntryCardHtml from "./EntryCardHtml"
import EntryCardTitle from "./EntryCardTitle"
import EntryCardText from "./EntryCardText"
import { BasicCard } from ".."
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../routes"
import PropTypes from "prop-types"
import "./styles.css"

const EntryOptionsMenu = lazy(() => import("../EntryOptionsMenu"))

const EntryCards = ({ className, entries }) => {
  const history = useHistory()

  const renderEntryCards = () =>
    entries.map((entry, i) => {
      const {
        id,
        tags,
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
      } = entry
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
          date_updated={date_updated}
          views={views}
          rating={rating}
          is_public={is_public}
        />
      )

      const memoProps = [
        id,
        tags,
        date_updated,
        views,
        rating,
        is_public,
        reducedHtml
      ]

      return (
        <Col key={id} xs={6} md={4} xl={3} className="p-1 p-sm-2">
          <BasicCard
            memoProps={memoProps}
            header={cardHeader}
            title={cardTitle}
            text={cardText}
            cardClassName="EntryCardContainer"
            cardBodyClassName="px-2 pt-0 pb-1"
            cardHeaderClassName="EntryCardHeader Overflow p-0"
            onClickCallback={onClickCallback}
          />
        </Col>
      )
    })

  return (
    <Container className={className}>
      <Row>{renderEntryCards()}</Row>
    </Container>
  )
}

EntryCards.propTypes = { entries: PropTypes.arrayOf(PropTypes.object) }

EntryCards.defaultProps = { className: "EntryCards" }

export default memo(EntryCards)
