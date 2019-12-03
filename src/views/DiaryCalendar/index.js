import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Calendar from "react-calendar/dist/entry.nostyle"
import TileContent from "./TileContent"
import Moment from "react-moment"
import EntryList from "../../components/EntryList"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush, RouteMap } from "../../ReactRouter/Routes"
import { SetCalendar } from "../../actions/Calendar"
import {
  GetEntryTags,
  SyncEntries,
  GetUserEntriesByDate
} from "../../actions/Entries"
import MomentJS from "moment"
import "./styles.css"
import "./stylesM.css"

const mapStateToProps = ({ Calendar: { activeDate, view } }) => ({
  activeDate,
  view
})

const mapDispatchToProps = {
  SetCalendar,
  GetEntryTags,
  SyncEntries,
  GetUserEntriesByDate
}

class DiaryCalendar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    SetCalendar: PropTypes.func.isRequired,
    GetEntryTags: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired,
    GetUserEntriesByDate: PropTypes.func.isRequired
  }

  static defaultProps = { activeDate: new Date() }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeDate, view } = nextProps

    return { activeDate: new Date(activeDate), view }
  }

  componentDidMount() {
    const { activeDate, GetEntryTags, SyncEntries } = this.props
    GetEntryTags()
    SyncEntries(
      () =>
        new Promise(resolve => resolve(this.getUserEntriesByDate(activeDate)))
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeDate, view } = this.state
    const activeDateMoment = MomentJS(activeDate)
    const previousActiveDateMoment = MomentJS(prevState.activeDate)

    const monthChanged =
      view === "month" &&
      !activeDateMoment.isSame(previousActiveDateMoment, "month")

    const dayChanged =
      view === "month" &&
      !activeDateMoment.isSame(previousActiveDateMoment, "day")

    if (monthChanged) {
      //this.handleDateChange({ activeStartDate: activeDate, view })
      this.getUserEntriesByDate(activeDate)
    } else if (dayChanged) {
      // this.handleDateChange({ activeStartDate: activeDate, view })
    }
  }

  componentWillUnmount() {}

  handleDateChange = ({ activeStartDate, view }) => {
    const { SetCalendar } = this.props

    const now = new Date()
    const activeDate = new Date(activeStartDate)
    activeDate.setHours(now.getHours())
    activeDate.setMinutes(now.getMinutes())
    activeDate.setSeconds(now.getSeconds())
    activeDate.setMilliseconds(now.getMilliseconds())

    SetCalendar({ activeDate, view })
  }

  getUserEntriesByDate = date => {
    // console.log("getUserEntriesByDate: ", date)
    const { GetUserEntriesByDate } = this.props
    GetUserEntriesByDate(date)
  }

  handleTodayClick = () => {
    const { SetCalendar } = this.props
    const activeDate = new Date()
    SetCalendar({ activeDate })
  }

  render() {
    const { history } = this.props
    const { NEW_ENTRY } = RouteMap
    const { activeDate } = this.state
    return (
      <Container fluid className="DiaryCalendar Container">
        <Row>
          <Col
            className="EventList"
            md={{ size: 3, order: 1 }}
            xs={{ size: 12, order: 2 }}
          >
            <div className="EventListHeader Center">
              <Button
                color="inherit"
                className="TodayButton mr-1"
                onClick={this.handleTodayClick}
              >
                <i className="fas fa-calendar-day NavBarImage NavBarLink" />
              </Button>
              <Moment format="MMM D">{activeDate}</Moment>
              <Button
                color="inherit"
                className="TodayButton ml-1"
                onClick={() => RouterPush(history, NEW_ENTRY)}
              >
                <i className="fas fa-feather-alt NavBarImage NavBarLink" />
              </Button>
            </div>
            <EntryList activeDate={activeDate} history={history} />
          </Col>
          <Col
            md={{ size: 9, order: 2 }}
            xs={{ size: 12, order: 1 }}
            className="p-0"
          >
            <Calendar
              //calendarType="ISO 8601"
              value={activeDate}
              ativeStartDate={new Date()} // fallback if value not set
              tileContent={props => <TileContent {...props} />}
              //tileClassName={this.tileHandler}
              // minDetail={"year"}
              showFixedNumberOfWeeks={true}
              next2Label={null}
              prev2Label={null}
              nextLabel={
                <i className="fas fa-chevron-circle-right CalendarNavigationButton" />
              }
              prevLabel={
                <i className="fas fa-chevron-circle-left CalendarNavigationButton" />
              }
              onChange={null}
              onActiveDateChange={this.handleDateChange}
              onClickDay={activeStartDate =>
                this.handleDateChange({ activeStartDate, view: "month" })
              }
              // onClickWeekNumber={props => console.log("Week: ", props)}
              onClickMonth={activeStartDate =>
                this.handleDateChange({ activeStartDate, view: "month" })
              }
              onClickYear={activeStartDate =>
                this.handleDateChange({ activeStartDate, view: "year" })
              }
              onClickDecade={activeStartDate =>
                this.handleDateChange({ activeStartDate, view: "decade" })
              }
            />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(DiaryCalendar)
)
