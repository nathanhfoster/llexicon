import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { RouteMap, RouterPush } from "../../../ReactRouter/Routes"
import { GetUserEntriesByDate } from "../../../actions/Entries"
import { withRouter } from "react-router-dom"
import EntryPreview from "./EntryPreview"
import MomentJS from "moment"
import deepEquals from "../../../helpers/deepEquals"
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

class TileContent extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    GetUserEntriesByDate: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      activeDate,
      entries,
      date,
      staticContext,
      view,
      isMobile
    } = nextProps
    const calendarDay = MomentJS(date)
    const activeDay = MomentJS(activeDate)

    const shouldRenderEntryPreview = view === "month"

    const shouldRenderPlusButton =
      shouldRenderEntryPreview && isMobile
        ? calendarDay.isSame(activeDay, "day")
        : true

    return {
      shouldRenderEntryPreview,
      shouldRenderPlusButton,
      calendarDay,
      entries,
      date,
      staticContext,
      view
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }
  
  handleTodayClick = () => {
    const { history } = this.props
    const { NEW_ENTRY } = RouteMap
    setTimeout(() => RouterPush(history, NEW_ENTRY), 150)
  }

  handleTileClick = () => {
    const { onTileClick } = this.props
    const { date } = this.state

    onTileClick(date)
  }

  renderEntryPreviews = entries => {
    const { calendarDay, date, staticContext, view } = this.state

    return entries.map(entry => {
      const { id, date_created_by_author, ...restOfProps } = entry

      const entryDate = MomentJS(date_created_by_author)
      const eventFound = entryDate.isSame(calendarDay, "day")
      const dayOfTheYear = calendarDay.dayOfYear()
      return (
        eventFound && (
          <EntryPreview
            key={id}
            id={id}
            date_created_by_author={date_created_by_author}
            {...restOfProps}
            date={date}
            staticContext={staticContext}
            view={view}
          />
        )
      )
    })
  }

  render() {
    const {
      shouldRenderEntryPreview,
      shouldRenderPlusButton,
      entries
    } = this.state

    return (
      <Fragment>
        {shouldRenderPlusButton && (
          <i
            className="fas fa-plus TileContentPlus"
            onClick={this.handleTodayClick}
          />
        )}
        {shouldRenderEntryPreview && (
          <div className="TileContentContainer">
            {this.renderEntryPreviews(entries)}
          </div>
        )}
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(TileContent)
)
