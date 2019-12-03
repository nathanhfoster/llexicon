import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterGoBack } from "../../ReactRouter/Routes"
import Editor from "../../components/Editor"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import ReactDatePicker from "../ReactDatePicker"
import ConfirmAction from "../ConfirmAction"
import deepEquals from "../../helpers/deepEquals"
import UseDebounce from "../UseDebounce"
import BottomToolbar from "../BottomToolbar"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UpdateReduxEntry, SyncEntries }

class Entry extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showDivider: PropTypes.bool,
    toolbarHidden: PropTypes.bool,
    UpdateReduxEntry: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired
  }

  static defaultProps = {
    showDivider: false,
    toolbarHidden: true,
    shouldRedirectOnDelete: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      id,
      author,
      title,
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      containerHeight,
      showDivider,
      toolbarHidden,
      shouldRedirectOnDelete
    } = nextProps

    const inputHeight = 48
    const numberOfInputs = 1
    const inputOffset = inputHeight * numberOfInputs
    const toolBarToggleButton = 44
    const dividerHeight = showDivider ? 32 : 0

    const textEditorHeight = containerHeight - inputOffset - dividerHeight

    return {
      id,
      author,
      title,
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      date_created,
      date_created_by_author: new Date(date_created_by_author),
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider,
      toolbarHidden,
      shouldRedirectOnDelete
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { title, date_created_by_author, html } = nextState

    const currentTitle = this.state.title
    const currentDateCreatedByAuthor = this.state.date_created_by_author
    const currentHtml = this.state.html

    const titleChanged = !deepEquals(currentTitle, title)
    const dateChanged = !deepEquals(
      currentDateCreatedByAuthor,
      date_created_by_author
    )
    const htmlChanged = !deepEquals(currentHtml, html)

    return titleChanged || dateChanged || htmlChanged
  }

  render() {
    const { UpdateReduxEntry, SyncEntries, history } = this.props
    const {
      id,
      author,
      title,
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider,
      toolbarHidden,
      shouldRedirectOnDelete
    } = this.state

    return (
      <Fragment>
        <Editor
          toolbarId={id}
          showDivider={showDivider}
          toolbarHidden={toolbarHidden}
          html={html}
          onChangeCallback={({ ...payload }) =>
            UpdateReduxEntry({ id, ...payload })
          }
        >
          <UseDebounce callback={() => SyncEntries()} />
          <InputGroup key={id} className="EntryInput">
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Dear Diary.."
              value={title}
              onChange={e => {
                const title = e.target.value
                UpdateReduxEntry({ id, title })
              }}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText className="p-0">
                <ReactDatePicker
                  selected={date_created_by_author || lastUpdated}
                  onChange={date => {
                    const date_created_by_author = date
                    UpdateReduxEntry({
                      id,
                      date_created_by_author,
                      lastUpdated: date
                    })
                  }}
                />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <InputGroupText
                className="p-0"
                style={{ background: "var(--quinaryColor)" }}
              >
                <ConfirmAction
                  onClickCallback={() => {
                    shouldRedirectOnDelete && RouterGoBack(history)
                    setTimeout(async () => {
                      await UpdateReduxEntry({ id, shouldDelete: true })
                      SyncEntries()
                    }, 200)
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
        </Editor>
        {/* <BottomToolbar
          onChangeCallback={({ ...payload }) =>
            UpdateReduxEntry({ id, ...payload })
          }
          EntryFiles={EntryFiles}
          latitude={latitude}
          longitude={longitude}
          tags={tags}
        /> */}
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
)
