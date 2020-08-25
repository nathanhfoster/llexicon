import React, { Fragment, useState, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap"
import {
  BasicModal,
  ConfirmAction,
  ShareOnFaceBook,
  ShareOnLinkedIn,
  ShareOnTwitter,
  Portal,
} from "../.."
import { copyStringToClipboard, shareUrl } from "../../../utils"
import { RouterGoBack, GetEntryDetailUrl } from "store/reducers/router/actions"
import { useDispatch } from "store/provider"
import { UpdateReduxEntry, SyncEntries } from "store/reducers/Entries/actions"
import { BASE_JOURNAL_ENTRY_ID } from "store/reducers/Entries/reducer"
import "./styles.css"

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

const EntryOptionsMenu = ({
  entryId,
  title,
  is_public,
  author,
  userId,
  shouldSyncOnUpdate,
  shouldRedirectOnDelete,
  direction,
}) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setOpen] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  // Timeout to allow from onClick events within portal to dispatch first
  const toggleDropdown = () =>
    setTimeout(() => setOpen((prevropdownOpen) => !prevropdownOpen), 200)

  const toggleModal = () => setShowModal((prevShowModal) => !prevShowModal)

  const readOnly = useMemo(
    () => Boolean(author && userId && userId !== author),
    [userId, author]
  )

  const url = useMemo(() => {
    const { origin } = window.location
    const entryDetailUrl = GetEntryDetailUrl(entryId)
    const fullUrl = `${origin}${entryDetailUrl}`
    return fullUrl
  }, [entryId])
  const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)
  const canShareOnMobileDevice = !entryIsLocalOnly && navigator.share

  const handleSync = useCallback(() => dispatch(SyncEntries()), [])

  const handleEditorChange = useCallback(({ ...payload }) => {
    dispatch(UpdateReduxEntry(entryId, payload))
    shouldSyncOnUpdate && handleSync()
  }, [])

  const handleDelete = useCallback(() => {
    shouldRedirectOnDelete && RouterGoBack()
    setTimeout(() => {
      handleEditorChange({
        _shouldDelete: true,
      })

      handleSync()
    }, 200)
  }, [])

  const handleCopyAndMakePublic = useCallback(() => {
    copyStringToClipboard(url)
    setUrlCopied(true)
    !is_public && handleEditorChange({ is_public: true })
  }, [is_public])

  const handleToggleIsPublic = useCallback(() => {
    setUrlCopied(false)
    handleEditorChange({ is_public: !is_public })
  }, [is_public])

  const handleShareOnMobile = useCallback(() => {
    !readOnly && handleEditorChange({ is_public: true })

    const sharePayload = {
      url,
      title,
      text: "Check out my journal entry: ",
    }

    shareUrl(sharePayload)
  }, [is_public, url, title])

  const basicModalFooter = useMemo(
    () => (
      <Fragment>
        <Button color="danger" onClick={handleDelete}>
          Confirm
        </Button>
        <Button color="success" onClick={toggleModal}>
          Cancel
        </Button>
      </Fragment>
    ),
    []
  )

  return (
    <ButtonDropdown
      className="EntryOptionsMenu"
      direction={direction}
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle>
        <i className="fas fa-ellipsis-v" style={{ fontSize: 20 }} />
      </DropdownToggle>

      {(dropdownOpen || showModal) && (
        <Portal>
          <DropdownMenu right className="EntryOptionsDropDown">
            <DropdownItem header>
              <Button
                color={!canShareOnMobileDevice ? "secondary" : "accent"}
                className="EntryOptionsMenuShareButton"
                disabled={!canShareOnMobileDevice}
                onClick={handleShareOnMobile}
              >
                <i className="fas fa-share mr-1" />
                <span>{url}</span>
              </Button>
            </DropdownItem>
            <DropdownItem divider />
            <div className="SocialMediaShareContainer">
              <ShareOnFaceBook url={url} />
              <ShareOnLinkedIn url={url} />
              <ShareOnTwitter text={`Check my journal entry: ${url}`} />
            </div>
            <DropdownItem divider />
            <Fragment>
              <DropdownItem
                onClick={handleCopyAndMakePublic}
                disabled={readOnly}
              >
                <i
                  className={`fas fa-${urlCopied ? "check" : "clipboard"} mr-1`}
                />
                Copy and make public
              </DropdownItem>
              <DropdownItem onClick={handleToggleIsPublic} disabled={readOnly}>
                <i className={`fas fa-lock${is_public ? "-open" : ""} mr-1`} />
                {`Make ${is_public ? "Private" : "Public"}`}
              </DropdownItem>
              <DropdownItem divider />

              <DropdownItem
                onClick={toggleModal}
                style={{ color: "var(--danger)" }}
                disabled={readOnly}
              >
                <i className="fas fa-trash-alt mr-1" />
                Delete Entry
                <BasicModal
                  size="xs"
                  button={false}
                  show={showModal}
                  title={"Delete Entry"}
                  footer={basicModalFooter}
                  toggle={toggleModal}
                >
                  <span className="Center">
                    Are you sure you want to delete this entry?
                  </span>
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
  shouldSyncOnUpdate: PropTypes.bool,
  shouldRedirectOnDelete: PropTypes.bool,
}

EntryOptionsMenu.defaultProps = {
  shouldSyncOnUpdate: false,
  shouldRedirectOnDelete: false,
  direction: "down",
}

export default connect(mapStateToProps)(EntryOptionsMenu)
