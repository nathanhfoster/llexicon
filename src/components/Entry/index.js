import React, { useCallback, Fragment, memo } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { useDispatch } from "react-redux"
import { Editor, EntryOptionsMenu } from "../../components"
import ReactDatePicker from "../ReactDatePicker"
import UseDebounce from "../UseDebounce"
import { UpdateReduxEntry, SyncEntries } from "../../redux/Entries/actions"
import memoizeProps from "../../helpers/memoizeProps"
import "./styles.css"

const Entry = ({
  entry,
  canToggleToolbars,
  topToolbarIsOpen,
  bottomToolbarIsOpen,
  shouldRedirectOnDelete,
  theme,
  readOnly,
}) => {
  const activeDate = new Date(
    entry.date_created_by_author || entry._lastUpdated || 0
  )
  const dispatch = useDispatch()

  entry.date_created_by_author = new Date(entry.date_created_by_author)

  const handleDebounce = () => dispatch(SyncEntries())

  const handleTitleChange = ({ target: { value } }) =>
    dispatch(handleEditorChange({ id: entry.id, title: value }))

  const handleDateChange = useCallback(
    (date_created_by_author) =>
      dispatch(
        handleEditorChange({
          id: entry.id,
          date_created_by_author,
          _lastUpdated: date_created_by_author,
        })
      ),
    []
  )

  const handleEditorChange = useCallback(
    ({ ...payload }) => dispatch(UpdateReduxEntry(entry.id, payload)),
    [entry.id]
  )

  return (
    <Editor
      readOnly={readOnly}
      toolbarId={entry.id}
      canToggleToolbars={canToggleToolbars}
      topToolbarIsOpen={topToolbarIsOpen}
      bottomToolbarIsOpen={bottomToolbarIsOpen}
      entry={entry}
      theme={theme}
      onChangeCallback={handleEditorChange}
    >
      <UseDebounce
        onChangeCallback={handleDebounce}
        value={entry}
        delay={3200}
      />
      <InputGroup
        key={`EntryTitle-${entry.id}`}
        className="EntryInput EntryInputTitle"
      >
        <Input
          type="text"
          name="title"
          id="title"
          placeholder="Entry title..."
          value={entry.title}
          onChange={handleTitleChange}
          disabled={readOnly}
        />
        <InputGroupAddon addonType="append">
          <InputGroupText className="p-0">
            <ReactDatePicker
              readOnly={readOnly}
              selected={activeDate}
              onChange={handleDateChange}
            />
          </InputGroupText>
        </InputGroupAddon>
        <Fragment>
          <InputGroupAddon addonType="append">
            <InputGroupText
              className="p-0"
              tag={EntryOptionsMenu}
              onChangeCallback={handleEditorChange}
              entryId={entry.id}
              is_public={entry.is_public}
              shouldRedirectOnDelete={shouldRedirectOnDelete}
              readOnly={readOnly}
            />
          </InputGroupAddon>
        </Fragment>
      </InputGroup>
    </Editor>
  )
}

Entry.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  entry: EntryPropTypes.isRequired,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottomToolbarIsOpen: PropTypes.bool,
  theme: PropTypes.string,
  staticContext: PropTypes.any,
  topToolbarIsOpen: PropTypes.bool,
  theme: PropTypes.string,
}

Entry.defaultProps = {
  readOnly: false,
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  bottomToolbarIsOpen: true,
  shouldRedirectOnDelete: false,
  theme: "snow",
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, ["entry", "itemSize", "width"])

export default memo(Entry, isEqual)
