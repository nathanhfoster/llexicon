import React, { useEffect, useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { UsersProps } from 'redux/Admin/propTypes'
import { connect } from 'react-redux'
import UserEntriesTable from './UserEntriesTable'
import { BasicTable, Header } from '../../components'
import Moment from 'react-moment'
import { Container, Row, Col, ButtonGroup, Button, ButtonToolbar } from 'reactstrap'
import { GetAllUsers, GetAllUserEntries } from 'redux/Admin/actions'
import { stringMatch } from '../../utils'

const { REACT_APP_API_URL } = process.env

const TABLE_COLUMNS = [
  {
    title: <i className='fas fa-feather-alt' />,
    key: 'entries',
    width: 50,
    //   filter: "date",
    //   filterPlaceholder: "Date joined",
    render: ({ entries }) => entries?.length || 0,
    sort: (a, b, sortUp) => {
      const aLength = a?.entries?.length || 0
      const bLength = b?.entries?.length || 0
      return sortUp ? bLength - aLength : aLength - bLength
    },
    footer: items => items.reduce((count, { entries }) => count + (entries?.length || 0), 0),
  },
  {
    title: <i className='fas fa-id-card-alt' />,
    key: 'id',
    width: 120,
    filter: searchValue => ({ first_name, last_name }) =>
      stringMatch(`${first_name} ${last_name}`, searchValue),
    filterPlaceholder: 'Name',
    render: ({ id, first_name, last_name }) => (
      <a
        onClick={e => e.stopPropagation()}
        href={REACT_APP_API_URL.replace('api/v1/', `user/user/${id}/change/`)}
        target='_blank'
        rel='noopener noreferrer'
      >
        {`${first_name} ${last_name}`}
      </a>
    ),
    footer: items =>
      items.reduce(
        (count, { first_name, last_name }) => (count + first_name || last_name ? 1 : 0),
        0,
      ),
  },
  {
    title: <i className='fas fa-id-card' />,
    key: 'username',
    width: 120,
    render: ({ id, username }) => (
      <a
        onClick={e => e.stopPropagation()}
        href={REACT_APP_API_URL.replace('api/v1/', `user/user/${id}/change/`)}
        target='_blank'
        rel='noopener noreferrer'
      >
        {username}
      </a>
    ),
    footer: items => items.reduce((count, { username }) => (count + username ? 1 : 0), 0),
  },
  {
    title: <i className='fas fa-envelope' />,
    key: 'email',
    width: 140,
    footer: items =>
      items.reduce((count, { email }) => (count + email && email.includes('@') ? 1 : 0), 0),
  },
  {
    title: <i className='fas fa-chart-line' />,
    key: 'last_login',
    width: 120,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b.last_login) - new Date(a.last_login)
        : new Date(a.last_login) - new Date(b.last_login),

    filter: 'date',
    filterPlaceholder: 'Last login',
    render: ({ last_login }) => <Moment format='D MMM YY hh:mma'>{last_login}</Moment>,
  },
  {
    title: <i className='fas fa-birthday-cake' />,
    key: 'date_joined',
    width: 120,
    defaultSortValue: true,
    sort: (a, b, sortUp) =>
      sortUp
        ? new Date(b.date_joined) - new Date(a.date_joined)
        : new Date(a.date_joined) - new Date(b.date_joined),

    filter: 'date',
    filterPlaceholder: 'Date joined',
    render: ({ date_joined }) => <Moment format='D MMM YY hh:mma'>{date_joined}</Moment>,
  },
  {
    title: <i className='fas fa-hiking' />,
    key: 'is_active',
    width: 40,
    filterPlaceholder: 'Active',
    render: ({ is_active }) => (is_active ? 'Yes' : 'No'),
    footer: items => items.reduce((count, { is_active }) => count + is_active, 0),
  },
  {
    title: <i className='fas fa-user-check' />,
    key: 'opt_in',
    width: 40,
    filterPlaceholder: 'Opt',
    render: ({ opt_in }) => (opt_in ? 'Yes' : 'No'),
    footer: items => items.reduce((count, { opt_in }) => count + opt_in, 0),
  },
]

const mapStateToProps = ({
  Admin: {
    users: { isPending, items },
  },
}) => ({ isPending, users: items })

const mapDispatchToProps = {
  GetAllUsers,
  GetAllUserEntries,
}

const Admin = ({ isPending, users, GetAllUsers, GetAllUserEntries }) => {
  useEffect(() => {
    // Using an IIFE
    ;(async () => {
      await GetAllUsers()
      await GetAllUserEntries()
    })()
  }, [])

  const getRowValue = useCallback(
    user => <UserEntriesTable user={user} entries={user.entries} />,
    [],
  )

  const [usersSelected, setUsersSelected] = useState({})

  const handleActionMenuCallback = useCallback(selectedUsers => {
    setUsersSelected(selectedUsers)
  }, [])

  const handleClearUsersSelected = useCallback(() => {
    setUsersSelected({})
  }, [])

  const userEmails = useMemo(() => {
    const emails = users.reduce((acc, { id, email }) => {
      if (usersSelected[id] && email) {
        acc += `${email};`
      }
      return acc
    }, 'mailto:')
    const subject = '?subject=Astral%20Tree%20Support'
    const href = emails.concat(subject)
    return href
  }, [users, usersSelected])

  return (
    <Container className='Admin Container'>
      <Row className='Center'>
        <Col xs={12} className='p-0'>
          <Header fill='var(--quinaryColor)'>Admin Table</Header>
        </Col>
      </Row>
      <Row>
        <BasicTable
          sortable
          filterable
          pageSize={15}
          columns={TABLE_COLUMNS}
          dataDisplayName='Users'
          data={users}
          selectedDataMap={usersSelected}
          getRowValue={getRowValue}
          // onSortCallback={handleSortCallback}
          // onFilterCallback={handleFilterCallback}
          actionMenuCallback={handleActionMenuCallback}
        >
          <ButtonToolbar>
            <ButtonGroup>
              <Button
                color='accent'
                tag='a'
                href={userEmails}
                target='_blank'
                rel='noopener noreferrer'
                disabled={Object.keys(usersSelected).length === 0}
              >
                Email
              </Button>
              <Button
                color='accent'
                disabled={Object.keys(usersSelected).length === 0}
                onClick={handleClearUsersSelected}
              >
                Clear
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </BasicTable>
      </Row>
    </Container>
  )
}

Admin.propTypes = {
  isPending: PropTypes.bool.isRequired,
  users: UsersProps,
  GetAllUsers: PropTypes.func.isRequired,
  GetAllUserEntries: PropTypes.func.isRequired,
}

Admin.defaultProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
