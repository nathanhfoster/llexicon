import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import Content from "./Content"
import MomentJS from "moment"
import { removeAttributeDuplicates } from "../../../helpers"

const mapStateToProps = ({ Entries: { items, itemsByDate } }) => ({
  entries: removeAttributeDuplicates(items.concat(itemsByDate), "id")
})

const mapDispatchToProps = {}

class TileContent extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

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
    let mapCounter = {}
    return entries.map((entry, i) => {
      const { id, date_created_by_author, ...restOfProps } = entry
      const calendarDay = MomentJS(date)
      const entryDate = MomentJS(date_created_by_author)
      const dayOfTheYear = calendarDay.dayOfYear()
      mapCounter[dayOfTheYear] = mapCounter[dayOfTheYear] + 1 || 1
      const eventFound = entryDate.isSame(calendarDay, "day")
      const shouldRenderInMobile = mapCounter[dayOfTheYear] < 2 ? true : false
      return (
        <Content
          id={id || i}
          date_created_by_author={date_created_by_author}
          {...restOfProps}
          activeDate={date}
          staticContext={staticContext}
          view={view}
          eventFound={eventFound}
          shouldRenderInMobile={shouldRenderInMobile}
        />
      )
    })
  }

  render() {
    const { entries } = this.state
    return this.renderContent(entries)
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TileContent)
