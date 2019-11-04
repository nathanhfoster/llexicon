import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import Calendar from "react-calendar/dist/entry.nostyle"
import TileContent from "./TileContent"
import Moment from "react-moment"
import EntryList from "../../components/EntryList"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { GetUserEntriesByDate } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { GetUserEntriesByDate }

class DiaryCalendar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = { GetUserEntriesByDate: PropTypes.func.isRequired }

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
    this.setState({ activeDate })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleChange = activeDate => this.setState({ activeDate })

  Today = () => {
    const { getYearMonthEvents } = this.props
    const activeStartDate = new Date()
    const payload = { date: activeStartDate }
    getYearMonthEvents(payload)
    this.setState({ activeDate: activeStartDate })
  }

  handleActiveDateChange = ({ activeStartDate, view }) => {
    const { getYearMonthEvents } = this.props
    const payload = { date: activeStartDate }
    getYearMonthEvents(payload)
    return this.setState({ activeDate: activeStartDate })
  }

  render() {
    const { history } = this.props
    const { activeDate } = this.state
    return (
      <Container className="DiaryCalendar Container">
        <Row>
          <Col md={10} xs={12} style={{ margin: 0, padding: 0 }}>
            <Calendar
              //calendarType="ISO 8601"
              onChange={this.handleChange}
              value={activeDate}
              ativeStartDate={new Date()} // fallback if value not set
              tileContent={props => <TileContent {...props} />}
              //tileClassName={this.tileHandler}
              minDetail={"year"}
              handleActiveDateChange={this.handleActiveDateChange}
              showFixedNumberOfWeeks={true}
              next2Label={null}
              prev2Label={null}
              nextLabel={<i className="fa fa-chevron-circle-right" />}
              prevLabel={<i className="fa fa-chevron-circle-left" />}
              onClickDay={null}
            />
          </Col>
          <Col className="EventList" md={2} xs={12}>
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
