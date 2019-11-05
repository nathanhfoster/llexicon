import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, ButtonGroup, Button } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Calendar from "react-calendar/dist/entry.nostyle"
import TileContent from "./TileContent"
import Moment from "react-moment"
import EntryList from "../../components/EntryList"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { SetCalendar } from "../../actions/Calendar"
import { GetUserEntriesByDate } from "../../actions/Entries"
import "./styles.css"
import "./stylesM.css"

const mapStateToProps = ({ Calendar: { activeDate } }) => ({ activeDate })

const mapDispatchToProps = { SetCalendar, GetUserEntriesByDate }

class DiaryCalendar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    SetCalendar: PropTypes.func.isRequired,
    GetUserEntriesByDate: PropTypes.func.isRequired
  }

  static defaultProps = { activeDate: new Date() }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {
    const { activeDate, GetUserEntriesByDate } = this.props
    GetUserEntriesByDate(activeDate)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { activeDate } = props
    this.setState({ activeDate: new Date(activeDate) })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleChange = activeDate => {
    const { SetCalendar } = this.props
    SetCalendar({ activeDate })
  }

  handleTodayClick = () => {
    const { GetUserEntriesByDate } = this.props
    const activeStartDate = new Date()
    GetUserEntriesByDate(activeStartDate)
  }

  handleActiveDateChange = ({ activeStartDate, view }) => {
    const { GetUserEntriesByDate } = this.props
    GetUserEntriesByDate(activeStartDate)
  }

  render() {
    const { history } = this.props
    const { activeDate } = this.state
    return (
      <Container className="DiaryCalendar Container">
        <Row>
          <Col xs={12} className="p-0">
            <ButtonGroup>
              <Button color="primary" onClick={this.handleTodayClick}>
                Today
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={9} xs={12} className="p-0">
            <Calendar
              //calendarType="ISO 8601"
              onChange={this.handleChange}
              value={activeDate}
              ativeStartDate={new Date()} // fallback if value not set
              tileContent={props => <TileContent {...props} />}
              //tileClassName={this.tileHandler}
              minDetail={"year"}
              onActiveDateChange={this.handleActiveDateChange}
              onActiveStartDateChange={this.handleActiveDateChange}
              showFixedNumberOfWeeks={true}
              next2Label={null}
              prev2Label={null}
              nextLabel={
                <i className="fas fa-chevron-circle-right CalendarNavigationButton" />
              }
              prevLabel={
                <i className="fas fa-chevron-circle-left CalendarNavigationButton" />
              }
              onClickDay={null}
            />
          </Col>
          <Col className="EventList" md={3} xs={12}>
            <h2>
              <Moment format="MMM D">{activeDate}</Moment>
            </h2>
            <EntryList activeDate={activeDate} history={history} />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(DiaryCalendar)
)
