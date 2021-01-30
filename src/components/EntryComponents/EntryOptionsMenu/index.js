import React, { Fragment, useReducer, useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from 'reactstrap'
import {
  BasicModal,
  ConfirmAction,
  ShareOnFaceBook,
  ShareOnLinkedIn,
  ShareOnTwitter,
  Portal,
} from '../..'
import { copyStringToClipboard, shareUrl } from 'utils'
import { RouterGoBack, GetEntryDetailUrl } from 'redux/router/actions'
import { useDispatch } from 'react-redux'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/utils'
import { isReadOnly } from 'redux/Entries/utils'
import './styles.css'

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

export const EntryOptionsMenu = ({
  entryId,
  title,
  is_public,
  author,
  userId,
  shouldRedirectOnDelete,
  direction,
}) => {
  const dispatch = useDispatch()
  const [dropdownOpen, toggleOpen] = useReducer(prevState => !prevState, false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  const [text, setText] = useState('Check out my journal entry: ')

  // Timeout to allow from onClick events within portal to dispatch first
  const toggleDropdown = () => {
    setTimeout(() => toggleOpen(), 200)
  }

  const readOnly = useMemo(() => isReadOnly(entryId, author, userId), [entryId, author, userId])

  const url = useMemo(() => {
    const { origin } = window.location
    const entryDetailUrl = GetEntryDetailUrl(entryId)
    const fullUrl = `${origin}${entryDetailUrl}`
    return fullUrl
  }, [entryId])

  const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)
  const canShareOnMobileDevice = !entryIsLocalOnly && navigator.share

  const stopPropagation = useCallback(e => e.stopPropagation(), [])

  const selectText = useCallback(e => {
    stopPropagation(e)
    e.target.select()
  }, [])

  const handleTextChange = useCallback(e => setText(e.target.value), [])

  const handleSync = useCallback(() => dispatch(SyncEntries()), [dispatch])

  const handleEditorChange = useCallback(
    fields => {
      const payload = { id: entryId, ...fields }
      dispatch(UpdateReduxEntries(payload))
      handleSync()
    },
    [dispatch, entryId, handleSync],
  )

  const handleDelete = useCallback(() => {
    shouldRedirectOnDelete && RouterGoBack()
    setTimeout(() => {
      handleEditorChange({
        _shouldDelete: true,
        _shouldPost: false,
        _lastUpdated: null,
      })

      handleSync()
    }, 200)
  }, [handleSync, shouldRedirectOnDelete])

  const handleCopyAndMakePublic = useCallback(
    e => {
      stopPropagation(e)
      copyStringToClipboard(`${text} ${url}`)
      setUrlCopied(true)
      !is_public && handleEditorChange({ is_public: true })
    },
    [is_public, text, url],
  )

  const handleToggleIsPublic = useCallback(() => {
    setUrlCopied(false)
    handleEditorChange({ is_public: !is_public })
  }, [is_public])

  const handleShareOnMobile = useCallback(
    e => {
      stopPropagation(e)
      !readOnly && handleEditorChange({ is_public: true })

      const sharePayload = {
        url,
        title,
        text,
      }

      shareUrl(sharePayload)
    },
    [readOnly, url, title, text],
  )

  const basicModalFooter = useMemo(
    () => (
      <Fragment>
        <Button color='danger' onClick={handleDelete}>
          Confirm
        </Button>
        <Button color='success' onClick={toggleModal}>
          Cancel
        </Button>
      </Fragment>
    ),
    [handleDelete],
  )

  return (
    <ButtonDropdown
      className='EntryOptionsMenu'
      direction={direction}
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle>
        <i className='fas fa-ellipsis-v' style={{ fontSize: 20 }} />
      </DropdownToggle>

      {(dropdownOpen || showModal) && (
        <Portal>
          <DropdownMenu right className='EntryOptionsDropDown'>
            <DropdownItem disabled={readOnly} onClick={stopPropagation} onFocus={stopPropagation}>
              <Input
                className='mb-1'
                value={text}
                placeholder={text}
                disabled={readOnly}
                onChange={handleTextChange}
                onClick={stopPropagation}
                onFocus={selectText}
                autoComplete='on'
                type='textarea'
              />
              <Button
                color='accent'
                className='EntryOptionsMenuShareButton'
                disabled={readOnly}
                onClick={canShareOnMobileDevice ? handleShareOnMobile : handleCopyAndMakePublic}
                onFocus={stopPropagation}
              >
                {canShareOnMobileDevice ? (
                  <i className='fas fa-share mr-1' />
                ) : (
                  <i className={`fas fa-${urlCopied ? 'check' : 'clipboard'} mr-1`} />
                )}
                <span>{url}</span>
              </Button>
            </DropdownItem>
            <DropdownItem divider />
            <div className='SocialMediaShareContainer'>
              <ShareOnFaceBook url={url} onClick={stopPropagation} />
              <ShareOnLinkedIn url={url} onClick={stopPropagation} />
              <ShareOnTwitter text={`${text} ${url}`} onClick={stopPropagation} />
            </div>
            <DropdownItem divider />
            <Fragment>
              <DropdownItem onClick={handleToggleIsPublic} disabled={readOnly}>
                <i className={`fas fa-lock${is_public ? '-open' : ''} mr-1`} />
                {`Make ${is_public ? 'Private' : 'Public'}`}
              </DropdownItem>
              <DropdownItem divider />

              <DropdownItem
                onClick={toggleModal}
                style={{ color: 'var(--danger)' }}
                disabled={readOnly}
              >
                <i className='fas fa-trash-alt mr-1' />
                Delete Entry
                <BasicModal
                  size='xs'
                  button={false}
                  show={showModal}
                  title={'Delete Entry'}
                  footer={basicModalFooter}
                  toggle={toggleModal}
                >
                  <span className='Center'>Are you sure you want to delete this entry?</span>
                </BasicModal>
              </DropdownItem>
            </Fragment>
          </DropdownMenu>
        </Portal>
      )}
    </ButtonDropdown>
  )
}

EntryOptionsMenu.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  is_public: PropTypes.bool.isRequired,
  shouldRedirectOnDelete: PropTypes.bool,
}

EntryOptionsMenu.defaultProps = {
  shouldRedirectOnDelete: false,
  direction: 'down',
}

export default connect(mapStateToProps)(EntryOptionsMenu)
