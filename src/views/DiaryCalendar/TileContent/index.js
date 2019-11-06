import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { RouteMap, RouterPush } from "../../../ReactRouter/Routes"
import { GetUserEntriesByDate } from "../../../actions/Entries"
import { withRouter } from "react-router-dom"
import Content from "./Content"
import MomentJS from "moment"
import "./styles.css"

const mapStateToProps = ({ Entries: { items } }) => ({
  entries: items.filter(item => !item.shouldDelete)
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
    const { entries, date, staticContext, view } = props

    this.setState({ entries, date, staticContext, view })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderContent = entries => {
    const { date, staticContext, view } = this.state
    return entries.map(entry => {
      const { id, date_created_by_author, ...restOfProps } = entry
      const calendarDay = MomentJS(date)
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

  handleTodayClick = () => {
    const { history } = this.props
    const { HOME } = RouteMap
    setTimeout(() => RouterPush(history, HOME), 150)
  }

  render() {
    const { entries } = this.state
    return (
      <Fragment>
        <i
          className="fas fa-plus TileContentPlus"
          onClick={this.handleTodayClick}
        />
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
