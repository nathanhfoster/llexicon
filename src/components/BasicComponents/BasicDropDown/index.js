import React, {
  useState,
  useMemo,
  memo,
  useEffect,
  useReducer,
  useRef,
} from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import "./styles.css"

const FUNCTION_MODIFIER = (data) => ({
  ...data,
  styles: {
    ...data.styles,
    overflow: "auto",
    maxHeight: 200,
    // backgroundColor: "var(--primaryColor)"
  },
})

const MODIFIERS = {
  setMaxHeight: {
    enabled: true,
    // order: 890,
    fn: FUNCTION_MODIFIER,
  },
}

export const BasicDropDown = ({
  options,
  onChange,
  direction,
  value: propValue,
  className,
  color,
  caret,
}) => {
  const mounted = useRef(false)
  const [dropdownOpen, toggle] = useReducer((prevState) => !prevState, false)
  const [value, setValue] = useState(propValue || options[0]?.value)
  useEffect(() => {
    if (mounted.current) {
      setValue(propValue)
    }
    mounted.current = true
  }, [propValue])

  const renderOptions = useMemo(
    () =>
      options.map((l, i) => {
        const { id, value, ...restOfProps } = l
        const handleClick = () => {
          if (onChange) {
            onChange(id, value)
          } else {
            setValue(value)
          }
        }
        return (
          <DropdownItem
            key={`${id}-${i}`}
            onClick={handleClick}
            {...restOfProps}
          >
            {value || id}
          </DropdownItem>
        )
      }),
    [onChange, options]
  )

  const disabled = useMemo(() => options.every(({ disabled }) => disabled), [
    options,
  ])

  return (
    <Dropdown
      className={className}
      isOpen={dropdownOpen}
      toggle={toggle}
      direction={direction}
    >
      <DropdownToggle
        className="BasicDropDownToggle"
        caret={caret}
        color={color}
        disabled={disabled}
      >
        {value}
      </DropdownToggle>
      <DropdownMenu modifiers={MODIFIERS}>{renderOptions}</DropdownMenu>
    </Dropdown>
  )
}

BasicDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
      ]),
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      title: PropTypes.string,
    }).isRequired
  ),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  // ---Dropdown---
  a11y: PropTypes.bool, // defaults to true. Set to false to enable more bootstrap like tabbing behavior
  disabled: PropTypes.bool,
  direction: PropTypes.oneOf(["up", "down", "left", "right"]),
  group: PropTypes.bool,
  isOpen: PropTypes.bool,
  // For Dropdown usage inside a Nav
  nav: PropTypes.bool,
  active: PropTypes.bool,
  // For Dropdown usage inside a Navbar (disables popper)
  inNavbar: PropTypes.bool,
  tag: PropTypes.string, // default: 'div' unless nav=true, then 'li'
  toggle: PropTypes.func,
  setActiveFromChild: PropTypes.bool,

  // ---DropdownToggle---
  caret: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  "data-toggle": PropTypes.string,
  "aria-haspopup": PropTypes.bool,
  // For DropdownToggle usage inside a Nav
  nav: PropTypes.bool,
  // Defaults to Button component
  tag: PropTypes.any,

  // ---DropdownMenu---
  tag: PropTypes.string,
  children: PropTypes.node.isRequired,
  right: PropTypes.bool,
  flip: PropTypes.bool, // default: true,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  // Custom modifiers that are passed to DropdownMenu.js, see https://popper.js.org/popper-documentation.html#modifiers
  modifiers: PropTypes.object,
  persist: PropTypes.bool, // presist the popper, even when closed. See #779 for reasoning
  // passed to popper, see https://popper.js.org/popper-documentation.html#Popper.Defaults.positionFixed
  positionFixed: PropTypes.bool,

  // ---DropdownItem---
  children: PropTypes.node,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  divider: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  header: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  toggle: PropTypes.bool, // default: true
}

BasicDropDown.defaultProps = {
  options: [],
  direction: "down",
  value: "",
  color: "primary",
  caret: true,
}

export default memo(BasicDropDown)
