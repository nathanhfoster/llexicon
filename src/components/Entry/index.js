import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterGoBack } from "../../ReactRouter/Routes"
import Editor from "../../components/Editor"
import ReactDatePicker from "../ReactDatePicker"
import ConfirmAction from "../ConfirmAction"
import UseDebounce from "../UseDebounce"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

const Entry = ({
  entry,
  containerHeight,
  topToolbarHidden,
  bottomToolbarHidden,
  shouldRedirectOnDelete,
  theme,
  history
}) => {
  const dispatch = useDispatch()
  const inputHeight = 48
  const numberOfInputs = 1
  const inputOffset = inputHeight * numberOfInputs
  const toolBarToggleButton = 44

  const textEditorHeight = containerHeight - inputOffset

  entry.date_created_by_author = new Date(entry.date_created_by_author)

  const handleDateChange = date_created_by_author =>
    dispatch(
      UpdateReduxEntry({
        id: entry.id,
        date_created_by_author,
        _lastUpdated: date_created_by_author
      })
    )

  const handleDebounce = () => {
    dispatch(SyncEntries())
  }

  const handleEditorChange = ({ ...payload }) =>
    dispatch(UpdateReduxEntry({ id: entry.id, ...payload }))

  const handleTitleChange = ({ target: { value } }) =>
    dispatch(UpdateReduxEntry({ id: entry.id, title: value }))

  const handleDelete = () => {
    shouldRedirectOnDelete && RouterGoBack(history)
    setTimeout(async () => {
      await dispatch(
        UpdateReduxEntry({
          id: entry.id,
          _shouldDelete: true
        })
      )
      dispatch(SyncEntries())
    }, 200)
  }

  return (
    <Fragment>
      <Editor
        toolbarId={entry.id}
        topToolbarHidden={topToolbarHidden}
        bottomToolbarHidden={bottomToolbarHidden}
        entry={entry}
        theme={theme}
        onChangeCallback={handleEditorChange}
      >
        <UseDebounce
          onChangeCallback={handleDebounce}
          value={entry}
          delay={800}
        />
        <InputGroup key={`EntryTitle-${entry.id}`} className="EntryInput">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Entry title..."
            value={entry.title}
            onChange={handleTitleChange}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText className="p-0">
              <ReactDatePicker
                selected={entry.date_created_by_author || entry._lastUpdated}
                onChange={handleDateChange}
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
                onClickCallback={handleDelete}
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

Entry.propTypes = {
  entry: PropTypes.object.isRequired,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottomToolbarHidden: PropTypes.bool,
  theme: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.any,
  topToolbarHidden: PropTypes.bool,
  shouldRedirectOnDelete: PropTypes.bool,
  shouldRedirectOnDelete: PropTypes.bool,
  theme: PropTypes.string
}

Entry.defaultProps = {
  topToolbarHidden: false,
  bottomToolbarHidden: false,
  shouldRedirectOnDelete: false,
  theme: "snow"
}

const isEqual = (prevProps, nextProps) => {
  const memoProps = ["entry", "itemSize", "width"]
  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (!deepEquals(prevProps[prop], nextProps[prop])) {
      return false
    }
  }
  return true
}

export default withRouter(memo(Entry, isEqual))
