import React, { Fragment, useState, useCallback, memo } from "react"
import PropTypes from "prop-types"
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
} from "../"
import { copyStringToClipboard, shareUrl } from "../../helpers"
import { RouterGoBack, GetEntryDetailUrl } from "../../routes"
import { useDispatch } from "react-redux"
import { UpdateReduxEntry, SyncEntries } from "../../redux/Entries/actions"
import { BASE_JOURNAL_ENTRY_ID } from "../../redux/Entries/reducer"
import "./styles.css"

const EntryOptionsMenu = ({
  entryId,
  title,
  author,
  is_public,
  history,
  shouldRedirectOnDelete,
}) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setOpen] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const toggleDropdown = () => setOpen(!dropdownOpen)
  const toggleModal = () => setShowModal(!showModal)

  const { origin } = window.location
  const url = `${origin}${GetEntryDetailUrl(entryId)}`
  const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)
  const canShareOnMobileDevice = !entryIsLocalOnly && navigator.share

  const handleEditorChange = useCallback(
    ({ ...payload }) => dispatch(UpdateReduxEntry(entryId, payload)),
    []
  )

  const handleDelete = useCallback(() => {
    shouldRedirectOnDelete && RouterGoBack(history)
    setTimeout(async () => {
      await dispatch(
        handleEditorChange({
          _shouldDelete: true,
        })
      )
      dispatch(SyncEntries())
    }, 200)
  }, [history])

  const handleCopyAndMakePublic = useCallback(() => {
    copyStringToClipboard(url)
    setUrlCopied(true)
    if (!is_public) handleEditorChange({ is_public: true })
  }, [is_public])

  const handleToggleIsPublic = useCallback(() => {
    setUrlCopied(false)
    handleEditorChange({ is_public: !is_public })
  }, [is_public])

  const handleShareOnMobile = useCallback(
    () => {
      handleToggleIsPublic()

      const sharePayload = {
        url,
        title,
        text: "Check out my journal entry: ",
      }

      shareUrl(sharePayload)
    },
    [url, title],
    is_public
  )

  return (
    <ButtonDropdown
      className="EntryOptionsMenu"
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle>
        <i className="fas fa-ellipsis-v" style={{ fontSize: 20 }} />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem header>
          <Button
            color={!canShareOnMobileDevice ? "inherit" : "accent"}
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

        <DropdownItem onClick={handleCopyAndMakePublic} disabled={!author}>
          <i className={`fas fa-${urlCopied ? "check" : "clipboard"} mr-1`} />
          Copy and make public
        </DropdownItem>
        <DropdownItem onClick={handleToggleIsPublic}>
          <i className={`fas fa-lock${is_public ? "-open" : ""} mr-1`} />
          {`Make ${is_public ? "Private" : "Public"}`}
        </DropdownItem>
        <DropdownItem divider />

        <DropdownItem onClick={toggleModal}>
          <i className="fas fa-trash-alt mr-1" />
          Delete Entry
          <BasicModal
            size="xs"
            button={false}
            show={showModal}
            title={"Delete Entry"}
            footer={
              <Fragment>
                <Button color="danger" onClick={handleDelete}>
                  Confirm
                </Button>
                <Button color="success" onClick={toggleModal}>
                  Cancel
                </Button>
              </Fragment>
            }
          >
            <span className="Center">
              Are you sure you want to delete this entry?
            </span>
          </BasicModal>
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

EntryOptionsMenu.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  author: PropTypes.number,
  is_public: PropTypes.bool.isRequired,
  history: PropTypes.object,
  shouldRedirectOnDelete: PropTypes.bool,
}

EntryOptionsMenu.defaultProps = {}

export default memo(EntryOptionsMenu)
