import React, { memo } from "react"
import { Container, Row, Col } from "reactstrap"
import EntryCardHtml from "./EntryCardHtml"
import EntryCardTitle from "./EntryCardTitle"
import EntryCardText from "./EntryCardText"
import { BasicCard } from ".."
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../ReactRouter/Routes"
import PropTypes from "prop-types"

const renderEntryCards = (entries, history) =>
  entries
    // .slice(0, 12)
    .map((entry, i) => {
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
        author,
        _lastUpdated
      } = entry
      const onClickCallback = () =>
        RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))
      return (
        <Col key={id} md={4} xs={12}>
          <BasicCard
            title={<EntryCardTitle title={title} />}
            text={
              <EntryCardText
                tags={tags}
                EntryFiles={EntryFiles}
                date_created={date_created}
                date_created_by_author={date_created_by_author}
                date_updated={date_updated}
                views={views}
                rating={rating}
                address={address}
                latitude={latitude}
                longitude={longitude}
                _lastUpdated
              />
            }
            header={<EntryCardHtml html={html} views={views} rating={rating} />}
            button={null}
            cardHeaderClassName="p-0"
            onClickCallback={onClickCallback}
          />
        </Col>
      )
    })

const EntryCards = ({ entries }) => {
  const history = useHistory()
  return (
    <Container className="EntryCards Container">
      <Row>{renderEntryCards(entries, history)}</Row>
    </Container>
  )
}

EntryCards.propTypes = { entries: PropTypes.arrayOf(PropTypes.object) }

EntryCards.defaultProps = {}

export default memo(EntryCards)
