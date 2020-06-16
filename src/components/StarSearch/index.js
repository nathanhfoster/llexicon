import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { Link } from "react-router-dom"
import { RouteMap } from "../../redux/router/actions"
import { SearchUserEntries } from "../../redux/Entries/actions"
import { DebounceInput } from "../"
import "./styles.css"

const mapStateToProps = ({ Entries: { search, isPending }, Window: { isMobile } }) => ({
  isMobile,
  search,
  isPending
})

const mapDispatchToProps = { SearchUserEntries }

const StarSearch = ({ isMobile, search, isPending, SearchUserEntries }) => {
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
          <i className={`fab fa-wpexplorer TelescopeIcon ${isPending ? 'Pending' : ''}`} />
        </InputGroupText>
      </InputGroupAddon>

      <DebounceInput
        value={search}
        placeholder="Search for entries"
        className="p-0"
        onChange={handleSearch}
      />
    </InputGroup>
  )
}

StarSearch.propTypes = {
  isMobile: PropTypes.bool,
  search: PropTypes.string,
  isPending: PropTypes.bool,
  SearchUserEntries: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
