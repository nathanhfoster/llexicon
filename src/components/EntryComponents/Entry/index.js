import React, { useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { EntryPropTypes } from '../../../redux/Entries/propTypes'
import { InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap'
import { Editor, EntryOptionsMenu, ReactDatePicker, UseDebounce } from '../../'
import { UpdateReduxEntry, SyncEntries } from '../../../redux/Entries/actions'
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
}) => {
  const dispatch = useDispatch()
  const activeDate = new Date(entry.date_created_by_author || entry._lastUpdated || 0)

  entry.date_created_by_author = new Date(entry.date_created_by_author)

  const handleEditorChange = useCallback(
    ({ ...payload }) => {
      if (readOnly) return
      dispatch(UpdateReduxEntry(entry.id, payload))
    },
    [entry.id, readOnly],
  )

  const handleDebounce = useCallback(() => {
    dispatch(SyncEntries())
  }, [])

  const handleTitleChange = useCallback(
    ({ target: { value } }) => handleEditorChange({ id: entry.id, title: value }),
    [],
  )

  const handleDateChange = useCallback(
    date_created_by_author =>
      handleEditorChange({
        id: entry.id,
        date_created_by_author,
        _lastUpdated: date_created_by_author,
      }),
    [],
  )

  return (
    <Editor
      readOnly={readOnly}
      toolbarId={toolbarId || entry.id}
      canToggleToolbars={canToggleToolbars}
      topToolbarIsOpen={topToolbarIsOpen}
      bottomToolbarIsOpen={bottomToolbarIsOpen}
      entry={entry}
      theme={theme}
      onChange={handleEditorChange}
      height={height}
    >
      <UseDebounce onChange={handleDebounce} value={entry} delay={3200} />
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
            <ReactDatePicker
              readOnly={readOnly}
              selected={activeDate}
              onChange={handleDateChange}
            />
          </InputGroupText>
        </InputGroupAddon>

        {showOptionsMenu && (
          <InputGroupAddon addonType='append'>
            <InputGroupText
              className='p-0'
              tag={EntryOptionsMenu}
              onChange={handleEditorChange}
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
}

Entry.defaultProps = {
  height: '100%',
  showOptionsMenu: true,
  readOnly: false,
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  bottomToolbarIsOpen: true,
  shouldRedirectOnDelete: false,
  theme: 'snow',
}

export default memo(Entry)
