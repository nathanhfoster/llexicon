import React, { useState, memo } from "react"
import { Container, Row, Col } from "reactstrap"
import EntryCardHtml from "./EntryCardHtml"
import EntryCardTitle from "./EntryCardTitle"
import EntryCardText from "./EntryCardText"
import { BasicCard } from ".."
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../ReactRouter/Routes"
import PropTypes from "prop-types"
import "./styles.css"

const ENTRIES_RENDER_OFFSET = 6

const renderEntryCards = ([start, end], entries, history) =>
  entries.slice(start, end).map((entry, i) => {
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
      <Col key={id} xl={3} lg={4} md={4} sm={6} xs={12} className="pl-3 pr-3">
        <BasicCard
          title={<EntryCardTitle title={title} />}
          text={
            <EntryCardText
              tags={tags}
              date_updated={date_updated}
              views={views}
              rating={rating}
            />
          }
          header={<EntryCardHtml html={html} views={views} rating={rating} />}
          cardHeaderClassName="p-0"
          onClickCallback={onClickCallback}
        />
      </Col>
    )
  })

const EntryCards = ({ entries }) => {
  const [viewableEntries, setViewableEntries] = useState([
    0,
    ENTRIES_RENDER_OFFSET * 2
  ])
  const [beginOffset, startOffset] = viewableEntries
  const history = useHistory()

  const handleScroll = ({
    target: { scrollHeight, scrollTop, clientHeight }
  }) => {
    const reachedBottom = scrollHeight - scrollTop === clientHeight

    if (reachedBottom) {
      setViewableEntries([beginOffset, startOffset + ENTRIES_RENDER_OFFSET])
    }
  }
  return (
    <Container className="EntryCards Container" onScroll={handleScroll}>
      <Row>{renderEntryCards(viewableEntries, entries, history)}</Row>
    </Container>
  )
}

EntryCards.propTypes = { entries: PropTypes.arrayOf(PropTypes.object) }

EntryCards.defaultProps = {}

export default memo(EntryCards)
