import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap"
import { BasicList } from "../"
import { withRouter } from "react-router-dom"
import Moment from "react-moment"
import MomentJS from "moment"
import { RouterPush, RouteMap } from "../../routes"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"
import "./styles.css"

const mapStateToProps = ({
  Window: { innerHeight, navBarHeight, isMobile }
}) => ({
  listHeight: isMobile ? 330 : innerHeight - navBarHeight
})

const EntryList = ({ history, entriesWithinView, activeDate, listHeight }) => {
  const entries = useMemo(
    () =>
      entriesWithinView
        .filter(entry => {
          const { date_created_by_author, _shouldDelete } = entry
          const date = MomentJS(activeDate)
          const startDate = MomentJS(date_created_by_author)
          const sameDayEvent = startDate.isSame(date, "day")
          return !_shouldDelete && sameDayEvent
        })
        .map((e, i) => {
          const {
            id,
            author,
            tags,
            title,
            html,
            date_created,
            date_created_by_author,
            date_updated,
            views,
            EntryFiles
          } = e
          const showImageIcon = EntryFiles.length > 0
          return {
            id,
            value: (
              <Row
                key={id}
                tag={ListGroupItem}
                onClick={() =>
                  RouterPush(
                    history,
                    RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`)
                  )
                }
                className="listItem"
              >
                <Col xs={10} className="eventTitle">
                  <Star size={8} color="White" animation={false} opacity={1} />
                  <span className="ml-1">{title || "No title"}</span>
                </Col>

                <Col className="eventDate p-0" xs={2}>
                  {showImageIcon && <i className="fas fa-image mr-1" />}
                  <Moment format="h:mma">{date_created_by_author}</Moment>
                </Col>

                <Col xs={12} className="pr-0">
                  <TagsContainer tags={tags} />
                </Col>
              </Row>
            )
          }
        }),
    [entriesWithinView, activeDate]
  )

  const listStyles = { padding: "2px 0", color: "white" }

  return (
    <Container fluid tag={ListGroup} className="List">
      <BasicList
        list={entries}
        height={listHeight}
        itemSize={72}
        listItemStyles={listStyles}
      />
    </Container>
  )
}

EntryList.propTypes = {
  activeDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  entriesWithinView: PropTypes.arrayOf(PropTypes.object)
}

export default reduxConnect(mapStateToProps)(withRouter(memo(EntryList)))
