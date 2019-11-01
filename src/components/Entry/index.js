import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import TextEditor from "../../components/TextEditor"
import { UpdateReduxEntry } from "../../actions/Entries"
import Moment from "react-moment"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UpdateReduxEntry }

class Entry extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

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
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated
    } = props
    this.setState({
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { UpdateReduxEntry, containerStyle } = this.props
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated
    } = this.state
    return (
      <div key={id} className="Entry" style={containerStyle}>
        <InputGroup key={id} className="EntryInput">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Title..."
            value={title}
            onChange={e => UpdateReduxEntry({ id, title: e.target.value })}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText color="primary">
              <Moment fromNow format="MM/DD/YY MM:SS">
                {date_created || lastUpdated}
              </Moment>
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon
            addonType="append"
            onClick={() => UpdateReduxEntry({ id, shouldDelete: true })}
          >
            <InputGroupText color="primary">
              <i className="fas fa-times" style={{ fontSize: 20 }} />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <TextEditor
          // height={`calc(${containerStyle.height}px - var(--inputButtonHeight) - 18px)`}
          html={html}
          onChangeCallback={html => UpdateReduxEntry({ id, html })}
        />
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
