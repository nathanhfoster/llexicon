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
    topToolbarHidden: PropTypes.bool,
    bottomToolbarHidden: PropTypes.bool,
    UpdateReduxEntry: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired,
    entry: PropTypes.object.isRequired
  }

  static defaultProps = {
    topToolbarHidden: false,
    bottomToolbarHidden: false,
    shouldRedirectOnDelete: false,
    theme: "snow"
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {
      entry,
      containerHeight,
      topToolbarHidden,
      bottomToolbarHidden,
      shouldRedirectOnDelete
    } = nextProps

    const inputHeight = 48
    const numberOfInputs = 1
    const inputOffset = inputHeight * numberOfInputs
    const toolBarToggleButton = 44

    const textEditorHeight = containerHeight - inputOffset

    entry.date_created_by_author = new Date(entry.date_created_by_author)

    return {
      entry,
      textEditorHeight,
      topToolbarHidden,
      bottomToolbarHidden,
      shouldRedirectOnDelete
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  render() {
    const { UpdateReduxEntry, SyncEntries, history, theme } = this.props
    const {
      entry,
      textEditorHeight,
      topToolbarHidden,
      bottomToolbarHidden,
      shouldRedirectOnDelete
    } = this.state

    return (
      <Fragment>
        <Editor
          toolbarId={entry.id}
          topToolbarHidden={topToolbarHidden}
          bottomToolbarHidden={bottomToolbarHidden}
          entry={entry}
          theme={theme}
          onChangeCallback={({ ...payload }) =>
            UpdateReduxEntry({ id: entry.id, ...payload })
          }
        >
          <UseDebounce onChangeCallback={() => SyncEntries()} />
          <InputGroup key={`EntryTitle-${entry.id}`} className="EntryInput">
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Dear Diary..."
              value={entry.title}
              onChange={e => {
                const title = e.target.value
                UpdateReduxEntry({ id: entry.id, title })
              }}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText className="p-0">
                <ReactDatePicker
                  selected={entry.date_created_by_author || entry.lastUpdated}
                  onChange={date_created_by_author =>
                    UpdateReduxEntry({
                      id: entry.id,
                      date_created_by_author,
                      lastUpdated: date_created_by_author
                    })
                  }
                />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <InputGroupText
                className="p-0"
                style={{ background: "var(--quinaryColor)" }}
              >
                <ConfirmAction
                  buttonClassName="EntryInputDelete"
                  onClickCallback={() => {
                    shouldRedirectOnDelete && RouterGoBack(history)
                    setTimeout(async () => {
                      await UpdateReduxEntry({
                        id: entry.id,
                        shouldDelete: true
                      })
                      SyncEntries()
                    }, 200)
                  }}
                  icon={
                    <i
                      className="fas fa-trash"
                      style={{ color: "var(--danger)", fontSize: "1.5em" }}
                    />
                  }
                  title={"Delete Entry"}
                />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Editor>
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
)
