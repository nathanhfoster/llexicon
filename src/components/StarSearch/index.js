import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { Link } from "react-router-dom"
import { RouteMap } from "../../redux/router/actions"
import { SearchUserEntries } from "../../redux/Entries/actions"
import { DebounceInput } from "../"
import "./styles.css"

const mapStateToProps = ({ Entries: { search }, Window: { isMobile } }) => ({
  isMobile,
  search,
})

const mapDispatchToProps = { SearchUserEntries }

const StarSearch = ({ search, SearchUserEntries, isMobile }) => {
  const handleSearch = useCallback(
    (searchValue) => SearchUserEntries(searchValue),
    []
  )

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

      <DebounceInput
        defaultValue={search}
        placeholder="Search for entries"
        className="p-0"
        onChange={handleSearch}
      />
    </InputGroup>
  )
}

StarSearch.propTypes = {
  search: PropTypes.string,
  isMobile: PropTypes.bool,
  SearchUserEntries: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
