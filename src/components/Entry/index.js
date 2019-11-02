import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import TextEditor from "../../components/TextEditor"
import Divider from "../../components/Divider"
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
      lastUpdated,
      containerHeight
    } = props

    const dividerHeight = 16
    const inputHeight = 48
    const numberOfInputs = 1
    const inputOffset = inputHeight * numberOfInputs

    const textEditorHeight = containerHeight - inputOffset - dividerHeight

    this.setState({
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { UpdateReduxEntry } = this.props
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight
    } = this.state

    return (
      <Fragment>
        <InputGroup key={id} className="EntryInput">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Entry title..."
            value={title}
            onChange={e => UpdateReduxEntry({ id, title: e.target.value })}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText color="primary">
              <Moment fromNow format="MM/DD/YY mm:ss">
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
          height={textEditorHeight}
          html={html}
          onChangeCallback={html => UpdateReduxEntry({ id, html })}
        />
        <Divider />
      </Fragment>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
