import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Form, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Media } from "reactstrap"
import UseDebounce from "../UseDebounce"

class BasicSearchBar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { searchValue: "" }
  }

  static propTypes = { placeholder: PropTypes.string.isRequired, onSubmit: PropTypes.func.isRequired }

  static defaultProps = {
    placeholder: "Search..."
  }

  handleOnChange = e => this.setState({ searchValue: e.target.value })

  handleSubmit = e => {
    e.preventDefault()
    const { onSubmit } = this.props
    const { searchValue } = this.state

    onSubmit(searchValue)
  }

  render() {
    const { placeholder, onSubmit } = this.props
    const { searchValue } = this.state
    return (
      <InputGroup tag={Form} onSubmit={this.handleSubmit} method="post">
        <Input value={searchValue} placeholder={placeholder} onChange={this.handleOnChange} />
        <InputGroupAddon addonType="prepend">
          <InputGroupText tag={Button} color="white" type="submit">
            <Media src="https://www.stickpng.com/assets/images/585e4adacb11b227491c3392.png" height={24} />
          </InputGroupText>
        </InputGroupAddon>
        <UseDebounce onChangeCallback={onSubmit} value={searchValue} />
      </InputGroup>
    )
  }
}
export default BasicSearchBar
