import React, { useMemo, useCallback, lazy, memo } from 'react'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { InputGroup, Input, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import { BasicInput, EntryOptionsMenu } from '../../'
import { DEFAULT_STATE_TEXT_EDITOR } from 'redux/TextEditor/reducer'
import { getLocalDateTimeNoSeconds } from 'utils'
import './styles.css'

const Editor = lazy(() => import('../../Editor'))

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
  const activeDate = useMemo(() => getLocalDateTimeNoSeconds(entry.date_created_by_author), [
    entry.date_created_by_author,
  ])

  const editorStateHtmlIsBlank = entry.html === DEFAULT_STATE_TEXT_EDITOR.html

  const submitDisabled = readOnly || (editorStateHtmlIsBlank && !entry.title)

  const handleTitleChange = useCallback(({ target: { value } }) => onChange({ title: value }), [])

  const handleDateChange = useCallback(({ target: { value } }) => {
    // console.log('value: ', value)
    onChange({
      date_created_by_author: value,
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
          onChange={handleTitleChange}
          disabled={readOnly}
        />
        <InputGroupAddon addonType='append'>
          <InputGroupText className='p-0'>
            <BasicInput
              type='datetime-local'
              step='0'
              name='date_created_by_author'
              disabled={readOnly}
              value={activeDate}
              onChange={handleDateChange}
            />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon addonType='append' onClick={!submitDisabled ? onSubmit : null}>
          <InputGroupText
            tag={Button}
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
