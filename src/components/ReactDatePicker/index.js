import React, { memo } from "react"
import PropTypes from "prop-types"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
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

const ReactDatePicker = props => <DatePicker {...props} />

ReactDatePicker.propTypes = {
  adjustDateOnChange: PropTypes.bool,
  allowSameDay: PropTypes.bool,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarClassName: PropTypes.string,
  calendarContainer: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  children: PropTypes.object,
  className: PropTypes.string,
  clearButtonTitle: PropTypes.string,
  customInput: PropTypes.object,
  customInputRef: PropTypes.string,
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dateFormatCalendar: PropTypes.string,
  dayClassName: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  disabled: PropTypes.bool,
  disabledKeyboardNavigation: PropTypes.bool,
  dropdownMode: PropTypes.oneOf(["scroll", "select"]),
  endDate: PropTypes.instanceOf(Date),
  excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  excludeTimes: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  filterDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.bool]),
  fixedHeight: PropTypes.bool,
  forceShowMonthNavigation: PropTypes.bool,
  formatWeekDay: PropTypes.string,
  formatWeekNumber: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.number
  ]),
  highlightDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  id: PropTypes.string,
  includeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  includeTimes: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  injectTimes: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  inline: PropTypes.bool,
  isClearable: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date)]),
  maxTime: PropTypes.instanceOf(Date),
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date)]),
  minTime: PropTypes.instanceOf(Date),
  monthsShown: PropTypes.number,
  name: PropTypes.string,
  nextMonthButtonLabel: PropTypes.string,
  nextYearButtonLabel: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onChangeRaw: PropTypes.func,
  onClickOutside: PropTypes.func,
  onFocus: PropTypes.func,
  onInputClick: PropTypes.func,
  onInputError: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMonthChange: PropTypes.func,
  onSelect: PropTypes.func,
  onWeekSelect: PropTypes.func,
  onYearChange: PropTypes.func,
  open: PropTypes.bool,
  openToDate: PropTypes.instanceOf(Date),
  peekNextMonth: PropTypes.bool,
  placeholderText: PropTypes.string,
  popperClassName: PropTypes.string,
  popperContainer: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  // popperModifiers?: Popper.Modifiers;
  popperPlacement: PropTypes.string,
  popperProps: PropTypes.object,
  preventOpenOnFocus: PropTypes.bool,
  previousMonthButtonLabel: PropTypes.string,
  previousYearButtonLabel: PropTypes.string,
  readOnly: PropTypes.bool,
  renderCustomHeader: PropTypes.oneOfType([
    PropTypes.shape({
      date: PropTypes.instanceOf(Date),
      changeYear: PropTypes.func,
      changeMonth: PropTypes.func,
      decreaseMonth: PropTypes.func,
      increaseMonth: PropTypes.func,
      prevMonthButtonDisabled: PropTypes.bool,
      nextMonthButtonDisabled: PropTypes.bool
    }),
    PropTypes.object
  ]),
  renderDayContents: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.object
  ]),
  required: PropTypes.bool,
  scrollableMonthYearDropdown: PropTypes.bool,
  scrollableYearDropdown: PropTypes.bool,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  shouldCloseOnSelect: PropTypes.bool,
  showDisabledMonthNavigation: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  showMonthYearDropdown: PropTypes.bool,
  showMonthYearPicker: PropTypes.bool,
  showPopperArrow: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  showTimeSelectOnly: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  showYearDropdown: PropTypes.bool,
  startDate: PropTypes.oneOfType([PropTypes.instanceOf(Date)]),
  startOpen: PropTypes.bool,
  strictParsing: PropTypes.bool,
  tabIndex: PropTypes.number,
  timeCaption: PropTypes.string,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  title: PropTypes.string,
  todayButton: PropTypes.object,
  useShortMonthInDropdown: PropTypes.bool,
  useWeekdaysShort: PropTypes.bool,
  value: PropTypes.string,
  weekLabel: PropTypes.string,
  withPortal: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  yearDropdownItemNumber: PropTypes.number,
  timeInputLabel: PropTypes.string,
  showTimeInput: PropTypes.bool,
  inlineFocusSelectedMonth: PropTypes.bool,
  onDayMouseEnter: PropTypes.func,
  onMonthMouseLeave: PropTypes.func
}

ReactDatePicker.defaultProps = {
  calendarClassName: "DatePicker",
  todayButton: (
    <i className="fas fa-calendar-day NavBaDatePickerTodayButton"> Today</i>
  ),
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
  showTimeSelect: true,
  timeFormat: "hh:mm a",
  timeIntervals: 1,
  timeCaption: "time"
}

export default memo(ReactDatePicker)
