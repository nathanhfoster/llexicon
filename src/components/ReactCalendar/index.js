import React, { lazy, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Calendar from "react-calendar/dist/entry.nostyle"
import Moment from "react-moment"
import MomentJS from "moment"
import { withRouter } from "react-router-dom"
import { RouterPush, RouteMap } from "../ReactRouter/Routes"
import { SetCalendar } from "../../redux/Calendar/Calendar"
import { GetUserEntriesByDate } from "../../redux/Entries/actions"
import TileContent from "./TileContent"
import EntryList from "../EntryList"
import "./styles.css"
import "./stylesM.css"

const mapStateToProps = ({
  Calendar: { activeDate, view },
  Entries: { items }
}) => ({ entries: items, activeDate, view })

const mapDispatchToProps = {
  SetCalendar,
  GetUserEntriesByDate
}

const ReactCalendar = ({
  entries,
  activeDate,
  view,
  SetCalendar,
  GetUserEntriesByDate,
  history
}) => {
  useEffect(() => {
    GetUserEntriesByDate(activeDate)
  }, [])

  const calendarDate = MomentJS(activeDate)

  const entriesWithinView = useMemo(
    () =>
      entries.filter(entry => {
        const { date_created_by_author, _shouldDelete } = entry
        const entryDate = MomentJS(date_created_by_author)
        const entryDateWithinView = entryDate.isSame(calendarDate, view)

        return !_shouldDelete && entryDateWithinView
      }),
    [entries]
  )

  const handleDateChange = (
    { activeStartDate, view },
    shouldGetUserEntries = true
  ) => {
    const now = new Date()
    const activeDate = new Date(activeStartDate)
    activeDate.setHours(now.getHours())
    activeDate.setMinutes(now.getMinutes())
    activeDate.setSeconds(now.getSeconds())
    activeDate.setMilliseconds(now.getMilliseconds())

    SetCalendar({ activeDate, view })

    if (shouldGetUserEntries) GetUserEntriesByDate(activeStartDate)
  }

  const handleTodayClick = () => {
    const activeDate = new Date()
    SetCalendar({ activeDate })
  }

  const handleNewEntryClick = () => RouterPush(history, RouteMap.NEW_ENTRY)

  const handleOnClickDay = activeStartDate =>
    handleDateChange({ activeStartDate, view: "month" }, false)

  const handleOnClickMonth = activeStartDate =>
    handleDateChange({ activeStartDate, view: "month" }, false)

  const handleOnClickYear = activeStartDate =>
    handleDateChange({ activeStartDate, view: "year" }, false)

  const handleOnClickDecade = activeStartDate =>
    handleDateChange({ activeStartDate, view: "decade" }, false)

  return (
    <Container fluid className="ReactCalendar Container">
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
          <Calendar
            //calendarType="ISO 8601"
            value={activeDate}
            ativeStartDate={new Date()} // fallback if value not set
            tileContent={props => (
              <TileContent
                {...props}
                activeDate={activeDate}
                entriesWithinView={entriesWithinView}
              />
            )}
            //tileClassName={tileHandler}
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
            onActiveDateChange={handleDateChange}
            onClickDay={handleOnClickDay}
            // onClickWeekNumber={props => console.log("Week: ", props)}
            onClickMonth={handleOnClickMonth}
            onClickYear={handleOnClickYear}
            onClickDecade={handleOnClickDecade}
          />
        </Col>
      </Row>
    </Container>
  )
}

ReactCalendar.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  view: PropTypes.string.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  GetUserEntriesByDate: PropTypes.func.isRequired
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactCalendar)
)
