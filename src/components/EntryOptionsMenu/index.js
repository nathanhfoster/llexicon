import React, { Fragment, useState, memo } from "react"
import PropTypes from "prop-types"
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap"
import { BasicModal } from "../"
import { copyStringToClipboard } from "../../helpers"
import { RouteMap, RouterGoBack } from "../../routes"
import { useDispatch } from "react-redux"
import { SyncEntries } from "../../redux/Entries/actions"
import "./styles.css"

const getInitialState = ({}) => {
  return { dropdownOpen: false, urlCOpied: false, showModal: false }
}

const EntryOptionsMenu = ({
  entryId,
  is_public,
  onChangeCallback,
  history,
  shouldRedirectOnDelete
}) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setOpen] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const toggleDropdown = () => setOpen(!dropdownOpen)
  const toggleModal = () => setShowModal(!showModal)

  const { origin } = window.location
  const { ENTRY_DETAIL } = RouteMap
  const url = `${origin}${ENTRY_DETAIL.replace(":entryId", entryId)}`

  const handleDelete = () => {
    shouldRedirectOnDelete && RouterGoBack(history)
    setTimeout(async () => {
      await dispatch(
        onChangeCallback({
          id: entryId,
          _shouldDelete: true
        })
      )
      dispatch(SyncEntries())
    }, 200)
  }

  return (
    <ButtonDropdown
      className="EntryOptionsMenu"
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle>
        <i className="fas fa-ellipsis-v" style={{ fontSize: 20 }} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>
          <i className="fas fa-share mr-1" />
          {url}
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            copyStringToClipboard(url)
            setUrlCopied(true)
            if (!is_public) onChangeCallback({ is_public: true })
          }}
        >
          <i className={`fas fa-${urlCopied ? "check" : "clipboard"} mr-1`} />
          Copy
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setUrlCopied(false)
            onChangeCallback({ is_public: !is_public })
          }}
        >
          <i className={`fas fa-lock${is_public ? "-open" : ""} mr-1`} />
          {`Make ${is_public ? "Private" : "Public"}`}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={toggleModal}>
          <i className="fas fa-trash-alt mr-1" />
          Delete Entry
          <BasicModal
            button={false}
            show={showModal}
            title={"Delete Entry"}
            footer={
              <Fragment>
                <Button color="danger" onClick={handleDelete}>
                  Confirm
                </Button>
                <Button color="primary" onClick={toggleModal}>
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
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  is_public: PropTypes.bool
}

EntryOptionsMenu.defaultProps = { getUrlCallback: () => "URL" }

export default memo(EntryOptionsMenu)
