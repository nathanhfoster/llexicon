import React, { useMemo, useCallback, lazy, memo } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "redux/Entries/propTypes"
import {
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap"
import { BasicInput, EntryOptionsMenu } from "../../"
import { DEFAULT_STATE_TEXT_EDITOR } from "redux/TextEditor/reducer"
import { getLocalDateTimeNoSeconds, nFormatter } from "utils"
import "./styles.css"

const Editor = lazy(() => import("../../Editor"))

export const Entry = ({
  height,
  showOptionsMenu,
  entry,
  canToggleToolbars,
  topToolbarIsOpen,
  shouldRedirectOnDelete,
  theme,
  readOnly,
  onChange,
  onSubmit,
}) => {
  const activeDate = useMemo(
    () => getLocalDateTimeNoSeconds(entry.date_created_by_author),
    [entry.date_created_by_author]
  )

  const editorStateHtmlIsBlank = entry.html === DEFAULT_STATE_TEXT_EDITOR.html

  const submitDisabled = readOnly || (editorStateHtmlIsBlank && !entry.title)

  const handleOnChange = useCallback(
    ({ target: { name, value } }) => {
      if (name === "date_created_by_author" && value) {
        onChange({
          id: entry.id,
          [name]: value,
        })
      } else {
        onChange({
          id: entry.id,
          [name]: value,
        })
      }
    },
    [entry.id]
  )

  return (
    <Editor
      readOnly={readOnly}
      toolbarId={entry.id}
      canToggleToolbars={canToggleToolbars}
      topToolbarIsOpen={topToolbarIsOpen}
      entry={entry}
      theme={theme}
      onChange={onChange}
      height={height}
    >
      <InputGroup className="EntryInput EntryInputTitle">
        <Input
          type="text"
          name="title"
          id="title"
          placeholder="Entry title..."
          autoComplete="on"
          value={entry.title}
          onChange={handleOnChange}
          disabled={readOnly}
        />
        {/* <InputGroupAddon addonType="append">
          <InputGroupText className="p-0">
            <Input
              type={true || readOnly ? "text" : "number"}
              name="views"
              id="views"
              placeholder="0"
              min="0"
              autoComplete="on"
              value={true || readOnly ? nFormatter(entry.views) : entry.views}
              onChange={handleOnChange}
              disabled={true || readOnly}
              style={{ maxWidth: true || readOnly ? 46 : 70 }}
            />
          </InputGroupText>
        </InputGroupAddon> */}
        <InputGroupAddon addonType="append">
          <InputGroupText className="p-0">
            <BasicInput
              type="datetime-local"
              step="0"
              name="date_created_by_author"
              autoComplete="on"
              readOnly={readOnly}
              disabled={readOnly}
              value={activeDate}
              onChange={handleOnChange}
            />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon
          addonType="append"
          className="no-print"
          onClick={!submitDisabled ? onSubmit : null}
        >
          <InputGroupText
            tag={Button}
            color="accent"
            disabled={submitDisabled}
            // type="submit"
          >
            <i className="fas fa-save" style={{ fontSize: 20 }} />
          </InputGroupText>
        </InputGroupAddon>
        {showOptionsMenu && (
          <InputGroupAddon addonType="append" className="no-print">
            <InputGroupText
              className="p-0"
              tag={EntryOptionsMenu}
              onChange={onChange}
              entryId={entry.id}
              is_public={entry.is_public}
              shouldRedirectOnDelete={shouldRedirectOnDelete}
              readOnly={readOnly}
            />
          </InputGroupAddon>
        )}
      </InputGroup>
    </Editor>
  )
}

Entry.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showOptionsMenu: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  entry: EntryPropTypes.isRequired,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  theme: PropTypes.string,
  staticContext: PropTypes.any,
  topToolbarIsOpen: PropTypes.bool,
  theme: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

Entry.defaultProps = {
  height: "100%",
  showOptionsMenu: false,
  readOnly: false,
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  shouldRedirectOnDelete: false,
  theme: "snow",
}

export default memo(Entry)
