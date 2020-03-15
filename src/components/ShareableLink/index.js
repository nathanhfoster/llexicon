import React, { useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
  Button
} from "reactstrap"
import { copyStringToClipboard } from "../../helpers"
import "./styles.css"

const ShareableLink = ({ getUrlCallback, onClickCallback, is_public }) => {
  const [dropdownOpen, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [urlCopied, setUrlCopied] = useState(false)

  useEffect(() => {
    setUrl(getUrlCallback())
  }, [])

  const toggle = () => setOpen(!dropdownOpen)

  return (
    <ButtonDropdown
      className="ShareableLink"
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle>
        <i className={`fas fa-${urlCopied ? "check" : "share"}`} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>{url}</DropdownItem>
        <DropdownItem tag={ButtonGroup}>
          <Button
            color="accent"
            onClick={() => {
              copyStringToClipboard(url)
              setUrlCopied(true)
              onClickCallback && onClickCallback(true)
            }}
          >
            <i className="fas fa-clipboard" />
          </Button>
          <Button
            color="accent"
            onClick={() => {
              setUrlCopied(false)
              onClickCallback && onClickCallback(!is_public)
            }}
          >
            <i className={`fas fa-lock${is_public ? "-open" : ""}`} />
          </Button>
        </DropdownItem>
        {/* <DropdownItem divider />
        <DropdownItem>Another Action</DropdownItem> */}
      </DropdownMenu>
    </ButtonDropdown>
  )
}

ShareableLink.propTypes = {
  getUrlCallback: PropTypes.func,
  onClickCallback: PropTypes.func,
  is_public: PropTypes.bool
}

ShareableLink.defaultProps = { getUrlCallback: () => "URL" }

export default memo(ShareableLink)
