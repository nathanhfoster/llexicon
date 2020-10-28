import React, { useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { InputGroup, Input, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import { Editor, EntryOptionsMenu, ReactDatePicker } from '../../'
import { DEFAULT_STATE_TEXT_EDITOR } from 'redux/TextEditor/reducer'
import './styles.css'

const Entry = ({
  height,
  showOptionsMenu,
  entry,
  toolbarId,
  canToggleToolbars,
  topToolbarIsOpen,
  bottomToolbarIsOpen,
  shouldRedirectOnDelete,
  theme,
  readOnly,
  onChange,
  onSubmit,
}) => {
  const activeDate = new Date(entry.date_created_by_author || entry._lastUpdated || 0)

  const editorStateHtmlIsBlank = entry.html === DEFAULT_STATE_TEXT_EDITOR.html

  const submitDisabled = readOnly || (editorStateHtmlIsBlank && !entry.title)

  entry.date_created_by_author = new Date(entry.date_created_by_author)

  const handleTitleChange = useCallback(({ target: { value } }) => onChange({ title: value }), [])

  const handleDateChange = useCallback(date_created_by_author => {
    onChange({
      date_created_by_author,
      _lastUpdated: date_created_by_author,
    })
  }, [])

  return (
    <Editor
      readOnly={readOnly}
      toolbarId={toolbarId || entry.id}
      canToggleToolbars={canToggleToolbars}
      topToolbarIsOpen={topToolbarIsOpen}
      bottomToolbarIsOpen={bottomToolbarIsOpen}
      entry={entry}
      theme={theme}
      onChange={onChange}
      height={height}
    >
      <InputGroup key={`EntryTitle-${entry.id}`} className='EntryInput EntryInputTitle'>
        <Input
          type='text'
          name='title'
          id='title'
          placeholder='Entry title...'
          value={entry.title}
          onChange={!handleTitleChange}
          disabled={readOnly}
        />
        <InputGroupAddon addonType='append'>
          <InputGroupText className='p-0'>
            <ReactDatePicker
              readOnly={readOnly}
              selected={activeDate}
              onChange={handleDateChange}
            />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon addonType='append' onClick={!submitDisabled ? onSubmit : null}>
          <InputGroupText
            tag={Button}
            className='SaveButton'
            color='accent'
            disabled={submitDisabled}
            // type="submit"
          >
            <i className='fas fa-save' style={{ fontSize: 20 }} />
          </InputGroupText>
        </InputGroupAddon>
        {showOptionsMenu && (
          <InputGroupAddon addonType='append'>
            <InputGroupText
              className='p-0'
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
  toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool.isRequired,
  entry: EntryPropTypes.isRequired,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottomToolbarIsOpen: PropTypes.bool,
  theme: PropTypes.string,
  staticContext: PropTypes.any,
  topToolbarIsOpen: PropTypes.bool,
  theme: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

Entry.defaultProps = {
  height: '100%',
  showOptionsMenu: false,
  readOnly: false,
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  bottomToolbarIsOpen: true,
  shouldRedirectOnDelete: false,
  theme: 'snow',
}

export default memo(Entry)
