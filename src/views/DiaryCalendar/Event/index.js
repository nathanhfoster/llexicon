import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  Button,
  ButtonToolbar
} from "react-bootstrap"
import { connect as reduxConnect } from "react-redux"
import { selectStyles } from "../../../helpers/styles"
import Select from "react-select"
import {
  roleOptions,
  IconOption,
  classOptions,
  eventTags,
  eventTagOptions,
  locationTags
} from "../../../helpers/options"
import { DeepCopy, joinStrings, splitString } from "../../../helpers"
import { Redirect } from "react-router-dom"
import Slider, { Range } from "rc-slider"
import Tooltip from "rc-tooltip"
import "rc-slider/assets/index.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { postEvent, getEvent, clearEventsApi } from "../../../actions/Events"
import { UserHasPermissions } from "../../../helpers/userPermissions"
import PendingAction from "../../../components/PendingAction"
import "./styles.css"

const mapStateToProps = ({ User, Events }) => ({
  User,
  Events
})

const mapDispatchToProps = { postEvent, getEvent, clearEventsApi }

class Event extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      start_date: new Date(),
      end_date: new Date(),
      locations: locationTags.filter(e => e.isFixed),
      tags: eventTags.filter(e => e.isFixed),
      sub_tags: [],
      min_level: 1,
      max_level: 60,
      role_class_preferences: [
        { value: "Healer", label: "Healer" },
        { value: "Melee Dps", label: "Melee Dps" },
        { value: "Ranged Dps", label: "Ranged Dps" },
        { value: "Tank", label: "Tank" }
      ],
      group_size: null
    }
  }

  static propTypes = {}

  static defaultProps = {
    min_level: 1,
    max_level: 60,
    groups: [],
    party: [
      {
        role_class_preferences: [
          // { value: "Tank", label: "Tank" },
          // { value: "Dire Lord", label: "Dire Lord" },
          // { value: "Paladin", label: "Paladin" },
          // { value: "Warrior", label: "Warrior" }
        ]
      },
      {
        role_class_preferences: [
          // { value: "Healer", label: "Healer" }
        ]
      },
      {
        role_class_preferences: [
          // { value: "Melee Dps", label: "Melee Dps" },
          // { value: "Off Tank", label: "Off Tank" },
          // { value: "Ranged Dps", label: "Ranged Dps" }
        ]
      },
      {
        role_class_preferences: [
          // { value: "Crowd Control", label: "Crowd Control" }
        ]
      },
      {
        role_class_preferences: [
          // { value: "Support", label: "Support" }
        ]
      },
      {
        role_class_preferences: [
          // { value: "Utility", label: "Utility" }
        ]
      }
    ]
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { getEvent, clearEventsApi, match } = this.props
    const pollId = match.params.id
    if (pollId) {
      getEvent(pollId)
    } else clearEventsApi()
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { User, Events, groups, match } = props
    const eventId = match.params.id
    let { Event, Groups, GroupMembers } = Events
    const {
      author,
      title,
      start_date,
      end_date,
      url,
      description,
      tags,
      sub_tags,
      min_level,
      max_level,
      locations,
      group_size
    } = Event

    GroupMembers = GroupMembers.map(
      g =>
        (g = {
          ...g,
          role_class_preferences: g.role_class_preferences.split("|").map(
            e =>
              (e = {
                ...g,
                value: g.role_class_preferences,
                label: g.role_class_preferences
              })
          )
        })
    )
    Groups = Groups.map(g => GroupMembers.filter(m => m.event_group_id == g.id))

    this.setState({
      User,
      Events,
      groups,
      group_size: groups.length,
      author,
      title,
      start_date: new Date(start_date || null),
      end_date: new Date(end_date || null),
      url,
      description,
      tags: tags ? splitString(tags) : eventTags.filter(e => e.isFixed),
      sub_tags: sub_tags ? splitString(sub_tags) : [],
      min_level,
      max_level,
      locations: locations
        ? splitString(locations)
        : locationTags.filter(e => e.isFixed),
      groups: Groups.length > 0 ? Groups : groups,
      group_size,
      eventId
    })
  }

  componentWillUnmount() {
    const { clearEventsApi } = this.props
    clearEventsApi()
  }

  onChange = e => {
    let { groups } = this.state
    const { party } = this.props
    let { name, value } = e.target
    if (name == "group_size") {
      groups.length = value || 0
      for (let i = 0; i < groups.length; i++) {
        if (!groups[i]) groups[i] = party
      }
      this.setState({ groups, group_size: groups.length })
    }
    this.setState({ [name]: value })
  }

  onSliderChange = props =>
    this.setState({ min_level: props[0], max_level: props[1] })

  onSliderHandle = props => {
    const { value, dragging, index, ...restProps } = props
    return (
      <Tooltip
        prefixCls="slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Slider.Handle value={value} {...restProps} />
      </Tooltip>
    )
  }

  onSelectLocationChange = (selectValue, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return
        }
        break
      case "clear":
        selectValue = locationTags.filter(v => v.isFixed)
        break
    }

    this.setState({ locations: selectValue })
  }

  onSelectTagChange = (tags, { action, removedValue }) => {
    const { party } = this.props
    let { groups } = this.state
    const raidSelected = tags.map(e => e.value).includes("Raid")
    const oneGroup = this.showGroups(tags)
    if (raidSelected) {
      groups.length = 4
      for (let i = 0; i < groups.length; i++) {
        if (!groups[i]) groups[i] = party
      }
    } else if (!raidSelected && oneGroup) {
      groups.length = 1
      groups[0] = party
    }
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return
        }
        break
      case "clear":
        tags = eventTags.filter(v => v.isFixed)
        break
    }

    this.setState({ tags, groups, group_size: groups.length })
  }

  onSelectSubTagChange = (sub_tags, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return
        }
        break
      case "clear":
        sub_tags = []
        break
    }

    this.setState({ sub_tags })
  }

  onSelectRollPreferenceChange = (
    selectValue,
    { action, removedValue },
    groups,
    groupIndex,
    partyIndex
  ) => {
    groups = DeepCopy(groups)
    groups[groupIndex][partyIndex].role_class_preferences = selectValue
    switch (action) {
      case "remove-value":
        if (roleOptions.some(e => e.value == removedValue.value)) {
          selectValue = roleOptions.filter(v => v.isFixed)
          groups[groupIndex][partyIndex].role_class_preferences = []
        }
        break
      case "pop-value":
        if (removedValue.isFixed) {
          return
        }
        break
      case "clear":
        selectValue = roleOptions.filter(v => v.isFixed)
        groups[groupIndex][partyIndex].role_class_preferences = []
        break
    }
    this.setState({ selectValue, groups })
  }

  postEvent = () => {
    const { postEvent, createMessageGroup } = this.props
    const {
      User,
      start_date,
      end_date,
      title,
      url,
      description,
      tags,
      sub_tags,
      min_level,
      max_level,
      locations,
      group_size,
      groups
    } = this.state
    const payload = !this.showGroups(tags)
      ? {
          start_date,
          end_date,
          title,
          url,
          description,
          author: User.id,
          last_modified_by: User.id,
          tags: joinStrings(tags),
          sub_tags: joinStrings(sub_tags)
        }
      : {
          start_date,
          end_date,
          title,
          url,
          description,
          author: User.id,
          last_modified_by: User.id,
          tags: joinStrings(tags),
          sub_tags: joinStrings(sub_tags),
          min_level,
          max_level,
          locations: locations.map(e => e.value).join("|"),
          group_size
        }
    postEvent(User.id, User.token, payload, groups)
  }

  setStartDate = startDate => {
    const { end_date } = this.state
    const newDate = new Date(startDate)
    if (new Date(end_date) - new Date(startDate) <= 0)
      return this.setState({ start_date: newDate, end_date: newDate })
    else return this.setState({ start_date: newDate })
  }

  setEndDate = endDate => {
    const { start_date } = this.state
    const newDate = new Date(endDate)
    if (new Date(start_date) - new Date(endDate) >= 0)
      return this.setState({ start_date: newDate, end_date: newDate })
    else return this.setState({ end_date: newDate })
  }

  renderGroupClass = (groups, group_size) =>
    groups.map((group, i) => {
      const isRaid = group_size > 1
      const GroupHeader = isRaid ? `Group ${i + 1}` : "Group"
      const GroupHelper = isRaid
        ? `Select group ${i + 1} member's ROLE / CLASS`
        : `Select group member's ROLE / CLASS`
      return (
        <Col md={12 / group_size} xs={12} className="memberCol">
          <h3>{GroupHeader}</h3>
          <span className="help">{GroupHelper}</span>
          {group.map((member, k) => {
            const { role_class_preferences } = member

            const Options =
              role_class_preferences.length == 0
                ? roleOptions
                : classOptions[role_class_preferences[0].value]
            return (
              <FormGroup key={k}>
                <Select
                  //https://react-select.com/props
                  value={role_class_preferences}
                  isMulti
                  styles={selectStyles()}
                  onBlur={e => e.preventDefault()}
                  closeMenuOnSelect={false}
                  blurInputOnSelect={false}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={true}
                  placeholder={`Role / Class preference (${k + 1})`}
                  classNamePrefix="select"
                  onChange={(selectValue, { action, removedValue }) =>
                    this.onSelectRollPreferenceChange(
                      selectValue,
                      { action, removedValue },
                      groups,
                      i,
                      k
                    )
                  }
                  options={Options}
                  components={{ Option: IconOption }}
                />
              </FormGroup>
            )
          })}
        </Col>
      )
    })

  showGroups = tags => {
    const conditions = ["Dungeon", "Explore", "Group", "Raid", "Quest"]
    tags = tags.map(e => e.value)
    return conditions.some(e => tags.includes(e))
  }

  validateTitle(value) {
    if (value) {
      const { length } = value
      if (length > 4) return "success"
      else if (length > 2) return "warning"
      else if (length > 0) return "error"
    }
    return "error"
  }

  canSubmit = () => {
    const { title } = this.state
    if (
      this.validateTitle(title) == "success" ||
      this.validateTitle(title) == "warning"
    )
      return true

    return false
  }

  render() {
    const { history } = this.props
    const {
      User,
      Events,
      title,
      url,
      description,
      tags,
      min_level,
      max_level,
      role_class_preferences,
      locations,
      start_date,
      end_date,
      group_size,
      groups,
      author,
      eventId
    } = this.state
    const {
      loading,
      loaded,
      posting,
      posted,
      updating,
      updated,
      error
    } = Events

    const raidSelected = tags.map(e => e.value).includes("Raid")
    const { sub_tags } = this.state
    return (eventId && !UserHasPermissions(User, "change_event", author)) ||
      !UserHasPermissions(User, "add_event") ? (
      history.length > 1 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="Event Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">EVENT</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <PendingAction
              style={{ marginLeft: 16 }}
              Disabled={!this.canSubmit()}
              Click={this.postEvent}
              ActionPending={posting}
              ActionComplete={posted}
              ActionError={error}
              ActionName={"POST"}
            />
          </Col>
        </Row>
        <Form className="Container fadeIn">
          <Row>
            <Col xs={12}>
              <span className="help">Dates are in your local timezone</span>
            </Col>
            <Col md={6} xs={12} className="expirationDate">
              <ControlLabel>Start date</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="far fa-calendar-check" />
                </InputGroup.Addon>
                <DatePicker
                  //calendarClassName="Calendar"
                  popperClassName="calendarPopper"
                  fixedHeight={true}
                  //startDate={expiration_date}
                  value={start_date}
                  selected={start_date}
                  onChange={date => this.setStartDate(date)}
                  showTimeSelect
                  //timeFormat="hh:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="time"
                  placeholderText="Start date"
                />
              </InputGroup>
            </Col>
            <Col md={6} xs={12} className="expirationDate">
              <ControlLabel>End date</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="far fa-calendar-times" />
                </InputGroup.Addon>
                <DatePicker
                  //calendarClassName="Calendar"
                  popperClassName="calendarPopper"
                  fixedHeight={true}
                  //startDate={expiration_date}
                  value={end_date}
                  selected={end_date}
                  onChange={date => this.setEndDate(date)}
                  showTimeSelect
                  //timeFormat="hh:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="time"
                  placeholderText="End date"
                />
              </InputGroup>
            </Col>
            <Col xs={12}>
              <ControlLabel>Url</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-link" />
                </InputGroup.Addon>
                <FormControl
                  value={url}
                  type="text"
                  name="url"
                  placeholder="Url"
                  onChange={this.onChange}
                />
              </InputGroup>
            </Col>
            <Col xs={12}>
              <FormGroup validationState={this.validateTitle(title)}>
                <ControlLabel>Title</ControlLabel>
                <FormControl
                  value={title}
                  type="text"
                  name="title"
                  placeholder="Title"
                  onChange={this.onChange}
                  blurInputOnSelect
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <ControlLabel>Tag(s)</ControlLabel>
              <span className="help">
                Order matters. First option determines label color. Select the
                options from greatest to least importance.
              </span>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-tags" />
                </InputGroup.Addon>
                <Select
                  value={tags}
                  isMulti
                  styles={selectStyles()}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  closeMenuOnSelect={true}
                  escapeClearsValue={true}
                  //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                  isSearchable={false}
                  placeholder="Tags..."
                  classNamePrefix="select"
                  onChange={this.onSelectTagChange}
                  options={eventTags}
                />
              </InputGroup>
            </Col>
            {tags.length > 1 && (
              <Col xs={12}>
                <ControlLabel>Subtag(s)</ControlLabel>
                <span className="help">Choose subcategories</span>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-tags" />
                  </InputGroup.Addon>
                  <Select
                    value={sub_tags}
                    isMulti
                    styles={selectStyles()}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    closeMenuOnSelect={false}
                    escapeClearsValue={true}
                    //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                    isSearchable={false}
                    placeholder="Sub tags..."
                    classNamePrefix="select"
                    onChange={this.onSelectSubTagChange}
                    options={eventTagOptions[tags[1].value]}
                  />
                </InputGroup>
              </Col>
            )}
            {this.showGroups(tags) && (
              <Col xs={12}>
                <ControlLabel>Location(s)</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fas fa-globe-americas" />
                  </InputGroup.Addon>
                  <Select
                    value={locations}
                    styles={selectStyles()}
                    onBlur={e => e.preventDefault()}
                    blurInputOnSelect={false}
                    closeMenuOnSelect={false}
                    isMulti
                    //isClearable={this.state.selectValue.some(v => !v.isFixed)}
                    isSearchable={true}
                    placeholder="Zone interest..."
                    classNamePrefix="select"
                    onChange={this.onSelectLocationChange}
                    options={locationTags}
                  />
                </InputGroup>
              </Col>
            )}
            {this.showGroups(tags) && (
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel>{`Level range (${min_level} - ${max_level})`}</ControlLabel>
                  <Range
                    allowCross={false}
                    min={this.props.min_level}
                    max={this.props.max_level}
                    defaultValue={[this.props.min_level, this.props.max_level]}
                    tipFormatter={value => `${value}%`}
                    onChange={props => this.onSliderChange(props)}
                    handle={props => this.onSliderHandle(props)}
                    trackStyle={[{ backgroundColor: "var(--grey)" }]}
                    handleStyle={[
                      {
                        backgroundColor: "var(--primaryColor)",
                        border: "2px solid var(--primaryColor)"
                      },
                      {
                        backgroundColor: "var(--primaryColor)",
                        border: "2px solid var(--primaryColor)"
                      }
                    ]}
                    railStyle={{ backgroundColor: "var(--slate_grey)" }}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Col>
            )}
            <Col xs={12}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  value={description}
                  type="textarea"
                  name="description"
                  placeholder="Description"
                  onChange={this.onChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            {raidSelected && (
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel>Group size</ControlLabel>
                  <span className="help">Number of groups</span>
                  <FormControl
                    value={group_size}
                    min={1}
                    max={4}
                    type="number"
                    name="group_size"
                    placeholder="Group size..."
                    onChange={this.onChange}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
          <Row>
            {this.showGroups(tags) && this.renderGroupClass(groups, group_size)}
          </Row>
        </Form>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Event)
