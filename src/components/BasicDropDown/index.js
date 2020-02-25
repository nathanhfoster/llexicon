import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"
import "./styles.css"

const BasicDropDown = ({
  list,
  onClickCallback,
  direction,
  value,
  containerClassName
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const renderList = list =>
    list.map(l => {
      const { id, value, header, disabled, divider } = l
      return (
        <DropdownItem
          key={id}
          divider={divider}
          header={header}
          disabled={disabled}
          onClick={() => onClickCallback(id, value)}
        >
          {value}
        </DropdownItem>
      )
    })

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      direction={direction}
      className={containerClassName}
    >
      <DropdownToggle caret color="primary" className="BasicDropDownToggle">
        {value}
      </DropdownToggle>
      <DropdownMenu
        modifiers={{
          setMaxHeight: {
            enabled: true,
            // order: 890,
            fn: data => ({
              ...data,
              styles: {
                ...data.styles,
                overflow: "auto",
                maxHeight: 200
                // backgroundColor: "var(--primaryColor)"
              }
            })
          }
        }}
      >
        {renderList(list)}
      </DropdownMenu>
    </Dropdown>
  )
}

BasicDropDown.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
      ]).isRequired,
      otherValue: PropTypes.any,
      header: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool
    }).isRequired
  ),
  onClickCallback: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
  toggle: PropTypes.bool // default: true
}

BasicDropDown.defaultProps = {
  list: [],
  direction: "down",
  value: "value",
  containerClassName: "BasicDropDown"
}

export default memo(BasicDropDown)
