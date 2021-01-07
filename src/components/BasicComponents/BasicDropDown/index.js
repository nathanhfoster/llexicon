import React, { useState, useMemo, memo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './styles.css'

const FUNCTION_MODIFIER = data => ({
  ...data,
  styles: {
    ...data.styles,
    overflow: 'auto',
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

const BasicDropDown = ({ options, onChange, direction, value: propValue, className }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [value, setValue] = useState(propValue)

  useEffect(() => {
    setValue(propValue)
  }, [propValue])

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const renderOptions = useMemo(
    () =>
      options.map((l, i) => {
        const { id, value, header, disabled, divider } = l
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
            divider={divider}
            header={header}
            disabled={disabled}
            onClick={handleClick}
          >
            {value || id}
          </DropdownItem>
        )
      }),
    [options],
  )

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      direction={direction}
      className={`BasicDropDown ${className}`}
    >
      <DropdownToggle caret color='primary' className={`BasicDropDownToggle`}>
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
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
    }).isRequired,
  ),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  // ---Dropdown---
  a11y: PropTypes.bool, // defaults to true. Set to false to enable more bootstrap like tabbing behavior
  disabled: PropTypes.bool,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
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
  'data-toggle': PropTypes.string,
  'aria-haspopup': PropTypes.bool,
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
  direction: 'down',
  value: 'value',
}

export default memo(BasicDropDown)
