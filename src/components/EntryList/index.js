import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem, Col } from "reactstrap"
import Moment from "react-moment"
import MomentJS from "moment"
import { removeAttributeDuplicates } from "../../helpers"
import { RouterPush } from "../../ReactRouter/Routes"
import Star from "../BackgroundImage/Star"
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
        views
      } = e
      const activeDate = MomentJS(date)
      const startDate = MomentJS(date_created_by_author)
      const sameDayEvent = startDate.isSame(activeDate, "day")
      return (
        <div key={i} className="ListItemContainer">
          {sameDayEvent ? (
            <ListGroupItem
              key={id}
              onClick={() => RouterPush(history, `/calendar/${id}`)}
              className="listItem"
              header={title}
            >
              <span className="eventDate">
                <Star
                  inherit
                  size={8}
                  marginRight={2}
                  color="White"
                  animation={false}
                  opacity={1}
                />
                <Moment format="h:mma">{date_created_by_author}</Moment>
              </span>
              <h5 className="eventTitle">{title || "No title"}</h5>
            </ListGroupItem>
          ) : null}
        </div>
      )
    })

  render() {
    const { history } = this.props
    const { entries, activeDate } = this.state
    return (
      <ListGroup className="List">
        {this.renderItems(activeDate, entries, history)}
      </ListGroup>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryList)
