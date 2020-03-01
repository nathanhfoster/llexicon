import React, { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { Link } from "react-router-dom"
import { RouteMap } from "../../routes"
import { SearchUserEntries } from "../../redux/Entries/actions"
import { DEFAULT_STATE_ENTRIES } from "../../redux/Entries/reducer"
import UseDebounce from "../UseDebounce"
import "./styles.css"

const mapStateToProps = ({ Entries: { search }, Window: { isMobile } }) => ({
  isMobile,
  search
})

const mapDispatchToProps = { SearchUserEntries }

const StarSearch = ({ search, SearchUserEntries, isMobile }) => {
  const isMounted = useRef(false)
  const previousPropSearch = useRef(search)
  const isTyping = useRef(false)
  const [searchValue, setSearch] = useState(search)

  const shouldDeriveStateFromProps =
    !isTyping.current &&
    previousPropSearch.current !== search &&
    search !== searchValue

  const handleSearch = ({ target: { value } }) => {
    isTyping.current = true
    setSearch(value)
  }

  useEffect(() => {
    if (!isMounted.current) {
      setSearch(DEFAULT_STATE_ENTRIES.search)
      isMounted.current = true
    }

    if (shouldDeriveStateFromProps) {
      setSearch(search)
    }

    return () => {
      isTyping.current = false
    }
  })

  return (
    <InputGroup
      className="StarSearch"
      style={{ maxWidth: isMobile ? "calc(100% - 52px)" : 360 }}
    >
      <InputGroupAddon
        addonType="prepend"
        className="TelescopeIconContainer Center"
      >
        <InputGroupText tag={Link} to={RouteMap.HOME}>
          <i className="fab fa-wpexplorer TelescopeIcon" />
        </InputGroupText>
      </InputGroupAddon>

      <Input
        value={searchValue}
        placeholder="Search the stars..."
        className="p-0"
        onChange={handleSearch}
        // style={{ outline: "red" }}
      />
      <UseDebounce onChangeCallback={SearchUserEntries} value={searchValue} />
    </InputGroup>
  )
}

StarSearch.propTypes = {
  search: PropTypes.string,
  isMobile: PropTypes.bool,
  SearchUserEntries: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
