import React, { useEffect, useRef, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Calendar from "react-calendar"
import Moment from "react-moment"
import MomentJS from "moment"
import { withRouter } from "react-router-dom"
import { RouterPush, RouteMap } from "../../routes"
import { SetCalendar } from "../../redux/Calendar/actions"
import { GetUserEntriesByDate } from "../../redux/Entries/actions"
import TileContent from "./TileContent"
import EntryList from "../EntryList"
import "./styles.css"
import "./stylesM.css"

const mapStateToProps = ({
  Calendar: { activeDate, view },
  Entries: { items },
}) => ({ entries: items, activeDate, view })

const mapDispatchToProps = {
  SetCalendar,
  GetUserEntriesByDate,
}

const EntryCalendar = ({
  entries,
  activeDate,
  view,
  SetCalendar,
  GetUserEntriesByDate,
  history,
}) => {
  useEffect(() => {
    GetUserEntriesByDate(activeDate)
  }, [])

  const previousActiveStartDate = useRef(activeDate)

  const calendarDate = MomentJS(activeDate)

  const activeStartDate = calendarDate.startOf("month").toDate()

  const entriesWithinView = useMemo(
    () =>
      entries
        .filter((entry) => {
          const { date_created_by_author, _shouldDelete } = entry
          const entryDate = MomentJS(date_created_by_author)
          const entryDateWithinView = entryDate.isSame(calendarDate, view)

          return !_shouldDelete && entryDateWithinView
        })
        .sort(
          (a, b) =>
            new Date(a.date_created_by_author) -
            new Date(b.date_created_by_author)
        ),
    [activeDate, entries]
  )

  const handleDateChange = ({ activeStartDate, view }) => {
    const now = new Date()
    const activeDate = new Date(activeStartDate)
    activeDate.setHours(now.getHours())
    activeDate.setMinutes(now.getMinutes())
    activeDate.setSeconds(now.getSeconds())
    activeDate.setMilliseconds(now.getMilliseconds())

    const shouldGetUserEntries =
      new Date(previousActiveStartDate.current).getMonth() !==
      activeDate.getMonth()

    SetCalendar({ activeDate, view })

    if (shouldGetUserEntries) GetUserEntriesByDate(activeStartDate)
  }

  const handleTodayClick = () => {
    const activeStartDate = new Date()
    handleDateChange({ activeStartDate, view: "month" }, false)
  }

  const handleNewEntryClick = () => RouterPush(history, RouteMap.NEW_ENTRY)

  const handleOnChange = (activeStartDate) =>
    handleDateChange({ activeStartDate, view }, false)

  const handleOnClickDay = (activeStartDate) =>
    handleDateChange({ activeStartDate, view: "month" }, false)

  const handleOnClickMonth = (activeStartDate) =>
    handleDateChange({ activeStartDate, view: "month" }, false)

  const handleOnClickYear = (activeStartDate) =>
    handleDateChange({ activeStartDate, view: "year" }, false)

  const handleOnClickDecade = (activeStartDate) =>
    handleDateChange({ activeStartDate, view: "decade" }, false)

  return (
    <Container fluid className="EntryCalendar Container">
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
              onClick={handleTodayClick}
            >
              <i className="fas fa-calendar-day NavBarImage NavBarLink" />
            </Button>
            <Moment format="MMM D">{activeDate}</Moment>
            <Button
              color="inherit"
              className="TodayButton ml-1"
              onClick={handleNewEntryClick}
            >
              <i className="fas fa-feather-alt NavBarImage NavBarLink" />
            </Button>
          </div>
          <EntryList
            activeDate={activeDate}
            entriesWithinView={entriesWithinView}
          />
        </Col>
        <Col
          md={{ size: 9, order: 2 }}
          xs={{ size: 12, order: 1 }}
          className="p-0"
        >
          {/* https://github.com/wojtekmaj/react-calendar#readme */}
          <Calendar
            // calendarType="ISO 8601"
            // defaultValue={activeDate}
            // defaultActiveStartDate={activeStartDate}
            activeStartDate={activeStartDate}
            value={activeDate}
            defaultView="month"
            tileContent={(props) => (
              <TileContent
                {...props}
                activeDate={activeDate}
                entriesWithinView={entriesWithinView}
              />
            )}
            // tileClassName={tileHandler}
            // minDetail={"year"}
            showWeekNumbers={false}
            showFixedNumberOfWeeks={true}
            showNeighboringMonth={true}
            next2Label={null}
            prev2Label={null}
            nextLabel={
              <i className="fas fa-chevron-circle-right CalendarNavigationButton" />
            }
            prevLabel={
              <i className="fas fa-chevron-circle-left CalendarNavigationButton" />
            }
            onActiveStartDateChange={handleDateChange}
            onChange={handleOnChange}
            // onViewChange={}
            // onClickDay={handleOnClickDay}
            // onClickWeekNumber={props => console.log("Week: ", props)}
            // onClickMonth={handleOnClickMonth}
            // onClickYear={handleOnClickYear}
            // onClickDecade={handleOnClickDecade}
            // onViewChange={handleDateChange}
            // onDrillDown={}
            // onDrillUp={}
          />
        </Col>
      </Row>
    </Container>
  )
}

EntryCalendar.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
  view: PropTypes.string.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  GetUserEntriesByDate: PropTypes.func.isRequired,
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(EntryCalendar)
)
