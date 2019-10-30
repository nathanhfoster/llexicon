import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import Calendar from "react-calendar/dist/entry.nostyle";
import EventList from "../../components/EventList";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button,
  InputGroup
} from "react-bootstrap";
import Select from "react-select";
import { eventLabelColor, isSubset, splitString } from "../../helpers";
import { UserHasPermissions } from "../../helpers/userPermissions";
import { eventOptions } from "../../helpers/options";
import { selectStyles } from "../../helpers/styles";
import Moment from "react-moment";
import MomentJS from "moment";
import "./styles.css";
import "./stylesM.css";
import { getYearMonthEvents, clearEventsApi } from "../../actions/Events";

const mapStateToProps = ({ User, Window, Events }) => ({
  User,
  Window,
  Events
});

const mapDispatchToProps = { getYearMonthEvents, clearEventsApi };

class GuildCalendar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      typeFilter: [],
      activeDate: null,
      isMobile: false,
      show: false,
      editing: false
    };
  }

  static propTypes = {
    activeDate: PropTypes.string,
    isMobile: PropTypes.bool
  };

  static defaultProps = { activeDate: new Date() };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getYearMonthEvents, activeDate, clearEventsApi } = this.props;
    clearEventsApi();
    const payload = { date: activeDate };
    getYearMonthEvents(payload);
    this.setState({ activeDate });
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events, Window } = props;
    this.setState({ User, Events, Window });
  };

  onChange = activeDate => this.setState({ activeDate });

  Today = () => {
    const { getYearMonthEvents } = this.props;
    const activeStartDate = new Date();
    const payload = { date: activeStartDate };
    getYearMonthEvents(payload);
    this.setState({ activeDate: activeStartDate });
  };

  onActiveDateChange = ({ activeStartDate, view }) => {
    const { getYearMonthEvents } = this.props;
    const payload = { date: activeStartDate };
    getYearMonthEvents(payload);
    return this.setState({ activeDate: activeStartDate });
  };

  filterForms = (typeFilter, tags, sub_tags) => {
    const allTags = sub_tags
      ? [...tags.split("|"), ...sub_tags.split("|")]
      : tags.split("|");
    const filter = typeFilter.map(f => f.value);
    return typeFilter.length > 0 ? isSubset(allTags, filter) : true;
  };

  onSelectChange = (typeFilter, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        typeFilter = eventOptions.filter(v => v.isFixed);
        break;
    }
    this.setState({ typeFilter });
  };

  render() {
    const { history } = this.props;
    const {
      User,
      Events,
      Window,
      activeDate,
      show,
      editing,
      typeFilter
    } = this.state;
    const { isMobile } = Window;
    const tileContent = ({ date, view }) => {
      const { hovering, hoverIndex } = this.state;
      //console.log("HERE: ", Events);
      let mapCounter = {}; // Use to display only 1 eventLabelColor per day for mobile
      return (
        <div class="TileContent">
          {Events.results
            .filter(e => this.filterForms(typeFilter, e.tags, e.sub_tags))
            .map((e, i) => {
              const {
                id,
                start_date,
                end_date,
                title,
                description,
                author,
                author_username,
                last_modified_by,
                tags,
                sub_tags,
                min_level,
                max_level,
                role_preferences,
                class_preferences,
                location,
                group_size
              } = e;
              const calendarDay = MomentJS(date);
              const eventStartTime = MomentJS(start_date);
              const eventFound = eventStartTime.isSame(calendarDay, "day");

              const dayOfTheYear = eventStartTime.dayOfYear();
              //console.log("calendarDay: ", calendarDay);
              mapCounter[dayOfTheYear] = mapCounter[dayOfTheYear] + 1 || 1;

              return view == "month" && eventFound && !isMobile ? (
                <div
                  onClick={() => history.push(`/calendar/event/${id}`)}
                  className="hasEventsContainer"
                  data-for={`${id}`}
                  data-tip={i}
                >
                  <span
                    className="eventLabelColor"
                    style={{ backgroundColor: eventLabelColor(tags, sub_tags) }}
                  />
                  <span>
                    <Moment format="hh:mma">{start_date}</Moment>
                  </span>
                  <h6 className="eventTitle">{title}</h6>
                </div>
              ) : view == "month" &&
                eventFound &&
                mapCounter[dayOfTheYear] < 2 ? (
                <div class="hasEventsContainerMobile">
                  <span
                    className="eventLabelColor"
                    style={{ backgroundColor: eventLabelColor(tags, sub_tags) }}
                  />
                </div>
              ) : null;
            })}
        </div>
      );
    };
    return (
      <Grid className="GuildCalendar Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            md={4}
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(User, "add_event") && (
              <Button
                onClick={() => history.push("/calendar/new/event")}
                className="todayButton"
              >
                <i className="far fa-calendar-plus" /> Event
              </Button>
            )}
            <Button onClick={this.Today} className="todayButton">
              <i className="fas fa-calendar-day" /> Today
            </Button>
          </Col>
          <Col md={8} xs={12}>
            <InputGroup>
              <InputGroup.Addon>
                <i className="fas fa-tags" />
              </InputGroup.Addon>
              <Select
                //https://react-select.com/props
                value={typeFilter}
                isMulti
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                //isClearable={this.state.typeFilter.some(v => !v.isFixed)}
                isSearchable={true}
                placeholder="Filter by event type..."
                classNamePrefix="select"
                onChange={this.onSelectChange}
                options={eventOptions}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={10} xs={12} style={{ margin: 0, padding: 0 }}>
            <Calendar
              //calendarType="ISO 8601"
              onChange={this.onChange}
              value={activeDate}
              ativeStartDate={new Date()} // fallback if value not set
              tileContent={tileContent}
              //tileClassName={this.tileHandler}
              minDetail={"month"}
              onActiveDateChange={this.onActiveDateChange}
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
            <EventList
              data={Events.results}
              activeDate={activeDate}
              history={history}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar);
