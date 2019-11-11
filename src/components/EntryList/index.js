import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ListGroup, ListGroupItem, Col } from "reactstrap"
import Moment from "react-moment"
import MomentJS from "moment"
import { removeAttributeDuplicates } from "../../helpers"
import { RouterPush } from "../../ReactRouter/Routes"
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

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { activeDate, entries } = props
    this.setState({
      activeDate,
      entries
    })
  }

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
                <span
                  className="EventColorLabelContainer"
                  style={{ backgroundColor: "var(--secondaryColor)" }}
                />
                <Moment format="hh:mma">{date_created_by_author}</Moment>
              </span>
              <h5 className="eventTitle">{title}</h5>
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
