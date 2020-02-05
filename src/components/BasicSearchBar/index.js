import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import {
  Form,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Media
} from "reactstrap"
import UseDebounce from "../UseDebounce"

const BasicSearchBar = ({ placeholder, onSubmit }) => {
  const [searchValue, setSearchValue] = useState("")

  const handleOnChange = ({ target: { value } }) => setSearchValue(value)

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(searchValue)
  }

  return (
    <InputGroup tag={Form} onSubmit={handleSubmit} method="post">
      <Input
        value={searchValue}
        placeholder={placeholder}
        onChange={handleOnChange}
      />
      <InputGroupAddon addonType="prepend">
        <InputGroupText tag={Button} color="white" type="submit">
          <Media
            src="https://www.stickpng.com/assets/images/585e4adacb11b227491c3392.png"
            height={24}
          />
        </InputGroupText>
      </InputGroupAddon>
      <UseDebounce onChangeCallback={onSubmit} value={searchValue} />
    </InputGroup>
  )
}

BasicSearchBar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

BasicSearchBar.defaultProps = {
  placeholder: "Search..."
}
export default memo(BasicSearchBar)
