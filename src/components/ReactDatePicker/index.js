import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import DatePicker from "react-datepicker"
import "./styles.css"

const popperPlacementPositions = {
  AUTO: "auto",
  AUTO_LEFT: "auto-left",
  AUTO_RIGHT: "auto-right",
  BOTTOM: "bottom",
  BOTTOM_END: "bottom-end",
  BOTTOM_START: "bottom-start",
  LEFT: "left",
  LEFT_END: "left-end",
  LEFT_START: "left-start",
  RIGHT: "right",
  RIGHT_END: "right-end",
  RIGHT_START: "right-start",
  TOP: "top",
  TOP_END: "top-end",
  TOP_START: "top-start"
}

class ReactDatePicker extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {
    calendarClassName: "DatePicker",
    todayButton: "Today",
    popperClassName: "DatePickerPopper",
    popperPlacement: popperPlacementPositions.AUTO_LEFT,
    // popperModifiers:{{
    //   offset: {
    //     enabled: true,
    //     offset: "5px, 10px"
    //   },
    //   preventOverflow: {
    //     enabled: true,
    //     escapeWithReference: false,
    //     boundariesElement: "viewport"
    //   }
    // }},
    showPopperArrow: false,
    selected: new Date(),
    onChange: date => console.log(date),
    showTimeSelect: false,
    timeFormat: "hh:mm a",
    timeIntervals: 15,
    timeCaption: "time"
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      calendarClassName,
      todayButton,
      popperClassName,
      popperPlacement,
      showPopperArrow,
      selected,
      onChange,
      showTimeSelect,
      timeFormat,
      timeIntervals,
      timeCaption
    } = props
    this.setState({
      calendarClassName,
      todayButton,
      popperClassName,
      popperPlacement,
      showPopperArrow,
      selected,
      onChange,
      showTimeSelect,
      timeFormat,
      timeIntervals,
      timeCaption
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const {
      calendarClassName,
      todayButton,
      popperClassName,
      popperPlacement,
      showPopperArrow,
      selected,
      onChange,
      showTimeSelect,
      timeFormat,
      timeIntervals,
      timeCaption
    } = this.state
    return (
      <DatePicker
        calendarClassName={calendarClassName}
        todayButton={todayButton}
        popperClassName={popperClassName}
        popperPlacement={popperPlacement}
        showPopperArrow={showPopperArrow}
        selected={selected}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        timeCaption={timeCaption}
      />
    )
  }
}
export default ReactDatePicker
