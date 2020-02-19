import React, { useState, memo } from "react"
import { Container, Row, Col } from "reactstrap"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import EntryCardHtml from "./EntryCardHtml"
import EntryCardTitle from "./EntryCardTitle"
import EntryCardText from "./EntryCardText"
import { BasicCard } from ".."
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../ReactRouter/Routes"
import PropTypes from "prop-types"
import "./styles.css"

const INITIAL_ENTRIES_RENDERED = 6

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
      <Col key={id} md={4} xs={12}>
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
    INITIAL_ENTRIES_RENDERED
  ])
  const history = useHistory()

  const handleScroll = ({
    target: { scrollHeight, scrollTop, clientHeight }
  }) => {
    const reachedBottom = scrollHeight - scrollTop === clientHeight

    if (reachedBottom) {
      setViewableEntries([
        viewableEntries[0],
        viewableEntries[1] + INITIAL_ENTRIES_RENDERED
      ])
    }
  }
  return (
    <Container
      tag={OverlayScrollbarsComponent}
      className="EntryCards Container os-theme-light"
      onScroll={handleScroll}
    >
      <Row>{renderEntryCards(viewableEntries, entries, history)}</Row>
    </Container>
  )
}

EntryCards.propTypes = { entries: PropTypes.arrayOf(PropTypes.object) }

EntryCards.defaultProps = {}

export default memo(EntryCards)
