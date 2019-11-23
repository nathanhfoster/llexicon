import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Input
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import { SearchUserEntries } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

const mapDispatchToProps = { SearchUserEntries }

class StarSearch extends Component {
  constructor(props) {
    super(props)

    // Identify props that can change from outsite and within the component and map them to state
    this.state = {}
  }

  static propTypes = { SearchUserEntries: PropTypes.func.isRequired }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    // Identify which properties have changed and compare them to the previous state
    // If there was a change return a new state object
    // Otherwise return null which means there was no state change
    return nextProps
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If you are NOT using a PureComponent compare the nextState (derived from getDerivedStateFromProps) with this.state
    // and determine what condition(s) your component should re render
    return true
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  handleSearch = e => {
    const { value } = e.target
    const { SearchUserEntries } = this.props
    SearchUserEntries(value)
  }

  render() {
    const { isMobile } = this.state
    return (
      <InputGroup
        className="StarSearch"
        style={{ maxWidth: isMobile ? "calc(100% - 42px)" : 450 }}
      >
        <InputGroupAddon
          addonType="prepend"
          className="TelescopeIconContainer Center"
        >
          <InputGroupText>
            <i className="fab fa-wpexplorer TelescopeIcon" />
          </InputGroupText>
        </InputGroupAddon>

        <Input
          placeholder="Search the stars..."
          className="p-0"
          onChange={this.handleSearch}
        />
      </InputGroup>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
)
