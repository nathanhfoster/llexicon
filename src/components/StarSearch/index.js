import React, { useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { Link } from "react-router-dom"
import { RouteMap } from "../../redux/router/actions"
import { SearchUserEntries } from "../../redux/Entries/actions"
import { DebounceInput } from "../"
import "./styles.css"

const mapStateToProps = ({
  Admin: {
    users: { isPending: adminIsPending },
  },
  Entries: { search, isPending },
  Window: { isMobile },
}) => ({
  isMobile,
  search,
  adminIsPending,
  isPending,
})

const mapDispatchToProps = { SearchUserEntries }

const StarSearch = ({
  isMobile,
  search,
  adminIsPending,
  isPending,
  SearchUserEntries,
}) => {
  const handleSearch = useCallback(
    (searchValue) => SearchUserEntries(searchValue),
    []
  )

  const iconClassName = useMemo(
    () =>
      adminIsPending || isPending
        ? "fas fa-sun SunIcon"
        : "fab fa-wpexplorer TelescopeIcon",
    [adminIsPending, isPending]
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
          <i className={iconClassName} />
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
  adminIsPending: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  SearchUserEntries: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(StarSearch)
