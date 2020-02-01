import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap"
import { withRouter } from "react-router-dom"
import Moment from "react-moment"
import MomentJS from "moment"
import { RouterPush } from "../../ReactRouter/Routes"
import { RouteMap } from "../../ReactRouter/Routes"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

const mapStateToProps = ({ Calendar: { activeDate }, Entries: { items } }) => {
  const entries = items.filter(entry => {
    const { date_created_by_author, shouldDelete } = entry
    const date = MomentJS(activeDate)
    const startDate = MomentJS(date_created_by_author)
    const sameDayEvent = startDate.isSame(date, "day")
    return !shouldDelete && sameDayEvent
  })
  return {
    activeDate,
    entries
  }
}

const mapDispatchToProps = {}

class EntryList extends Component {
  static propTypes = {
    activeDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired,
    entries: PropTypes.array
  }

  static defaultProps = {
    activeDate: new Date(),
    entries: []
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    return propsChanged
  }

  renderItems = entries => {
    const { history } = this.props
    return entries.map((e, i) => {
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
      return (
        <div key={i} className="ListItemContainer">
          <Row
            tag={ListGroupItem}
            key={id}
            onClick={() =>
              RouterPush(
                history,
                RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`)
              )
            }
            className="listItem"
            header={title}
          >
            <Col className="p-0" xs={10}>
              <Star size={8} color="White" animation={false} opacity={1} />
              <span className="eventTitle">{title || "No title"}</span>
            </Col>

            <Col className="eventDate p-0" xs={2}>
              {showImageIcon && <i className="fas fa-image mr-1" />}
              <Moment format="h:mma">{date_created_by_author}</Moment>
            </Col>

            <Col className="p-0" style={{ marginLeft: -4 }} xs={12}>
              <TagsContainer tags={tags} />
            </Col>
          </Row>
        </div>
      )
    })
  }

  render() {
    const { entries } = this.props

    return (
      <Container fluid tag={ListGroup} className="List">
        {this.renderItems(entries)}
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(EntryList)
)
