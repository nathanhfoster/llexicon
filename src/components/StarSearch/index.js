import React, { Component } from "react"
import PropTypes from "prop-types"
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import { SearchUserEntries } from "../../actions/Entries"
import UseDebounce from "../UseDebounce"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

const mapStateToProps = ({ Entries: { search }, Window: { isMobile } }) => ({
  isMobile,
  search
})

const mapDispatchToProps = { SearchUserEntries }

class StarSearch extends Component {
  constructor(props) {
    super(props)

    this.state = { search: "" }
  }

  static propTypes = { SearchUserEntries: PropTypes.func.isRequired }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    let { isMobile, search } = nextProps
    const currentSearch = prevState.search

    // if (currentSearch) search = currentSearch

    return { isMobile, search: currentSearch }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  handleSearch = e => {
    const { value } = e.target
    this.setState({ search: value })
  }

  render() {
    const { history, SearchUserEntries } = this.props

    const { isMobile, search } = this.state

    return (
      <InputGroup
        className="StarSearch"
        style={{ maxWidth: isMobile ? "calc(100% - 52px)" : 360 }}
      >
        <InputGroupAddon
          addonType="prepend"
          className="TelescopeIconContainer Center"
        >
          <InputGroupText onClick={e => RouterPush(history, RouteMap.HOME)}>
            <i className="fab fa-wpexplorer TelescopeIcon" />
          </InputGroupText>
        </InputGroupAddon>

        <Input
          value={search}
          placeholder="Search the stars..."
          className="p-0"
          onChange={this.handleSearch}
        />
        <UseDebounce
          onChangeCallback={SearchUserEntries}
          value={search}
        />
      </InputGroup>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
)
