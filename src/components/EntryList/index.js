import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap"
import Moment from "react-moment"
import MomentJS from "moment"
import { removeAttributeDuplicates } from "../../helpers"
import { RouterPush } from "../../ReactRouter/Routes"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"
import "./styles.css"

const mapStateToProps = ({ Entries: { items } }) => ({
  entries: items.filter(item => !item.shouldDelete)
})

const mapDispatchToProps = {}

class EntryList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      entries: []
    }
  }

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

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  renderItems = (date, entries, history) =>
    entries.map((e, i) => {
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
      const activeDate = MomentJS(date)
      const startDate = MomentJS(date_created_by_author)
      const sameDayEvent = startDate.isSame(activeDate, "day")
      const showImageIcon = EntryFiles.length > 0
      return (
        <div key={i} className="ListItemContainer">
          {sameDayEvent ? (
            <Row
              tag={ListGroupItem}
              key={id}
              onClick={() => RouterPush(history, `/calendar/${id}`)}
              className="listItem"
              header={title}
            >
              <Col className="p-0" xs={10}>
                <Star
                  size={8}
                  color="White"
                  animation={false}
                  opacity={1}
                />
                <span className="eventTitle">{title || "No title"}</span>
              </Col>

              <Col className="eventDate p-0" xs={2}>
                {showImageIcon && <i className="fas fa-image mr-1" />}
                <Moment format="h:mma">{date_created_by_author}</Moment>
              </Col>

              <Col className="p-0" style={{ marginLeft: -4 }} xs={12}>
                <TagsContainer
                  tags={tags}
                  minimalView={false}
                  hoverable={false}
                />
              </Col>
            </Row>
          ) : null}
        </div>
      )
    })

  render() {
    const { history } = this.props
    const { entries, activeDate } = this.state
    return (
      <Container fluid tag={ListGroup} className="List">
        {this.renderItems(activeDate, entries, history)}
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryList)
