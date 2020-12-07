import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import { useEventListener } from 'hooks'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RouteMap } from 'redux/router/actions'
import { SetSearchEntries, SearchUserEntries } from 'redux/Entries/actions'
import './styles.css'
import { BasicInput } from 'components'

const ESCAPE_KEYS = ['27', 'Escape']
const ENTER_KEYS = ['13', 'Enter']

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

const mapDispatchToProps = { SetSearchEntries, SearchUserEntries }

const StarSearch = ({
  isMobile,
  search,
  adminIsPending,
  isPending,
  SetSearchEntries,
  SearchUserEntries,
}) => {
  const handleOnChange = useCallback(({ target: { value } }) => SetSearchEntries(value), [
    SetSearchEntries,
  ])

  const handleSearch = useCallback(() => SearchUserEntries(search), [search])

  const iconClassName = useMemo(
    () => (adminIsPending || isPending ? 'fas fa-sun SunIcon' : 'fab fa-wpexplorer TelescopeIcon'),
    [adminIsPending, isPending],
  )

  const handler = useCallback(
    ({ key }) => {
      if (ENTER_KEYS.includes(key)) {
        handleSearch()
      }
    },
    [handleSearch],
  )

  useEventListener('keydown', handler)

  return (
    <InputGroup className='StarSearch' style={{ maxWidth: isMobile ? 'calc(100% - 52px)' : 360 }}>
      <BasicInput
        type='search'
        value={search}
        placeholder='Search for entries'
        className='p-0'
        autoComplete='on'
        formGroup={false}
        onChange={handleOnChange}
      />
      <InputGroupAddon
        addonType='append'
        className='TelescopeIconContainer Center'
        onClick={handleSearch}
      >
        <InputGroupText tag={Link} to={RouteMap.HOME}>
          <i className={iconClassName} />
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

StarSearch.propTypes = {
  isMobile: PropTypes.bool,
  search: PropTypes.string,
  adminIsPending: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  SetSearchEntries: PropTypes.func.isRequired,
  SearchUserEntries: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(StarSearch)
