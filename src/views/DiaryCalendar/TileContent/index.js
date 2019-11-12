import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { RouteMap, RouterPush } from "../../../ReactRouter/Routes"
import { GetUserEntriesByDate } from "../../../actions/Entries"
import { withRouter } from "react-router-dom"
import Content from "./Content"
import MomentJS from "moment"
import "./styles.css"

const mapStateToProps = ({
  Calendar: { activeDate },
  Entries: { items },
  Window: { isMobile }
}) => ({
  activeDate,
  entries: items.filter(item => !item.shouldDelete),
  isMobile
})

const mapDispatchToProps = { GetUserEntriesByDate }

class TileContent extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = { GetUserEntriesByDate: PropTypes.func.isRequired }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { activeDate, entries, date, staticContext, view, isMobile } = props
    const calendarDay = MomentJS(date)
    const activeDay = MomentJS(activeDate)

    const shouldRenderPlusButton = isMobile
      ? calendarDay.isSame(activeDay, "day")
      : true

    this.setState({
      shouldRenderPlusButton,
      calendarDay,
      entries,
      date,
      staticContext,
      view
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderContent = entries => {
    const { calendarDay, date, staticContext, view } = this.state
    return entries.map(entry => {
      const { id, date_created_by_author, ...restOfProps } = entry

      const entryDate = MomentJS(date_created_by_author)
      const eventFound = entryDate.isSame(calendarDay, "day")
      const dayOfTheYear = calendarDay.dayOfYear()

      return (
        eventFound && (
          <Content
            key={id}
            id={id}
            date_created_by_author={date_created_by_author}
            {...restOfProps}
            activeDate={date}
            staticContext={staticContext}
            view={view}
            shouldRenderInMobile={true}
          />
        )
      )
    })
  }

  handleTodayClick = e => {
    console.log(e.target)
    const { history } = this.props
    const { HOME } = RouteMap
    // setTimeout(() => RouterPush(history, HOME), 150)
  }

  render() {
    const { shouldRenderPlusButton, entries } = this.state
    return (
      <Fragment>
        {shouldRenderPlusButton && (
          <i
            className="fas fa-plus TileContentPlus"
            onClick={this.handleTodayClick}
          />
        )}
        <div className="TileContentContainer">
          {this.renderContent(entries)}
        </div>
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(TileContent)
)
