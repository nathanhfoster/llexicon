import React, { Fragment, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouterGoBack } from "../../ReactRouter/Routes"
import Editor from "../../components/Editor"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import ReactDatePicker from "../ReactDatePicker"
import ConfirmAction from "../ConfirmAction"
import UseDebounce from "../UseDebounce"
import "./styles.css"

const Entry = ({
  entry,
  containerHeight,
  topToolbarHidden,
  bottomToolbarHidden,
  shouldRedirectOnDelete,
  theme
}) => {
  console.log("RENDER")
  const history = useHistory()
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
        lastUpdated: date_created_by_author
      })
    )

  const handleDebounce = useCallback(() => dispatch(SyncEntries()), [entry])

  const handleEditorChange = useCallback(
    ({ ...payload }) =>
      dispatch(UpdateReduxEntry({ id: entry.id, ...payload })),
    [entry]
  )

  const handleTitleChange = useCallback(
    ({ target: { value } }) =>
      dispatch(UpdateReduxEntry({ id: entry.id, title: value })),
    [entry]
  )

  const handleDelete = () => {
    shouldRedirectOnDelete && RouterGoBack(history)
    setTimeout(async () => {
      await dispatch(
        UpdateReduxEntry({
          id: entry.id,
          shouldDelete: true
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
        <UseDebounce onChangeCallback={handleDebounce} value={entry} />
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
                selected={entry.date_created_by_author || entry.lastUpdated}
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
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  topToolbarHidden: PropTypes.bool,
  bottomToolbarHidden: PropTypes.bool,
  UpdateReduxEntry: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  entry: PropTypes.object.isRequired
}

Entry.defaultProps = {
  topToolbarHidden: false,
  bottomToolbarHidden: false,
  shouldRedirectOnDelete: false,
  theme: "snow"
}

export default memo(Entry)
