import React, { useState, memo } from "react"
import { Container, Row, Col } from "reactstrap"
import EntryCardHtml from "./EntryCardHtml"
import EntryCardTitle from "./EntryCardTitle"
import EntryCardText from "./EntryCardText"
import { BasicCard } from ".."
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../routes"
import PropTypes from "prop-types"
import "./styles.css"

const ENTRIES_RENDER_OFFSET = 6

const EntryCards = ({ className, entries }) => {
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

  const renderEntryCards = () =>
    entries.slice(beginOffset, startOffset).map((entry, i) => {
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
      const reducedHtml = html.slice(0, 1000)
      return (
        <Col key={id} xl={3} md={4} sm={6} xs={12} className="p-1 p-sm-2">
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
            header={
              <EntryCardHtml html={reducedHtml} views={views} rating={rating} />
            }
            cardHeaderClassName="p-0"
            onClickCallback={onClickCallback}
          />
        </Col>
      )
    })

  return (
    <Container className={`${className} Container`} onScroll={handleScroll}>
      <Row>{renderEntryCards(viewableEntries, entries, history)}</Row>
    </Container>
  )
}

EntryCards.propTypes = { entries: PropTypes.arrayOf(PropTypes.object) }

EntryCards.defaultProps = { className: "EntryCards" }

export default memo(EntryCards)
