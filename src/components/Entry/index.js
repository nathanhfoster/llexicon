import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterGoBack } from "../../ReactRouter/Routes"
import TextEditor from "../../components/TextEditor"
import Divider from "../../components/Divider"
import { UpdateReduxEntry } from "../../actions/Entries"
import ReactDatePicker from "../ReactDatePicker"
import ConfirmAction from "../ConfirmAction"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UpdateReduxEntry }

class Entry extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    showDivider: PropTypes.bool
  }

  static defaultProps = { showDivider: false, shouldRedirectOnDelete: false }

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
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      containerHeight,
      showDivider,
      shouldRedirectOnDelete
    } = props

    const dividerHeight = showDivider ? 22 : 0
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
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider,
      shouldRedirectOnDelete
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { UpdateReduxEntry, history } = this.props
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider,
      shouldRedirectOnDelete
    } = this.state
    return (
      <TextEditor
        showDivider
        height={textEditorHeight}
        html={html}
        onChangeCallback={html => UpdateReduxEntry({ id, html })}
      >
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
            <InputGroupText className="p-0">
              <ReactDatePicker
                selected={new Date(date_created_by_author || lastUpdated)}
                onChange={date =>
                  UpdateReduxEntry({
                    id,
                    date_created_by_author: date,
                    lastUpdated: date
                  })
                }
              />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <InputGroupText className="p-0" style={{background: 'var(--quinaryColor)'}}>
              <ConfirmAction
                onClickCallback={() => {
                  shouldRedirectOnDelete && RouterGoBack(history)
                  setTimeout(
                    () => UpdateReduxEntry({ id, shouldDelete: true }),
                    200
                  )
                }}
                icon={
                  <i
                    className="fas fa-trash"
                    style={{ color: "var(--danger)", fontSize: 22 }}
                  />
                }
                title={"Delete Entry"}
              />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </TextEditor>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
)
