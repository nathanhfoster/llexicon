import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import Content from "./Content"
import MomentJS from "moment"
import "./styles.css"

const mapStateToProps = ({ Entries: { items } }) => ({
  entries: items
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
    return entries.map((entry, i) => {
      const { id, date_created_by_author, ...restOfProps } = entry
      const calendarDay = MomentJS(date)
      const entryDate = MomentJS(date_created_by_author)
      const eventFound = entryDate.isSame(calendarDay, "day")
      const dayOfTheYear = calendarDay.dayOfYear()

      const uniqueId = id || i
      console.log(uniqueId)

      return (
        eventFound && (
          <Content
            key={uniqueId}
            id={uniqueId}
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

  render() {
    const { entries } = this.state
    return (
      <div className="TileContentContainer">{this.renderContent(entries)}</div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TileContent)
